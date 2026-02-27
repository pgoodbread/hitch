import type { Order } from '@/lib/orders'
import { updateOrderStatus } from '@/lib/orders'
import { analyzeProfile } from './pipeline'
import { sendReportEmail } from '@/lib/email/send'
import { deleteUploadedFiles } from '@/lib/uploadthing-server'

const UPLOADTHING_BASE_URL = 'https://utfs.io/f/'

export async function processOrder(order: Order): Promise<void> {
  try {
    // Build image URLs from upload keys
    const imageUrls = (order.upload_keys as string[]).map(
      (key) => `${UPLOADTHING_BASE_URL}${key}`,
    )

    // Run AI analysis
    const report = await analyzeProfile(
      imageUrls,
      order.dating_goal,
      order.about_user,
      order.age,
    )

    // Store report and send email
    await updateOrderStatus(order.id, 'completed', { ai_report: report })
    await sendReportEmail(order.email, report)

    // Clean up uploaded images
    await deleteUploadedFiles(order.upload_keys as string[]).catch((err) =>
      console.error('Failed to delete uploaded files:', err),
    )
  } catch (error) {
    console.error('Order processing failed:', order.id, error)
    await updateOrderStatus(order.id, 'failed')
  }
}
