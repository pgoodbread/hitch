'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Upload, X, Loader2, AlertCircle, Lock } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import { prepareFilesForUpload } from '@/lib/image-utils'
import { track } from '@/lib/analytics'
import { ScoreResults } from './score-results'
import type { ScoreResult } from './types'

interface UploadedPhoto {
  url: string
  key: string
}

const MAX_PHOTOS = 3
const BATCH_SIZE = 2

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function ScoreForm() {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [scores, setScores] = useState<ScoreResult | null>(null)

  const photosRef = useRef(photos)
  useEffect(() => {
    photosRef.current = photos
  }, [photos])

  const { startUpload } = useUploadThing('imageUploader')

  const handleFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return

      setIsUploading(true)
      setUploadError(null)
      setUploadProgress('Preparing photos...')

      try {
        const { ready, failed } = await prepareFilesForUpload(files)

        if (failed.length > 0) {
          setUploadError(failed.map((f) => f.error).join('. '))
        }

        const remaining = MAX_PHOTOS - photosRef.current.length
        const toUpload = ready.slice(0, remaining)

        if (toUpload.length === 0) {
          setIsUploading(false)
          setUploadProgress(null)
          return
        }

        let uploaded = 0
        let currentPhotos = photosRef.current

        for (let i = 0; i < toUpload.length; i += BATCH_SIZE) {
          const batch = toUpload.slice(i, i + BATCH_SIZE)
          setUploadProgress(
            `Uploading ${uploaded + 1}–${Math.min(uploaded + batch.length, toUpload.length)} of ${toUpload.length} photos...`,
          )

          const res = await startUpload(batch)
          if (res) {
            const newPhotos = res.map((file) => ({
              url: file.ufsUrl,
              key: file.key,
            }))
            currentPhotos = [...currentPhotos, ...newPhotos]
            photosRef.current = currentPhotos
            setPhotos(currentPhotos)
          }
          uploaded += batch.length
        }
      } catch (err) {
        console.error('Upload error:', err)
        setUploadError(
          err instanceof Error ? err.message : 'Upload failed. Please retry.',
        )
      } finally {
        setIsUploading(false)
        setUploadProgress(null)
      }
    },
    [startUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(Array.from(e.dataTransfer.files))
    },
    [handleFiles],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return
      handleFiles(Array.from(e.target.files))
      e.target.value = ''
    },
    [handleFiles],
  )

  const removePhoto = useCallback(
    (key: string) => {
      setPhotos(photos.filter((p) => p.key !== key))
    },
    [photos],
  )

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    setSubmitError(null)
    track('free_score_submitted', { photo_count: photos.length })

    try {
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          bio: bio.trim(),
          upload_keys: photos.map((p) => p.key),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        track('free_score_failed')
        return
      }

      setScores(data as ScoreResult)
      track('free_score_completed', {
        overall_score: data.overall_score,
      })
    } catch {
      setSubmitError('Something went wrong. Please try again.')
      setIsSubmitting(false)
      track('free_score_failed')
    }
  }, [isSubmitting, email, bio, photos])

  const isFormValid = bio.trim().length >= 10 && isValidEmail(email)

  // Show results if we have scores
  if (scores) {
    return (
      <ScoreResults
        scores={scores}
        email={email.trim().toLowerCase()}
        photoUrls={photos.map((p) => p.url)}
      />
    )
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-8">
      <div className="space-y-8">
        {/* Bio Section */}
        <div className="space-y-2">
          <label
            htmlFor="bio"
            className="block font-display text-lg font-medium text-slate-900"
          >
            Your bio
          </label>
          <p className="text-sm text-slate-600">
            Paste your current Tinder bio.
          </p>
          <textarea
            id="bio"
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Paste your Tinder bio here..."
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          />
          <p
            className={clsx(
              'text-xs',
              bio.trim().length < 10 ? 'text-slate-400' : 'text-green-600',
            )}
          >
            {bio.trim().length} characters (10 minimum)
          </p>
        </div>

        {/* Email Section */}
        <div className="space-y-2">
          <label
            htmlFor="score-email"
            className="block font-display text-lg font-medium text-slate-900"
          >
            Your email
          </label>
          <input
            id="score-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && isFormValid && !isSubmitting)
                handleSubmit()
            }}
          />
        </div>

        {/* Photos Section (optional) */}
        <div className="space-y-4">
          <div>
            <h2 className="font-display text-lg font-medium text-slate-900">
              Your profile photos
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Want a more complete score? Add your photos (optional)
            </p>
          </div>

          {uploadError && (
            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
              <p className="flex-1 text-sm text-red-700">{uploadError}</p>
              <button
                onClick={() => setUploadError(null)}
                className="shrink-0 text-red-400 hover:text-red-600"
                aria-label="Dismiss error"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={clsx(
              'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors',
              isDragging
                ? 'border-blue-400 bg-blue-50'
                : 'border-slate-300 bg-slate-50',
              isUploading && 'pointer-events-none opacity-60',
              photos.length >= MAX_PHOTOS && 'pointer-events-none opacity-40',
            )}
          >
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400" />
            )}
            <p className="mt-3 text-sm text-slate-600">
              {isUploading
                ? (uploadProgress ?? 'Uploading...')
                : photos.length >= MAX_PHOTOS
                  ? 'Maximum photos reached'
                  : 'Drag and drop photos here, or'}
            </p>
            {!isUploading && photos.length < MAX_PHOTOS && (
              <label className="mt-2 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
                Browse files
                <input
                  type="file"
                  accept="image/*,.heic,.heif"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
              </label>
            )}
            <p className="mt-2 text-xs text-slate-400">
              {photos.length}/{MAX_PHOTOS} photos uploaded
            </p>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo) => (
                <div key={photo.key} className="group relative aspect-square">
                  <Image
                    src={photo.url}
                    alt="Profile photo"
                    fill
                    className="rounded-lg object-cover"
                    sizes="(max-width: 640px) 33vw, 20vw"
                  />
                  <button
                    onClick={() => removePhoto(photo.key)}
                    className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
                    aria-label="Remove photo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy */}
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Lock className="h-4 w-4 text-slate-400" />
            <span>
              Your data is private. Photos are deleted after analysis.
            </span>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          className={clsx(
            'w-full rounded-full py-3.5 text-sm font-semibold transition-colors',
            isFormValid && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-500'
              : 'cursor-not-allowed bg-slate-200 text-slate-400',
          )}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing your profile...
            </span>
          ) : (
            'Analyze My Profile — Free'
          )}
        </button>

        {submitError && (
          <p className="text-center text-sm text-red-600">{submitError}</p>
        )}
      </div>
    </div>
  )
}
