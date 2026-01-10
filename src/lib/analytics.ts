export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intent_yes'
  | 'intent_no'
  | 'form_submit'
  | 'form_error'

export function track(event: AnalyticsEvent): void {
  const source = new URLSearchParams(window.location.search).get('utm_source')

  fetch('/api/analytics', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, source }),
  }).catch(() => {
    // Silently fail - analytics should not block user experience
  })
}
