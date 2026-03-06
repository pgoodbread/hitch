import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { ReportEmail } from './report-template'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const ALLOWED_HTML: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'p',
    'br',
    'hr',
    'ul',
    'ol',
    'li',
    'strong',
    'em',
    'b',
    'i',
    'blockquote',
    'code',
    'pre',
    'table',
    'thead',
    'tbody',
    'tr',
    'th',
    'td',
  ],
  allowedAttributes: {},
  disallowedTagsMode: 'escape',
}

export interface PhotoAttachment {
  content: Buffer
  filename: string
}

/**
 * Inject inline thumbnail images into the report HTML next to each
 * "Photo N" reference (bold text). Only injects for photos we have.
 */
function injectPhotoThumbnails(html: string, photoCount: number): string {
  let result = html
  for (let i = 1; i <= photoCount; i++) {
    const imgTag =
      `<img src="cid:photo${i}" alt="Photo ${i}" width="60" ` +
      `style="display:block;border-radius:4px;border:1px solid #e2e8f0;margin-bottom:6px">`
    // Match <strong>Photo N</strong> (with optional trailing content inside the tag)
    const pattern = new RegExp(`(<strong>Photo ${i}\\b)(.*?</strong>)`)
    result = result.replace(pattern, `${imgTag}$1$2`)
  }
  return result
}

export async function sendReportEmail(
  to: string,
  markdownReport: string,
  photos: PhotoAttachment[] = [],
): Promise<void> {
  const rawHtml = await marked(markdownReport)
  const sanitized = sanitizeHtml(rawHtml, ALLOWED_HTML)
  const reportHtml = injectPhotoThumbnails(sanitized, photos.length)
  const html = await render(ReportEmail({ reportHtml }))

  const logoPath = path.resolve(process.cwd(), 'public/logo.png')
  const logoAttachment = {
    content: fs.readFileSync(logoPath),
    filename: 'logo.png',
    contentId: 'logo',
  }

  const photoAttachments = photos.map((photo, i) => ({
    content: photo.content,
    filename: photo.filename,
    contentId: `photo${i + 1}`,
  }))

  const attachments = [logoAttachment, ...photoAttachments]

  const { error } = await getResend().emails.send({
    from: 'Tinder Profile Optimizer <reports@tinderprofileoptimizer.com>',
    replyTo: 'support@tinderprofileoptimizer.com',
    to,
    subject: 'Your Tinder Profile Optimization Report',
    html,
    attachments,
  })

  if (error) {
    console.error('Failed to send email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}

export async function sendErrorNotification(
  orderId: string,
  errorMessage: string,
): Promise<void> {
  const { error } = await getResend().emails.send({
    from: 'Hitch Alerts <support@tinderprofileoptimizer.com>',
    to: 'support@tinderprofileoptimizer.com',
    subject: `[Alert] Order processing failed: ${orderId}`,
    text: `Order ${orderId} failed:\n\n${errorMessage}`,
  })

  if (error) {
    console.error('Failed to send error notification:', error)
  }
}
