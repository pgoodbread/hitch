'use client'

import { useEffect, useState } from 'react'
import posthog from 'posthog-js'

const STORAGE_KEY = 'analytics-opt-out'

export function AnalyticsOptOut() {
  const [optedOut, setOptedOut] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'true') {
      posthog.opt_out_capturing()
      setOptedOut(true)
    } else {
      setOptedOut(posthog.has_opted_out_capturing())
    }
    setMounted(true)
  }, [])

  function toggle() {
    if (optedOut) {
      posthog.opt_in_capturing()
      localStorage.removeItem(STORAGE_KEY)
      setOptedOut(false)
    } else {
      posthog.opt_out_capturing()
      localStorage.setItem(STORAGE_KEY, 'true')
      setOptedOut(true)
    }
  }

  if (!mounted) return null

  return (
    <div className="mt-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            {optedOut ? 'Analytics disabled' : 'Analytics active'}
          </p>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {optedOut
              ? 'No analytics data is being collected.'
              : 'Anonymous, cookieless analytics are active.'}
          </p>
        </div>
        <button
          onClick={toggle}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            optedOut
              ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600'
              : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800'
          }`}
        >
          {optedOut ? 'Enable analytics' : 'Disable analytics'}
        </button>
      </div>
      <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
        Your preference is saved in your browser&apos;s local storage and will
        persist across page reloads.
      </p>
    </div>
  )
}
