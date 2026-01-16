'use client'

import { Fragment, useState, useEffect } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'

import { Button } from '@/components/button'
import { track } from '@/lib/analytics'

type ModalStep = 'intent' | 'form' | 'confirmation'

export const PROFILE_OPTIMIZATION_PRICE = 29

export function OptimizeModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [step, setStep] = useState<ModalStep>('intent')
  const [email, setEmail] = useState('')
  const [willingToPay, setWillingToPay] = useState(false)
  const [mainProblem, setMainProblem] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldsFocused, setFieldsFocused] = useState({
    email: false,
    checkbox: false,
    textarea: false,
  })

  // Auto-close after 5 seconds on confirmation
  useEffect(() => {
    if (step === 'confirmation') {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [step, onClose])

  function handleClose() {
    onClose()
    // Reset form after modal closes
    setTimeout(() => {
      setStep('intent')
      setEmail('')
      setWillingToPay(false)
      setMainProblem('')
      setError(null)
      setFieldsFocused({ email: false, checkbox: false, textarea: false })
    }, 300)
  }

  function handleFieldFocus(field: 'email' | 'checkbox' | 'textarea') {
    if (!fieldsFocused[field]) {
      setFieldsFocused((prev) => ({ ...prev, [field]: true }))
      track(`field_focus_${field}`)
    }
  }

  function handleIntentYes() {
    track('intent_yes', { price: PROFILE_OPTIMIZATION_PRICE })
    setStep('form')
  }

  function handleIntentNo() {
    track('intent_no', { price: PROFILE_OPTIMIZATION_PRICE })
    handleClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          willing_to_pay: willingToPay,
          price_shown: PROFILE_OPTIMIZATION_PRICE,
          main_problem: mainProblem,
          source: new URLSearchParams(window.location.search).get('utm_source'),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit')
      }

      track('form_submit', {
        email,
        willing_to_pay: willingToPay,
        main_problem: mainProblem,
        price: 29,
      })
      setStep('confirmation')
    } catch {
      track('form_error')
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    email.trim() !== '' &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    willingToPay &&
    mainProblem.trim().length >= 10

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/50" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                {/* Close button */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                  aria-label="Close"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Step 1: Pay-Intent Screen */}
                {step === 'intent' && (
                  <div className="py-4">
                    <DialogTitle
                      as="h3"
                      className="text-lg leading-6 font-medium text-slate-900"
                    >
                      Early access — payment not collected yet
                    </DialogTitle>
                    <ul className="mt-4 space-y-2 text-sm text-slate-600">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        One-off Tinder profile optimization
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Price: ${PROFILE_OPTIMIZATION_PRICE}
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        Optimizer ready in: ~3 weeks
                      </li>
                    </ul>
                    <div className="mt-8 flex flex-col gap-3">
                      <Button
                        onClick={handleIntentYes}
                        color="blue"
                        className="w-full"
                      >
                        Yes, I intend to pay ${PROFILE_OPTIMIZATION_PRICE}
                      </Button>
                      <Button
                        onClick={handleIntentNo}
                        variant="outline"
                        color="slate"
                        className="w-full"
                      >
                        No, not interested
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Commitment Form */}
                {step === 'form' && (
                  <>
                    <DialogTitle
                      as="h3"
                      className="text-lg leading-6 font-medium text-slate-900"
                    >
                      Join the early access list
                    </DialogTitle>
                    <p className="mt-2 text-sm text-slate-500">
                      We&apos;ll reach out when we&apos;re ready.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-slate-700"
                        >
                          Email address
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => handleFieldFocus('email')}
                          onBlur={() => track('field_blur_email', { email })}
                          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={willingToPay}
                            onChange={(e) => setWillingToPay(e.target.checked)}
                            onFocus={() => handleFieldFocus('checkbox')}
                            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            required
                          />
                          <span className="text-sm text-slate-700">
                            I&apos;m willing to pay $
                            {PROFILE_OPTIMIZATION_PRICE} for a one-off Tinder
                            profile optimization when available.
                          </span>
                        </label>
                      </div>

                      <div>
                        <label
                          htmlFor="mainProblem"
                          className="block text-sm font-medium text-slate-700"
                        >
                          What&apos;s the main thing not working in your Tinder
                          profile right now?
                        </label>
                        <textarea
                          id="mainProblem"
                          minLength={10}
                          value={mainProblem}
                          onChange={(e) => setMainProblem(e.target.value)}
                          onFocus={() => handleFieldFocus('textarea')}
                          rows={3}
                          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="Tell us what's not working..."
                        />
                        {mainProblem.length > 0 && mainProblem.length < 10 && (
                          <p className="mt-1 text-xs text-slate-500">
                            Please write at least 10 characters (
                            {mainProblem.length}/10)
                          </p>
                        )}
                      </div>

                      {error && <p className="text-sm text-red-600">{error}</p>}

                      <Button
                        type="submit"
                        color="blue"
                        className="mt-6 w-full"
                        disabled={!isFormValid || isSubmitting}
                      >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                      </Button>
                    </form>
                  </>
                )}

                {/* Step 3: Confirmation Screen */}
                {step === 'confirmation' && (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="h-6 w-6 text-green-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12.75l6 6 9-13.5"
                        />
                      </svg>
                    </div>
                    <DialogTitle
                      as="h3"
                      className="mt-4 text-lg leading-6 font-medium text-slate-900"
                    >
                      You&apos;re on the list
                    </DialogTitle>
                    <p className="mt-2 text-sm text-slate-500">
                      You&apos;re on the early access list. If we move forward,
                      you&apos;ll hear from us first. If not, nothing happens.
                    </p>
                    <div className="mt-6">
                      <Button onClick={handleClose} color="blue">
                        Done
                      </Button>
                    </div>
                  </div>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
