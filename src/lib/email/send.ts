import fs from 'fs'
import path from 'path'
import { Resend } from 'resend'
import { render } from '@react-email/components'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import { ReportEmail } from './report-template'
import { injectPhotoThumbnails } from './inject-thumbnails'

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

export async function sendOrderNotification(order: {
  id: string
  email: string
  dating_goal: string
  age: number | null
  location: string | null
  gender: string | null
  source: string | null
  created_at: string
}): Promise<void> {
  const lines = [
    `New order completed!`,
    ``,
    `Order ID: ${order.id}`,
    `Customer: ${order.email}`,
    `Dating goal: ${order.dating_goal}`,
    order.age ? `Age: ${order.age}` : null,
    order.location ? `Location: ${order.location}` : null,
    order.gender ? `Gender: ${order.gender}` : null,
    order.source ? `Source: ${order.source}` : null,
    ``,
    `Created: ${new Date(order.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
  ]

  const { error } = await getResend().emails.send({
    from: 'Hitch Alerts <support@tinderprofileoptimizer.com>',
    to: 'support@tinderprofileoptimizer.com',
    subject: `[Order] New completed order from ${order.email}`,
    text: lines.filter(Boolean).join('\n'),
  })

  if (error) {
    console.error('Failed to send order notification:', error)
  }
}

export async function sendFreeScoreNotification(score: {
  email: string
  overall_score: number
  photo_score: number
  bio_score: number
  first_impression_score: number
}): Promise<void> {
  const lines = [
    `New free score generated!`,
    ``,
    `Email: ${score.email}`,
    `Overall: ${score.overall_score}/10`,
    `Photos: ${score.photo_score}/10`,
    `Bio: ${score.bio_score}/10`,
    `First Impression: ${score.first_impression_score}/10`,
    ``,
    `Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })}`,
  ]

  const { error } = await getResend().emails.send({
    from: 'Hitch Alerts <support@tinderprofileoptimizer.com>',
    to: 'support@tinderprofileoptimizer.com',
    subject: `[Free Score] New score from ${score.email}`,
    text: lines.join('\n'),
  })

  if (error) {
    console.error('Failed to send free score notification:', error)
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
