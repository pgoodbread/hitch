'use client'

import clsx from 'clsx'
import { Check } from 'lucide-react'

const STEPS = ['Photos', 'Goal', 'About You', 'Email']

interface StepperProps {
  currentStep: number
}

export function Stepper({ currentStep }: StepperProps) {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="flex items-center justify-between">
        {STEPS.map((label, index) => {
          const step = index + 1
          const isCompleted = currentStep > step
          const isCurrent = currentStep === step

          return (
            <li key={label} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                    isCompleted && 'bg-blue-600 text-white',
                    isCurrent &&
                      'border-2 border-blue-600 bg-white text-blue-600',
                    !isCompleted &&
                      !isCurrent &&
                      'border-2 border-slate-300 bg-white text-slate-400',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : step}
                </div>
                <span
                  className={clsx(
                    'mt-2 text-xs font-medium',
                    isCurrent ? 'text-blue-600' : 'text-slate-500',
                  )}
                >
                  {label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={clsx(
                    'mx-2 h-0.5 w-8 sm:w-16',
                    isCompleted ? 'bg-blue-600' : 'bg-slate-200',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
