import { Resend } from 'resend'
import { render } from '@react-email/components'
import { marked } from 'marked'
import { ReportEmail } from './report-template'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export interface PhotoAttachment {
  content: Buffer
  filename: string
}

export async function sendReportEmail(
  to: string,
  markdownReport: string,
  photos: PhotoAttachment[] = [],
): Promise<void> {
  const reportHtml = await marked(markdownReport)
  const photoCount = photos.length
  const html = await render(ReportEmail({ reportHtml, photoCount }))

  const attachments = photos.map((photo, i) => ({
    content: photo.content,
    filename: photo.filename,
    content_id: `photo${i + 1}`,
  }))

  const { error } = await getResend().emails.send({
    from: 'Tinder Profile Optimizer <reports@tinderprofileoptimizer.com>',
    to,
    subject: 'Your Tinder Profile Optimization Report',
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  })

  if (error) {
    console.error('Failed to send email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
