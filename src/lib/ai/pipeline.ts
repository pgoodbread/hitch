import Anthropic from '@anthropic-ai/sdk'
import sharp from 'sharp'
import { AI_CONFIG, SYSTEM_PROMPT } from './config'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic()
  return _client
}

const IMAGE_FETCH_TIMEOUT_MS = 30_000
const IMAGE_MAX_BYTES = 20 * 1024 * 1024 // 20MB
const API_IMAGE_MAX_BYTES = 5 * 1024 * 1024 // 5MB Claude API limit

async function compressImageToFit(
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

async function fetchImageAsBase64(url: string): Promise<{
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

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface ProfileAnalysisInput {
  imageUrls: string[]
  datingGoal: string
  aboutUser: string
  age: number | null
  location: string | null
  gender: string | null
  lookingFor: string[] | null
}

export async function analyzeProfile(
  input: ProfileAnalysisInput,
): Promise<{ report: string; imageBuffers: Buffer[] }> {
  // Fetch all images as base64
  const images = await Promise.all(input.imageUrls.map(fetchImageAsBase64))

  // Build demographics section with XML delimiters to prevent prompt injection
  const demographicLines: string[] = []
  demographicLines.push(`**Dating Goal:** ${input.datingGoal}`)
  demographicLines.push(
    `**About the user:** <user_input>${input.aboutUser}</user_input>`,
  )
  if (input.age) demographicLines.push(`**Age:** ${input.age}`)
  if (input.location)
    demographicLines.push(
      `**Location:** <user_input>${input.location}</user_input>`,
    )
  if (input.gender)
    demographicLines.push(
      `**Gender:** <user_input>${input.gender}</user_input>`,
    )
  if (input.lookingFor?.length)
    demographicLines.push(
      `**Looking for:** <user_input>${input.lookingFor.join(', ')}</user_input>`,
    )

  const userContent: Anthropic.MessageCreateParams['messages'][0]['content'] = [
    ...images.map(
      (img) =>
        ({
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: img.mediaType,
            data: img.data,
          },
        }) satisfies Anthropic.ImageBlockParam,
    ),
    {
      type: 'text' as const,
      text: `Please analyze these ${images.length} profile photos (numbered Photo 1 through Photo ${images.length} in the order shown above) and provide a complete Tinder profile optimization.

${demographicLines.join('\n')}

Refer to photos by number (Photo 1, Photo 2, etc.) in your analysis. Provide your analysis in markdown format.`,
    },
  ]

  const imageBuffers = images.map((img) => Buffer.from(img.data, 'base64'))

  // Retry with exponential backoff
  for (let attempt = 0; attempt < AI_CONFIG.retry.maxAttempts; attempt++) {
    try {
      const response = await getClient().messages.create({
        model: AI_CONFIG.model,
        max_tokens: AI_CONFIG.maxTokens,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      return { report: textBlock.text, imageBuffers }
    } catch (error) {
      if (attempt === AI_CONFIG.retry.maxAttempts - 1) throw error
      const delay = AI_CONFIG.retry.backoffMs[attempt] ?? 16000
      console.warn(`AI attempt ${attempt + 1} failed, retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw new Error('All AI retry attempts failed')
}
