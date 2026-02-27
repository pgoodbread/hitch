import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getOrderBySessionId, updateOrderStatus } from '@/lib/orders'
import { processOrder } from '@/lib/ai/process-order'
import type Stripe from 'stripe'

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

    const order = await getOrderBySessionId(session.id)
    if (!order) {
      console.error('Order not found for session:', session.id)
      return NextResponse.json({ received: true })
    }

    await updateOrderStatus(order.id, 'processing')

    // Fire async pipeline — don't await so we return 200 quickly
    processOrder(order).catch((err) => {
      console.error('Error processing order:', order.id, err)
    })
  }

  return NextResponse.json({ received: true })
}
