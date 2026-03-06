import type { Order } from '@/lib/orders'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { analyzeProfile } from './pipeline'
import {
  sendReportEmail,
  sendErrorNotification,
  sendOrderNotification,
} from '@/lib/email/send'
import { deleteUploadedFiles } from '@/lib/uploadthing-server'
import sharp from 'sharp'

async function updateOrderAdmin(
  id: string,
  status: Order['status'],
  extra?: { ai_report?: string },
) {
  const { error } = await getSupabaseAdmin()
    .from('orders')
    .update({ status, ...extra })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
  }
}

const UPLOADTHING_BASE_URL = 'https://utfs.io/f/'
const THUMBNAIL_WIDTH = 150

async function generateThumbnails(
  imageBuffers: Buffer[],
): Promise<{ content: Buffer; filename: string }[]> {
  return Promise.all(
    imageBuffers.map(async (buf, i) => {
      const thumbnail = await sharp(buf)
        .resize(THUMBNAIL_WIDTH)
        .jpeg({ quality: 80 })
        .toBuffer()

      return {
        content: thumbnail,
        filename: `photo${i + 1}.jpg`,
      }
    }),
  )
}

export async function processOrder(order: Order): Promise<void> {
  try {
    // Build image URLs from upload keys
    const imageUrls = (order.upload_keys as string[]).map(
      (key) => `${UPLOADTHING_BASE_URL}${key}`,
    )

    // Run AI analysis
    const { report, imageBuffers } = await analyzeProfile({
      imageUrls,
      datingGoal: order.dating_goal,
      aboutUser: order.about_user,
      age: order.age,
      location: order.location,
      gender: order.gender,
      lookingFor: order.looking_for,
    })

    // Generate thumbnails for email
    const thumbnails = await generateThumbnails(imageBuffers)

    // Store report and send email
    await updateOrderAdmin(order.id, 'completed', { ai_report: report })
    await sendReportEmail(order.email, report, thumbnails)
    await sendOrderNotification(order).catch((err) =>
      console.error('Failed to send order notification:', err),
    )

    // Clean up uploaded images
    await deleteUploadedFiles(order.upload_keys as string[]).catch((err) =>
      console.error('Failed to delete uploaded files:', err),
    )
  } catch (error) {
    console.error('Order processing failed:', order.id, error)
    await updateOrderAdmin(order.id, 'failed')
    await sendErrorNotification(
      order.id,
      error instanceof Error ? error.message : String(error),
    ).catch(() => {})
  }
}
