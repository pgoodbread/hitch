import posthog from 'posthog-js'

// Property interfaces for each funnel event
export interface CtaClickedProps {
  cta_id: string
  placement: 'home'
  pathname: string
}

export interface ModalCtaClickedProps {
  cta_id: string
  placement: 'modal'
  modal_id: string
  pathname: string
}

export interface FormSubmittedProps {
  form_id: string
  fields_count: number
  pathname: string
}

export interface CheckoutCompletedProps {
  plan: string
  value: number
  currency: string
}

/**
 * Safely capture a PostHog event.
 * Only fires if PostHog has been initialized (respects cookie consent).
 */
function safeCapture(event: string, properties?: object): void {
  try {
    // Check if PostHog is loaded (initialized after cookie consent)
    if (typeof posthog !== 'undefined' && posthog.__loaded) {
      posthog.capture(event, properties as Record<string, unknown>)
    }
  } catch {
    // Silent fail - analytics should not block user experience
  }
}

/**
 * Track home page CTA click
 * Funnel step 2: CTA click on home page (not modal)
 */
export function trackCtaClicked(props: CtaClickedProps): void {
  safeCapture('cta_clicked', props)
}

/**
 * Track modal CTA click
 * Funnel step 3: CTA click inside modal
 */
export function trackModalCtaClicked(props: ModalCtaClickedProps): void {
  safeCapture('modal_cta_clicked', props)
}

/**
 * Track form submission
 * Funnel step 4: Form submitted
 */
export function trackFormSubmitted(props: FormSubmittedProps): void {
  safeCapture('form_submitted', props)
}

/**
 * Track checkout completion
 * Funnel step 5: Checkout completed
 */
export function trackCheckoutCompleted(props: CheckoutCompletedProps): void {
  safeCapture('checkout_completed', props)
}

/**
 * Manually capture a pageview for SPA route changes.
 * PostHog auto-captures on initial load, but for client-side navigation
 * you may need to call this in a useEffect when pathname changes.
 *
 * Example:
 *   useEffect(() => {
 *     capturePageview()
 *   }, [pathname])
 */
export function capturePageview(): void {
  safeCapture('$pageview')
}
