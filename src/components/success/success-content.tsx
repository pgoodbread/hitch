'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { track } from '@/lib/analytics'

type OrderStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'loading'

export function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [status, setStatus] = useState<OrderStatus>('loading')
  const trackedRef = useRef(false)

  const pollStatus = useCallback(async () => {
    if (!sessionId) return

    try {
      const res = await fetch(
        `/api/orders/status?session_id=${encodeURIComponent(sessionId)}`,
      )
      if (!res.ok) return

      const data = await res.json()
      setStatus(data.status)
    } catch {
      // Silently retry on network errors
    }
  }, [sessionId])

  useEffect(() => {
    if (!sessionId) {
      setStatus('failed')
      return
    }

    // Don't poll if already in a terminal state
    if (status === 'completed' || status === 'failed') return

    pollStatus()
    const interval = setInterval(() => {
      pollStatus()
    }, 4000)

    return () => clearInterval(interval)
  }, [sessionId, pollStatus, status])

  useEffect(() => {
    if (trackedRef.current) return

    if (status === 'completed') {
      trackedRef.current = true
      track('optimizer_payment_completed', { session_id: sessionId })
    } else if (status === 'failed') {
      trackedRef.current = true
      track('optimizer_payment_failed', { session_id: sessionId })
    }
  }, [status, sessionId])

  if (status === 'loading' || status === 'pending' || status === 'processing') {
    return (
      <div className="mx-auto max-w-md text-center">
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
        <h1 className="mt-6 font-display text-2xl font-medium text-slate-900">
          {status === 'loading'
            ? 'Checking order status...'
            : status === 'pending'
              ? 'Payment confirmed!'
              : 'Analyzing your profile...'}
        </h1>
        <p className="mt-4 text-slate-600">
          {status === 'processing'
            ? 'Our AI is reviewing your photos and crafting your personalized report. This usually takes 1-2 minutes.'
            : 'Hang tight, this will only take a moment.'}
        </p>
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="mx-auto max-w-md text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h1 className="mt-6 font-display text-2xl font-medium text-slate-900">
          Your report is ready!
        </h1>
        <p className="mt-4 text-slate-600">
          We&apos;ve sent your personalized Tinder profile optimization report
          to your email. Check your inbox (and spam folder, just in case).
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to home
        </Link>
      </div>
    )
  }

  // Failed
  return (
    <div className="mx-auto max-w-md text-center">
      <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
      <h1 className="mt-6 font-display text-2xl font-medium text-slate-900">
        Something went wrong
      </h1>
      <p className="mt-4 text-slate-600">
        We ran into an issue processing your order. Please contact us and
        we&apos;ll get it sorted right away.
      </p>
      <a
        href="mailto:support@tinderprofileoptimizer.com"
        className="mt-8 inline-flex items-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500"
      >
        Contact support
      </a>
    </div>
  )
}
