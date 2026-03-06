import { NextResponse } from 'next/server'
import { after } from 'next/server'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const body = await request.text()

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('Missing RESEND_WEBHOOK_SECRET environment variable')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any

  try {
    event = resend.webhooks.verify({
      payload: body,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret,
    })
  } catch (err) {
    console.error('Resend webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type !== 'email.received') {
    return NextResponse.json({ received: true })
  }

  const emailId: string = event.data.email_id

  // Fetch full email content (webhook payload doesn't include body)
  const response = await fetch(
    `https://api.resend.com/emails/receiving/${emailId}`,
    {
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    },
  )

  if (!response.ok) {
    console.error(
      'Failed to fetch received email:',
      response.status,
      await response.text(),
    )
    return NextResponse.json({ received: true })
  }

  const email = await response.json()

  // Store in Supabase
  const { error: dbError } = await getSupabaseAdmin()
    .from('support_emails')
    .upsert(
      {
        email_id: emailId,
        from_address: email.from,
        to_addresses: email.to,
        subject: email.subject,
        body_text: email.text,
        body_html: email.html,
      },
      { onConflict: 'email_id' },
    )

  if (dbError) {
    console.error('Failed to store support email:', dbError)
  }

  // Forward to personal inbox in background
  after(async () => {
    try {
      const forwardTo = process.env.SUPPORT_FORWARD_EMAIL
      if (forwardTo) {
        const { error: sendError } = await resend.emails.send({
          from: 'Hitch Support <support@tinderprofileoptimizer.com>',
          to: forwardTo,
          subject: `[Support] ${email.subject || '(no subject)'}`,
          text: `From: ${email.from}\n\n${email.text || ''}`,
          ...(email.html
            ? {
                html: `<p><strong>From:</strong> ${email.from}</p><hr>${email.html}`,
              }
            : {}),
        })

        if (sendError) {
          console.error('Failed to forward support email:', sendError)
        }
      }
    } catch (err) {
      console.error('Error forwarding email:', emailId, err)
    }
  })

  return NextResponse.json({ received: true })
}
