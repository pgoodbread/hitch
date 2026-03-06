import { NextResponse } from 'next/server'
import { after } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { processOrder } from '@/lib/ai/process-order'
import type Stripe from 'stripe'
import type { Order } from '@/lib/orders'

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    throw new Error('Missing STRIPE_WEBHOOK_SECRET environment variable')
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    const { data: order, error } = await getSupabaseAdmin()
      .from('orders')
      .select('*')
      .eq('stripe_session_id', session.id)
      .single()

    if (error || !order) {
      console.error('Order not found for session:', session.id, error)
      return NextResponse.json({ received: true })
    }

    // Atomic idempotency guard: only transition pending → processing
    const { data: claimed, error: updateError } = await getSupabaseAdmin()
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id)
      .eq('status', 'pending')
      .select('id')
      .single()

    if (updateError || !claimed) {
      console.warn(
        `Duplicate webhook for order ${order.id} — skipping (already claimed or not pending)`,
      )
      return NextResponse.json({ received: true })
    }

    // Use after() to keep the serverless function alive for background processing
    after(async () => {
      try {
        await processOrder(order as Order)
      } catch (err) {
        console.error('Error processing order:', order.id, err)
      }

      // Mark free score as converted if this email had a free score
      try {
        await getSupabaseAdmin()
          .from('free_scores')
          .update({ converted: true })
          .eq('email', order.email)
      } catch (err) {
        console.error('Failed to mark free score conversion:', err)
      }
    })
  }

  return NextResponse.json({ received: true })
}
