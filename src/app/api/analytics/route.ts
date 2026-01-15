import { NextResponse } from 'next/server'
// import { trackEvent, type AnalyticsEvent } from '@/lib/db'

const VALID_EVENTS: string[] = [
  'page_view',
  'cta_click',
  'intent_yes',
  'intent_no',
  'form_submit',
  'form_error',
]

interface AnalyticsRequest {
  event: string
  source?: string | null
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyticsRequest

    if (!body.event || typeof body.event !== 'string') {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 })
    }

    if (!VALID_EVENTS.includes(body.event as string)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 })
    }

    // const result = trackEvent(body.event as AnalyticsEvent, body.source ?? null)

    // return NextResponse.json({ success: result.success }, { status: 201 })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
