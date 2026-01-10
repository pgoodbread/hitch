'use client'

import { Fragment, useState } from 'react'
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from '@headlessui/react'

import { Button } from '@/components/Button'

export function OptimizeModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [email, setEmail] = useState('')
  const [goal, setGoal] = useState<'relationship' | 'casual'>('relationship')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  function handleClose() {
    onClose()
    // Reset form after modal closes
    setTimeout(() => {
      setEmail('')
      setGoal('relationship')
      setSubmitted(false)
    }, 300)
  }

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
                {submitted ? (
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
                      We&apos;ll reach out when we&apos;re ready for you.
                    </p>
                    <div className="mt-6">
                      <Button onClick={handleClose} color="blue">
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <DialogTitle
                      as="h3"
                      className="text-lg leading-6 font-medium text-slate-900"
                    >
                      Optimize my profile
                    </DialogTitle>
                    <p className="mt-2 text-sm text-slate-500">
                      Get a personalized profile review delivered in 24-48
                      hours.
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
                          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                          placeholder="you@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700">
                          What&apos;s your dating goal?
                        </label>
                        <div className="mt-2 space-y-2">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="goal"
                              value="relationship"
                              checked={goal === 'relationship'}
                              onChange={() => setGoal('relationship')}
                              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-slate-700">
                              Long-term relationship
                            </span>
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name="goal"
                              value="casual"
                              checked={goal === 'casual'}
                              onChange={() => setGoal('casual')}
                              className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-3 text-sm text-slate-700">
                              Casual dating
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className="mt-6 flex gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          color="slate"
                          onClick={handleClose}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                        <Button type="submit" color="blue" className="flex-1">
                          Continue - $29
                        </Button>
                      </div>
                    </form>
                  </>
                )}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
