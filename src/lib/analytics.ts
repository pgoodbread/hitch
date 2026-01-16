import posthog from 'posthog-js'

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intent_yes'
  | 'intent_no'
  | 'form_submit'
  | 'form_error'
  | 'field_focus_email'
  | 'field_focus_checkbox'
  | 'field_focus_textarea'
  | 'field_blur_email'

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
