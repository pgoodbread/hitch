'use client'

import { useState, useCallback } from 'react'
import { Stepper } from './stepper'
import { StepPhotos } from './step-photos'
import { StepGoal } from './step-goal'
import { StepAbout } from './step-about'
import { StepEmail } from './step-email'
import { track } from '@/lib/analytics'

type DatingGoal = 'relationship' | 'casual' | 'friends'

interface UploadedPhoto {
  url: string
  key: string
}

export function OptimizerForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [datingGoal, setDatingGoal] = useState<DatingGoal | null>(null)
  const [age, setAge] = useState('')
  const [aboutUser, setAboutUser] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const goNext = useCallback(() => {
    track('optimizer_step_completed', { step: currentStep })
    setCurrentStep((s) => Math.min(s + 1, 4))
  }, [currentStep])

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    track('optimizer_checkout_started')

    try {
      const source = new URLSearchParams(window.location.search).get(
        'utm_source',
      )

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          dating_goal: datingGoal,
          about_user: aboutUser.trim(),
          age: age ? parseInt(age, 10) : null,
          upload_keys: photos.map((p) => p.key),
          source,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Order creation failed:', data.error)
        setIsSubmitting(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Submit error:', error)
      setIsSubmitting(false)
    }
  }, [isSubmitting, email, datingGoal, aboutUser, age, photos])

  return (
    <div className="space-y-8">
      <Stepper currentStep={currentStep} />

      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
        {currentStep === 1 && (
          <StepPhotos
            photos={photos}
            onPhotosChange={setPhotos}
            onNext={goNext}
          />
        )}
        {currentStep === 2 && (
          <StepGoal
            datingGoal={datingGoal}
            onGoalChange={setDatingGoal}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 3 && (
          <StepAbout
            age={age}
            aboutUser={aboutUser}
            onAgeChange={setAge}
            onAboutChange={setAboutUser}
            onNext={goNext}
            onBack={goBack}
          />
        )}
        {currentStep === 4 && (
          <StepEmail
            email={email}
            onEmailChange={setEmail}
            onSubmit={handleSubmit}
            onBack={goBack}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
