'use client'

import { useState } from 'react'

import { Button } from '@/components/Button'
import { Container } from '@/components/Container'
import { OptimizeModal } from '@/components/OptimizeModal'
import { track } from '@/lib/analytics'

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 flex-none fill-current stroke-current ${className || ''}`}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const features = [
  'Photo ranking and selection',
  'Rewritten bio',
  '2-3 conversation prompts',
  'Goal-specific optimization',
  'Delivered in 24-48 hours',
]

export function Pricing() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <section
        id="pricing"
        aria-label="Pricing"
        className="bg-slate-900 py-20 sm:py-32"
      >
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
              One-time profile optimization
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              No subscription. No recurring fees. Just results.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-md">
            <div className="rounded-3xl bg-blue-600 px-6 py-8 sm:px-8">
              <div className="flex items-baseline justify-center gap-x-2">
                <span className="font-display text-5xl font-light tracking-tight text-white">
                  $29
                </span>
                <span className="text-lg text-blue-200">one-time</span>
              </div>
              <p className="mt-4 text-center text-sm text-blue-200">
                Early access · Limited spots
              </p>
              <ul
                role="list"
                className="mt-8 flex flex-col gap-y-3 text-sm text-white"
              >
                {features.map((feature) => (
                  <li key={feature} className="flex">
                    <CheckIcon className="text-white" />
                    <span className="ml-4">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => {
                  track('cta_click')
                  setIsModalOpen(true)
                }}
                color="white"
                className="mt-8 w-full"
              >
                Optimize my profile
              </Button>
            </div>
          </div>
        </Container>
      </section>
      <OptimizeModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  )
}
