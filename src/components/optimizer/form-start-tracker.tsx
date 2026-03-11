'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'
import { track } from '@/lib/analytics'

export function FormStartTracker() {
  const posthog = usePostHog()

  useEffect(() => {
    if (posthog?.__loaded) {
      track('optimizer_form_started')
    }
  }, [posthog])

  return null
}
