import { NextResponse } from 'next/server'
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

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
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

    const { error: updateError } = await getSupabaseAdmin()
      .from('orders')
      .update({ status: 'processing' })
      .eq('id', order.id)

    if (updateError) {
      console.error('Error updating order status:', updateError)
    }

    // Fire async pipeline — don't await so we return 200 quickly
    processOrder(order as Order).catch((err) => {
      console.error('Error processing order:', order.id, err)
    })
  }

  return NextResponse.json({ received: true })
}
