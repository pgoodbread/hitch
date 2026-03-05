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
  ],
  allowedAttributes: {},
  disallowedTagsMode: 'escape',
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
  const rawHtml = await marked(markdownReport)
  const reportHtml = sanitizeHtml(rawHtml, ALLOWED_HTML)
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
