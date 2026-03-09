'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Upload, X, Loader2, AlertCircle } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'
import { prepareFilesForUpload } from '@/lib/image-utils'

interface UploadedPhoto {
  url: string
  key: string
}

interface StepPhotosProps {
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  onNext: () => void
}

const BATCH_SIZE = 2

export function StepPhotos({
  photos,
  onPhotosChange,
  onNext,
}: StepPhotosProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string | null>(null)
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
        // Convert HEIC and filter invalid files
        const { ready, failed } = await prepareFilesForUpload(files)

        if (failed.length > 0) {
          setUploadError(failed.map((f) => f.error).join('. '))
        }

        // Respect the 10-photo limit
        const remaining = 10 - photosRef.current.length
        const toUpload = ready.slice(0, remaining)

        if (toUpload.length === 0) {
          setIsUploading(false)
          setUploadProgress(null)
          return
        }

        // Upload in batches of BATCH_SIZE
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
            onPhotosChange(currentPhotos)
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
    [startUpload, onPhotosChange],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
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
      onPhotosChange(photos.filter((p) => p.key !== key))
    },
    [photos, onPhotosChange],
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-medium text-slate-900">
          Upload your profile photos
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Your current Tinder profile photos. Up to 10 images. Large photos are
          automatically resized.
        </p>
      </div>

      {/* Error banner */}
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

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setIsDragging(true)
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={clsx(
          'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          isDragging
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 bg-slate-50',
          isUploading && 'pointer-events-none opacity-60',
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
            : 'Drag and drop photos here, or'}
        </p>
        {!isUploading && (
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
          {photos.length}/10 photos uploaded
        </p>
      </div>

      {/* Thumbnail grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
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

      <button
        onClick={onNext}
        disabled={photos.length === 0}
        className={clsx(
          'w-full rounded-full py-3 text-sm font-semibold transition-colors',
          photos.length > 0
            ? 'bg-blue-600 text-white hover:bg-blue-500'
            : 'cursor-not-allowed bg-slate-200 text-slate-400',
        )}
      >
        Continue
      </button>
    </div>
  )
}
