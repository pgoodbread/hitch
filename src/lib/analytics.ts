import posthog from 'posthog-js'

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intent_yes'
  | 'intent_no'
  | 'form_submit'
  | 'form_error'

export function track(
  event: AnalyticsEvent,
  properties?: Record<string, unknown>,
): void {
  const source = new URLSearchParams(window.location.search).get('utm_source')

  try {
    posthog.capture(event, { source, ...properties })
  } catch (error) {
    // Silently fail - analytics should not block user experience
    console.error('Error tracking event:', event, source, properties, error)
  }
}
