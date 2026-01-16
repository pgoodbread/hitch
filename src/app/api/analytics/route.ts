import { NextResponse } from 'next/server'
import posthog from 'posthog-js'

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
    const { event, source, ...rest } =
      (await request.json()) as AnalyticsRequest

    if (!event || typeof event !== 'string') {
      return NextResponse.json({ error: 'Event is required' }, { status: 400 })
    }

    if (!VALID_EVENTS.some((validEvent) => validEvent === event)) {
      return NextResponse.json({ error: 'Invalid event name' }, { status: 400 })
    }

    console.log('Tracking event:', event, source, rest)
    const result = posthog.capture(event, { source, ...rest })
    console.log('Result:', result)

    return NextResponse.json({ success: result !== undefined }, { status: 201 })
  } catch (error) {
    console.error('Error tracking event:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
