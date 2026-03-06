'use client'

import { useCallback } from 'react'
import clsx from 'clsx'
import { Lock, Camera, FileText, Sparkles } from 'lucide-react'
import { track } from '@/lib/analytics'
import type { ScoreResult } from './types'

interface ScoreResultsProps {
  scores: ScoreResult
  email: string
}

function getScoreColor(score: number): string {
  if (score <= 3) return 'text-red-600'
  if (score <= 6) return 'text-yellow-600'
  return 'text-green-600'
}

function getBarColor(score: number): string {
  if (score <= 3) return 'bg-red-500'
  if (score <= 6) return 'bg-yellow-500'
  return 'bg-green-500'
}

function getBarTrackColor(score: number): string {
  if (score <= 3) return 'bg-red-100'
  if (score <= 6) return 'bg-yellow-100'
  return 'bg-green-100'
}

function ScoreBar({ score, label }: { score: number; label: string }) {
  const percentage = (score / 10) * 100

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className={clsx('text-lg font-bold', getScoreColor(score))}>
          {score.toFixed(1)}
        </span>
      </div>
      <div
        className={clsx(
          'mt-1.5 h-2.5 overflow-hidden rounded-full',
          getBarTrackColor(score),
        )}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-700',
            getBarColor(score),
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

function CategoryScore({
  icon: Icon,
  label,
  score,
  teaser,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  score: number
  teaser: string
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-slate-400" />
        <ScoreBar score={score} label={label} />
      </div>
      <p className="mt-3 text-sm text-slate-600 italic">
        &ldquo;{teaser}&rdquo;
      </p>
    </div>
  )
}

const LOCKED_ITEMS = [
  'Photo-by-photo verdict (keep / remove / replace)',
  'Optimal photo order for maximum matches',
  'Rewritten bio ready to paste',
  'Conversation starters that get replies',
  'Your personal action plan',
]

export function ScoreResults({ scores, email }: ScoreResultsProps) {
  const handleCtaClick = useCallback(() => {
    track('free_score_cta_click', { overall_score: scores.overall_score })
    window.location.href = `/optimize?email=${encodeURIComponent(email)}`
  }, [scores.overall_score, email])

  return (
    <div className="space-y-6">
      {/* Overall Score Card */}
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        <h2 className="text-center font-display text-lg font-medium tracking-tight text-slate-500 uppercase">
          Your Tinder Profile Score
        </h2>

        <div className="mt-6 text-center">
          <span
            className={clsx(
              'font-display text-6xl font-bold sm:text-7xl',
              getScoreColor(scores.overall_score),
            )}
          >
            {scores.overall_score.toFixed(1)}
          </span>
          <span className="ml-1 text-2xl text-slate-400 sm:text-3xl">/ 10</span>
        </div>

        <div className="mx-auto mt-4 max-w-xs">
          <div
            className={clsx(
              'h-3 overflow-hidden rounded-full',
              getBarTrackColor(scores.overall_score),
            )}
          >
            <div
              className={clsx(
                'h-full rounded-full transition-all duration-1000',
                getBarColor(scores.overall_score),
              )}
              style={{ width: `${(scores.overall_score / 10) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Scores */}
        <div className="mt-8 space-y-4">
          <CategoryScore
            icon={Camera}
            label="Photos"
            score={scores.photo_score}
            teaser={scores.photo_teaser}
          />
          <CategoryScore
            icon={FileText}
            label="Bio"
            score={scores.bio_score}
            teaser={scores.bio_teaser}
          />
          <CategoryScore
            icon={Sparkles}
            label="First Impression"
            score={scores.first_impression_score}
            teaser={scores.first_impression_teaser}
          />
        </div>
      </div>

      {/* Blurred/Locked Full Analysis */}
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-slate-400" />
            <h3 className="font-display text-lg font-medium text-slate-900">
              Your Full Analysis
            </h3>
          </div>

          {/* Blurred fake content */}
          <div className="mt-4 space-y-3 select-none" aria-hidden="true">
            {LOCKED_ITEMS.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700 [filter:blur(5px)]">
                    {item}
                  </p>
                  <p className="mt-1 text-sm text-slate-500 [filter:blur(5px)]">
                    Detailed personalized feedback and specific recommendations
                    for your profile improvement
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/60 to-white" />

        {/* CTA overlay */}
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <button
            onClick={handleCtaClick}
            className="w-full rounded-full bg-blue-600 py-3.5 text-sm font-semibold text-white shadow-lg transition-colors hover:bg-blue-500"
          >
            Unlock Full Analysis — $29
          </button>
        </div>
      </div>
    </div>
  )
}
