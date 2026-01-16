import { NextResponse } from 'next/server'
import { insertLead } from '@/lib/db'

interface LeadRequest {
  email: string
  willing_to_pay: boolean
  price_shown: number
  main_problem: string
  source?: string | null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as LeadRequest

    // Validate required fields
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 },
      )
    }

    if (typeof body.willing_to_pay !== 'boolean') {
      return NextResponse.json(
        { error: 'willing_to_pay must be a boolean' },
        { status: 400 },
      )
    }

    if (typeof body.price_shown !== 'number') {
      return NextResponse.json(
        { error: 'price_shown must be a number' },
        { status: 400 },
      )
    }

    const result = await insertLead({
      email: body.email.trim().toLowerCase(),
      willing_to_pay: body.willing_to_pay,
      price_shown: body.price_shown,
      main_problem: body.main_problem.trim(),
      source: body.source ?? null,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to save lead' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
