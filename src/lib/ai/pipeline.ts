import Anthropic from '@anthropic-ai/sdk'
import { AI_CONFIG, SYSTEM_PROMPT } from './config'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic()
  return _client
}

async function fetchImageAsBase64(
  url: string,
): Promise<{
  data: string
  mediaType: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'
}> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Failed to fetch image: ${response.status}`)

  const contentType = response.headers.get('content-type') || 'image/jpeg'
  const buffer = await response.arrayBuffer()
  const data = Buffer.from(buffer).toString('base64')

  const mediaType = (
    ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(contentType)
      ? contentType
      : 'image/jpeg'
  ) as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp'

  return { data, mediaType }
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function analyzeProfile(
  imageUrls: string[],
  datingGoal: string,
  aboutUser: string,
  age: number | null,
): Promise<string> {
  // Fetch all images as base64
  const images = await Promise.all(imageUrls.map(fetchImageAsBase64))

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
          // Using cache_control is not needed here
        }) satisfies Anthropic.ImageBlockParam,
    ),
    {
      type: 'text' as const,
      text: `Please analyze these ${images.length} profile photos and provide a complete Tinder profile optimization.

**Dating Goal:** ${datingGoal}
**About the user:** ${aboutUser}${age ? `\n**Age:** ${age}` : ''}

Provide your analysis in markdown format.`,
    },
  ]

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

      return textBlock.text
    } catch (error) {
      if (attempt === AI_CONFIG.retry.maxAttempts - 1) throw error
      const delay = AI_CONFIG.retry.backoffMs[attempt] ?? 16000
      console.warn(`AI attempt ${attempt + 1} failed, retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw new Error('All AI retry attempts failed')
}
