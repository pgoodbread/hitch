'use client'

import { useCookieConsent } from '@/contexts/cookie-consent-context'
import { useEffect, useState } from 'react'

export function CookieBanner() {
  const { showBanner, acceptCookies, declineCookies } = useCookieConsent()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !showBanner) {
    return null
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex-1 text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-1 font-semibold text-gray-900 dark:text-gray-100">
              🍪 Cookies! 🍪
            </p>
            <p>
              We use cookies to analyze site usage and deliver the{' '}
              <span className="font-semibold text-blue-600">
                best{' '}
                <span className="font-bold text-blue-600 underline decoration-yellow-500 decoration-dotted underline-offset-4">
                  Tinder{' '}
                </span>{' '}
                optimization experience
              </span>{' '}
              to{' '}
              <span className="font-bold text-blue-600 underline decoration-yellow-500 decoration-dotted underline-offset-4">
                you
              </span>
              . 😊
              <br />
              Click &quot;Accept&quot; to help us help you match your dream
              partner.
            </p>
          </div>
          <div className="flex shrink-0 gap-3">
            <button
              onClick={declineCookies}
              className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Decline cookies"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              aria-label="Accept cookies"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
