import sharp from 'sharp'

const IMAGE_FETCH_TIMEOUT_MS = 30_000
const IMAGE_MAX_BYTES = 20 * 1024 * 1024 // 20MB
const API_IMAGE_MAX_BYTES = 5 * 1024 * 1024 // 5MB Claude API limit

export async function compressImageToFit(
  buffer: Buffer,
  maxBytes: number,
): Promise<Buffer> {
  const qualities = [85, 70, 55]
  for (const quality of qualities) {
    const compressed = await sharp(buffer)
      .resize({
        width: 2048,
        height: 2048,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer()
    if (compressed.byteLength <= maxBytes)
      return compressed as Buffer<ArrayBuffer>
  }
  // Final attempt: smaller dimensions + low quality
  return sharp(buffer)
    .resize({
      width: 1024,
      height: 1024,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 50 })
    .toBuffer() as Promise<Buffer<ArrayBuffer>>
}

export async function fetchImageAsBase64(url: string): Promise<{
  data: string
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
}> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(IMAGE_FETCH_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)

  const contentLength = Number(response.headers.get('content-length') || '0')
  if (contentLength > IMAGE_MAX_BYTES) {
    throw new Error(
      `Image too large: ${contentLength} bytes (max ${IMAGE_MAX_BYTES})`,
    )
  }

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const arrayBuffer = await response.arrayBuffer()

  if (arrayBuffer.byteLength > IMAGE_MAX_BYTES) {
    throw new Error(
      `Image too large: ${arrayBuffer.byteLength} bytes (max ${IMAGE_MAX_BYTES})`,
    )
  }

  let imageBuffer = Buffer.from(arrayBuffer)
  let wasCompressed = false

  // Compress if image exceeds Claude API's 5MB limit
  if (imageBuffer.byteLength > API_IMAGE_MAX_BYTES) {
    imageBuffer = (await compressImageToFit(
      imageBuffer,
      API_IMAGE_MAX_BYTES,
    )) as Buffer<ArrayBuffer>
    wasCompressed = true
  }

  const data = imageBuffer.toString('base64')

  const mediaType = (
    wasCompressed
      ? 'image/jpeg' // compressed images are always JPEG
      : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
            contentType,
          )
        ? contentType
        : 'image/jpeg'
  ) as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

  return { data, mediaType }
}
