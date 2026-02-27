'use client'

import clsx from 'clsx'
import { Heart, Flame, Users } from 'lucide-react'

type DatingGoal = 'relationship' | 'casual' | 'friends'

const goals: {
  value: DatingGoal
  label: string
  description: string
  icon: typeof Heart
}[] = [
  {
    value: 'relationship',
    label: 'Relationship',
    description: 'Looking for something serious and long-term',
    icon: Heart,
  },
  {
    value: 'casual',
    label: 'Casual Dating',
    description: 'Open to seeing where things go, no pressure',
    icon: Flame,
  },
  {
    value: 'friends',
    label: 'Friends',
    description: 'Looking to meet new people and make friends',
    icon: Users,
  },
]

interface StepGoalProps {
  datingGoal: DatingGoal | null
  onGoalChange: (goal: DatingGoal) => void
  onNext: () => void
  onBack: () => void
}

export function StepGoal({
  datingGoal,
  onGoalChange,
  onNext,
  onBack,
}: StepGoalProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-medium text-slate-900">
          What&apos;s your dating goal?
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          We&apos;ll tailor your optimization to match what you&apos;re looking
          for.
        </p>
      </div>

      <div className="space-y-3">
        {goals.map((goal) => {
          const Icon = goal.icon
          const isSelected = datingGoal === goal.value

          return (
            <button
              key={goal.value}
              onClick={() => onGoalChange(goal.value)}
              className={clsx(
                'flex w-full items-center gap-4 rounded-xl p-4 text-left transition-all',
                isSelected
                  ? 'bg-blue-50 ring-2 ring-blue-600'
                  : 'bg-slate-50 ring-1 ring-slate-200 hover:bg-slate-100',
              )}
            >
              <div
                className={clsx(
                  'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-400',
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p
                  className={clsx(
                    'font-medium',
                    isSelected ? 'text-blue-900' : 'text-slate-900',
                  )}
                >
                  {goal.label}
                </p>
                <p className="text-sm text-slate-500">{goal.description}</p>
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 rounded-full py-3 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!datingGoal}
          className={clsx(
            'flex-1 rounded-full py-3 text-sm font-semibold transition-colors',
            datingGoal
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          )}
        >
          Continue
        </button>
      </div>
    </div>
  )
}
