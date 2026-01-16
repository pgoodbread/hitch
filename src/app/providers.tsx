'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { createContext, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { CookieConsentProvider } from '@/contexts/cookie-consent-context'
import { CookieBanner } from '@/components/cookie-banner'

function getCookieConsent(): string | null {
  if (typeof window === 'undefined') return null

  const nameEQ = 'cookie-consent='
  const cookies = document.cookie.split(';')

  for (const cookie of cookies) {
    const c = cookie.trim()
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length)
    }
  }
  return null
}

function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only initialize PostHog if user has accepted cookies
    const consent = getCookieConsent()

    if (consent === 'accepted' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
        person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
        disable_session_recording: true,
        advanced_disable_feature_flags: true,
      })
    } else if (consent === 'declined') {
      // Ensure PostHog is not running if consent is declined
      if (typeof posthog !== 'undefined' && posthog.opt_out_capturing) {
        posthog.opt_out_capturing()
      }
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

function usePrevious<T>(value: T) {
  const ref = useRef<T>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export const AppContext = createContext<{ previousPathname?: string }>({})

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const previousPathname = usePrevious(pathname)

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <CookieConsentProvider>
        <PostHogProvider>{children}</PostHogProvider>
        <CookieBanner />
      </CookieConsentProvider>
    </AppContext.Provider>
  )
}
