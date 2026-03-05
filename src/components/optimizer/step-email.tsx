'use client'

import clsx from 'clsx'
import { Loader2, Lock } from 'lucide-react'

interface StepEmailProps {
  email: string
  onEmailChange: (email: string) => void
  onSubmit: () => void
  onBack: () => void
  isSubmitting: boolean
  error?: string | null
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function StepEmail({
  email,
  onEmailChange,
  onSubmit,
  onBack,
  isSubmitting,
  error,
}: StepEmailProps) {
  const isValid = isValidEmail(email)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-medium text-slate-900">
          Where should we send your results?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your optimized profile report will be delivered to this email.
        </p>
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-700"
        >
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="you@example.com"
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && isValid && !isSubmitting) onSubmit()
          }}
        />
      </div>

      <div className="rounded-lg bg-slate-50 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Lock className="h-4 w-4 text-slate-400" />
          <span>Your data is private. Photos are deleted after analysis.</span>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 rounded-full py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className={clsx(
            'flex-1 rounded-full py-3 text-sm font-semibold transition-colors',
            isValid && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </span>
          ) : (
            'Complete & Pay $29'
          )}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
