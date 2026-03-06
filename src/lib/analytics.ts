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
  | 'scroll_depth'
  | 'city_page_view'
  | 'city_cta_click'
  | 'optimizer_form_started'
  | 'optimizer_step_completed'
  | 'optimizer_checkout_started'
  | 'optimizer_payment_completed'
  | 'optimizer_payment_failed'
  | 'free_score_submitted'
  | 'free_score_completed'
  | 'free_score_failed'
  | 'free_score_cta_click'

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
