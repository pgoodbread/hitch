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
  const [location, setLocation] = useState('')
  const [gender, setGender] = useState<string | null>(null)
  const [lookingFor, setLookingFor] = useState<string[]>([])
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const goNext = useCallback(() => {
    const stepProperties: Record<string, unknown> = { step: currentStep }

    if (currentStep === 1) {
      stepProperties.photo_count = photos.length
    } else if (currentStep === 2) {
      stepProperties.dating_goal = datingGoal
    } else if (currentStep === 3) {
      stepProperties.has_location = location.trim().length > 0
      stepProperties.has_gender = gender !== null
    }

    track('optimizer_step_completed', stepProperties)
    setCurrentStep((s) => Math.min(s + 1, 4))
  }, [currentStep, photos.length, datingGoal, location, gender])

  const goBack = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
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
          location: location.trim() || null,
          gender: gender,
          looking_for: lookingFor.length > 0 ? lookingFor : null,
          upload_keys: photos.map((p) => p.key),
          source,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
    }
  }, [
    isSubmitting,
    email,
    datingGoal,
    aboutUser,
    age,
    location,
    gender,
    lookingFor,
    photos,
  ])

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
            location={location}
            gender={gender}
            lookingFor={lookingFor}
            onAgeChange={setAge}
            onAboutChange={setAboutUser}
            onLocationChange={setLocation}
            onGenderChange={setGender}
            onLookingForChange={setLookingFor}
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
            error={submitError}
          />
        )}
      </div>
    </div>
  )
}
