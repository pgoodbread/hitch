import { Resend } from 'resend'
import { render } from '@react-email/components'
import { marked } from 'marked'
import { ReportEmail } from './report-template'

let _resend: Resend | null = null
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

export async function sendReportEmail(
  to: string,
  markdownReport: string,
): Promise<void> {
  const reportHtml = await marked(markdownReport)
  const html = await render(ReportEmail({ reportHtml }))

  const { error } = await getResend().emails.send({
    from: 'Tinder Profile Optimizer <reports@tinderprofileoptimizer.com>',
    to,
    subject: 'Your Tinder Profile Optimization Report',
    html,
  })

  if (error) {
    console.error('Failed to send email:', error)
    throw new Error(`Failed to send email: ${error.message}`)
  }
}
