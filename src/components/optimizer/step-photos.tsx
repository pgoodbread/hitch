'use client'

import { useCallback, useState } from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { Upload, X, Loader2 } from 'lucide-react'
import { useUploadThing } from '@/lib/uploadthing'

interface UploadedPhoto {
  url: string
  key: string
}

interface StepPhotosProps {
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  onNext: () => void
}

export function StepPhotos({
  photos,
  onPhotosChange,
  onNext,
}: StepPhotosProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const { startUpload } = useUploadThing('imageUploader', {
    onClientUploadComplete: (res) => {
      const newPhotos = res.map((file) => ({
        url: file.ufsUrl,
        key: file.key,
      }))
      onPhotosChange([...photos, ...newPhotos])
      setIsUploading(false)
    },
    onUploadError: (error) => {
      console.error('Upload error:', error)
      setIsUploading(false)
    },
  })

  const handleFiles = useCallback(
    (files: File[]) => {
      const imageFiles = files.filter((f) => f.type.startsWith('image/'))
      const remaining = 10 - photos.length
      const toUpload = imageFiles.slice(0, remaining)
      if (toUpload.length === 0) return

      setIsUploading(true)
      startUpload(toUpload)
    },
    [photos.length, startUpload],
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
          Screenshots of your current Tinder photos. Up to 10 images, 10MB each.
        </p>
      </div>

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
          {isUploading ? 'Uploading...' : 'Drag and drop photos here, or'}
        </p>
        {!isUploading && (
          <label className="mt-2 cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50">
            Browse files
            <input
              type="file"
              accept="image/*"
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
