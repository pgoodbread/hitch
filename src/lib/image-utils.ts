const HEIC_MIME_TYPES = ['image/heic', 'image/heif']
const HEIC_EXTENSIONS = ['.heic', '.heif']
const MAX_FILE_SIZE = 8 * 1024 * 1024 // 8MB — matches UploadThing config

/**
 * Three-tier HEIC detection: MIME type → file extension → byte-level check.
 * iOS Safari often reports empty or generic MIME types for HEIC files.
 */
export async function isHeicFile(file: File): Promise<boolean> {
  // Tier 1: MIME type
  if (HEIC_MIME_TYPES.includes(file.type.toLowerCase())) return true

  // Tier 2: File extension
  const lower = file.name.toLowerCase()
  const ext = lower.slice(lower.lastIndexOf('.'))
  if (HEIC_EXTENSIONS.includes(ext)) return true

  // Tier 3: Byte-level magic number check (only if MIME is empty/generic)
  if (!file.type || file.type === 'application/octet-stream') {
    try {
      const { isHeic } = await import('heic-to')
      return await isHeic(file)
    } catch {
      return false
    }
  }

  return false
}

/**
 * Convert a HEIC file to JPEG. Re-compresses if the result exceeds 8MB.
 */
export async function convertHeicToJpeg(file: File): Promise<File> {
  const { heicTo } = await import('heic-to')

  const blob = await heicTo({
    blob: file,
    type: 'image/jpeg',
    quality: 0.85,
  })

  const baseName = file.name.replace(/\.(heic|heif)$/i, '')
  let jpegFile = new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })

  // Re-compress at lower quality if too large
  if (jpegFile.size > MAX_FILE_SIZE) {
    const smallerBlob = await heicTo({
      blob: file,
      type: 'image/jpeg',
      quality: 0.65,
    })
    jpegFile = new File([smallerBlob], `${baseName}.jpg`, {
      type: 'image/jpeg',
    })

    if (jpegFile.size > MAX_FILE_SIZE) {
      throw new Error(
        `${file.name} is too large even after compression (${Math.round(jpegFile.size / 1024 / 1024)}MB). Try a smaller photo.`,
      )
    }
  }

  return jpegFile
}

/**
 * Compress an image to fit within maxBytes by reducing JPEG quality,
 * then scaling dimensions if needed.
 */
async function compressImage(file: File, maxBytes: number): Promise<File> {
  const bitmap = await createImageBitmap(file)
  let { width, height } = bitmap

  const qualities = [0.85, 0.7, 0.55, 0.4]
  const baseName = file.name.replace(/\.[^.]+$/, '')

  for (let scale = 0; scale < 3; scale++) {
    for (const quality of qualities) {
      const canvas = new OffscreenCanvas(width, height)
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(bitmap, 0, 0, width, height)

      const blob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality,
      })

      if (blob.size <= maxBytes) {
        bitmap.close()
        return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg' })
      }
    }

    // Scale down by 50% and retry
    width = Math.round(width / 2)
    height = Math.round(height / 2)
  }

  bitmap.close()
  throw new Error(
    `${file.name} is too large even after compression. Try a smaller photo.`,
  )
}

interface PrepareResult {
  ready: File[]
  failed: { file: File; error: string }[]
}

/**
 * Process files for upload: convert HEIC → JPEG, pass through other images,
 * reject non-image files.
 */
export async function prepareFilesForUpload(
  files: File[],
): Promise<PrepareResult> {
  const ready: File[] = []
  const failed: PrepareResult['failed'] = []

  for (const file of files) {
    try {
      if (await isHeicFile(file)) {
        ready.push(await convertHeicToJpeg(file))
      } else if (file.type.startsWith('image/')) {
        ready.push(
          file.size > MAX_FILE_SIZE
            ? await compressImage(file, MAX_FILE_SIZE)
            : file,
        )
      } else {
        failed.push({
          file,
          error: `${file.name} is not a supported image format`,
        })
      }
    } catch (err) {
      failed.push({
        file,
        error:
          err instanceof Error ? err.message : `Failed to process ${file.name}`,
      })
    }
  }

  return { ready, failed }
}
