'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { createContext, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { CookieConsentProvider } from '@/contexts/cookie-consent-context'
// import { CookieBanner } from '@/components/cookie-banner'

function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
        person_profiles: 'identified_only',
        persistence: 'memory',
        disable_session_recording: true,
        advanced_disable_feature_flags: true,
        disable_cookie: true,
      })

      if (localStorage.getItem('analytics-opt-out') === 'true') {
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
        {/* <CookieBanner /> */}
      </CookieConsentProvider>
    </AppContext.Provider>
  )
}
