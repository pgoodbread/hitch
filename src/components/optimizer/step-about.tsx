'use client'

import clsx from 'clsx'

interface StepAboutProps {
  age: string
  aboutUser: string
  onAgeChange: (age: string) => void
  onAboutChange: (about: string) => void
  onNext: () => void
  onBack: () => void
}

export function StepAbout({
  age,
  aboutUser,
  onAgeChange,
  onAboutChange,
  onNext,
  onBack,
}: StepAboutProps) {
  const isValid = aboutUser.trim().length >= 10

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-medium text-slate-900">
          Tell us about yourself
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          This helps us personalize your profile optimization.
        </p>
      </div>

      <div>
        <label
          htmlFor="age"
          className="block text-sm font-medium text-slate-700"
        >
          Age <span className="text-slate-400">(optional)</span>
        </label>
        <input
          id="age"
          type="number"
          min={18}
          max={99}
          value={age}
          onChange={(e) => onAgeChange(e.target.value)}
          placeholder="25"
          className="mt-1 block w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="about"
          className="block text-sm font-medium text-slate-700"
        >
          About you <span className="text-red-500">*</span>
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Describe yourself, your interests, hobbies, and what makes you unique.
          The more detail, the better your results.
        </p>
        <textarea
          id="about"
          rows={5}
          value={aboutUser}
          onChange={(e) => onAboutChange(e.target.value)}
          placeholder="I'm a software engineer who loves hiking, cooking, and board games. I'm looking for someone who doesn't take themselves too seriously..."
          className="mt-2 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
        />
        <p
          className={clsx(
            'mt-1 text-xs',
            aboutUser.trim().length < 10 ? 'text-slate-400' : 'text-green-600',
          )}
        >
          {aboutUser.trim().length}/10 minimum characters
        </p>
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
          disabled={!isValid}
          className={clsx(
            'flex-1 rounded-full py-3 text-sm font-semibold transition-colors',
            isValid
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
