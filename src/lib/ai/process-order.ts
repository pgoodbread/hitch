import type { Order } from '@/lib/orders'
import { updateOrderStatus } from '@/lib/orders'
import { analyzeProfile } from './pipeline'
import { sendReportEmail } from '@/lib/email/send'
import { deleteUploadedFiles } from '@/lib/uploadthing-server'
import sharp from 'sharp'

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
    await updateOrderStatus(order.id, 'completed', { ai_report: report })
    await sendReportEmail(order.email, report, thumbnails)

    // Clean up uploaded images
    await deleteUploadedFiles(order.upload_keys as string[]).catch((err) =>
      console.error('Failed to delete uploaded files:', err),
    )
  } catch (error) {
    console.error('Order processing failed:', order.id, error)
    await updateOrderStatus(order.id, 'failed')
  }
}
