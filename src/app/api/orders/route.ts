import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getStripe } from '@/lib/stripe'
import { createOrder, updateOrderStatus } from '@/lib/orders'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_PRICE_DOLLARS, PRODUCT_PRICE_CENTS } from '@/lib/config'

interface OrderRequest {
  email: string
  dating_goal: 'relationship' | 'casual' | 'friends'
  about_user: string
  age?: number | null
  location?: string | null
  gender?: string | null
  looking_for?: string[] | null
  upload_keys: string[]
  source?: string | null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const VALID_GOALS = ['relationship', 'casual', 'friends'] as const
const VALID_GENDERS = ['Male', 'Female', 'Non-binary'] as const
const VALID_LOOKING_FOR = ['Men', 'Women', 'Everyone'] as const
const MAX_ABOUT_LENGTH = 2000
const MAX_LOCATION_LENGTH = 200
const MAX_UPLOAD_KEYS = 20

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as OrderRequest

    // Validate required fields
    if (!body.email || !isValidEmail(body.email)) {
      return badRequest('Valid email is required')
    }

    if (!VALID_GOALS.includes(body.dating_goal)) {
      return badRequest('Invalid dating goal')
    }

    if (
      !body.about_user ||
      typeof body.about_user !== 'string' ||
      body.about_user.trim().length < 10
    ) {
      return badRequest('About you must be at least 10 characters')
    }

    if (body.about_user.trim().length > MAX_ABOUT_LENGTH) {
      return badRequest(
        `About you must be at most ${MAX_ABOUT_LENGTH} characters`,
      )
    }

    if (!Array.isArray(body.upload_keys) || body.upload_keys.length === 0) {
      return badRequest('At least one photo is required')
    }

    if (body.upload_keys.length > MAX_UPLOAD_KEYS) {
      return badRequest(`Maximum ${MAX_UPLOAD_KEYS} photos allowed`)
    }

    if (
      body.upload_keys.some((key) => typeof key !== 'string' || !key.trim())
    ) {
      return badRequest('Invalid upload key')
    }

    // Validate optional fields
    if (body.age != null) {
      const age = Number(body.age)
      if (!Number.isInteger(age) || age < 18 || age > 99) {
        return badRequest('Age must be an integer between 18 and 99')
      }
    }

    if (
      body.gender != null &&
      !VALID_GENDERS.includes(body.gender as (typeof VALID_GENDERS)[number])
    ) {
      return badRequest(`Gender must be one of: ${VALID_GENDERS.join(', ')}`)
    }

    if (body.looking_for != null) {
      if (
        !Array.isArray(body.looking_for) ||
        body.looking_for.some(
          (v) =>
            !VALID_LOOKING_FOR.includes(
              v as (typeof VALID_LOOKING_FOR)[number],
            ),
        )
      ) {
        return badRequest(
          `Looking for must be an array of: ${VALID_LOOKING_FOR.join(', ')}`,
        )
      }
    }

    if (
      body.location != null &&
      typeof body.location === 'string' &&
      body.location.trim().length > MAX_LOCATION_LENGTH
    ) {
      return badRequest(
        `Location must be at most ${MAX_LOCATION_LENGTH} characters`,
      )
    }

    const email = body.email.trim().toLowerCase()

    // Sanitize source: allow only alphanumeric, dots, hyphens, underscores; max 200 chars
    const source = body.source
      ? body.source.replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 200)
      : null

    // Upsert lead for email capture
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    await supabase.from('leads').upsert(
      {
        email,
        willing_to_pay: true,
        price_shown: PRODUCT_PRICE_DOLLARS,
        main_problem: body.dating_goal,
        source,
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
      location: body.location ?? null,
      gender: body.gender ?? null,
      looking_for: body.looking_for ?? null,
      upload_keys: body.upload_keys,
      source,
    })

    if ('error' in result) {
      return NextResponse.json(
        { error: 'Something went wrong', code: result.error },
        { status: 500 },
      )
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
            unit_amount: PRODUCT_PRICE_CENTS,
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
