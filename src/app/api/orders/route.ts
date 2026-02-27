import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createOrder, updateOrderStatus } from '@/lib/orders'
import { createClient } from '@/lib/supabase/server'

interface OrderRequest {
  email: string
  dating_goal: 'relationship' | 'casual' | 'friends'
  about_user: string
  age?: number | null
  upload_keys: string[]
  source?: string | null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const VALID_GOALS = ['relationship', 'casual', 'friends'] as const

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest

    // Validate
    if (!body.email || !isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 },
      )
    }

    if (!VALID_GOALS.includes(body.dating_goal)) {
      return NextResponse.json(
        { error: 'Invalid dating goal' },
        { status: 400 },
      )
    }

    if (
      !body.about_user ||
      typeof body.about_user !== 'string' ||
      body.about_user.trim().length < 10
    ) {
      return NextResponse.json(
        { error: 'About you must be at least 10 characters' },
        { status: 400 },
      )
    }

    if (!Array.isArray(body.upload_keys) || body.upload_keys.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required' },
        { status: 400 },
      )
    }

    const email = body.email.trim().toLowerCase()

    // Upsert lead for email capture
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.from('leads').upsert(
      {
        email,
        willing_to_pay: true,
        price_shown: 29,
        main_problem: body.dating_goal,
        source: body.source ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )

    // Create order
    const result = await createOrder({
      email,
      dating_goal: body.dating_goal,
      about_user: body.about_user.trim(),
      age: body.age ?? null,
      upload_keys: body.upload_keys,
      source: body.source ?? null,
    })

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Create Stripe Checkout session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Tinder Profile Optimization',
              description:
                'Complete profile review: photo ranking, bio rewrite, and conversation prompts',
            },
            unit_amount: 2900,
          },
          quantity: 1,
        },
      ],
      metadata: {
        order_id: result.id,
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/optimize`,
    })

    // Link Stripe session to order
    await updateOrderStatus(result.id, 'pending', {
      stripe_session_id: session.id,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
