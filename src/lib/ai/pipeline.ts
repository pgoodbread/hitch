import Anthropic from '@anthropic-ai/sdk'
import { AI_CONFIG, SYSTEM_PROMPT } from './config'
import { fetchImageAsBase64 } from './images'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic()
  return _client
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
      text: `Please analyze these ${images.length} profile photos and provide a complete Tinder profile optimization.

The photos are numbered Photo 1 through Photo ${images.length} in the exact order shown above. You MUST include an analysis entry for every single photo using that exact numbering — do not skip or renumber any photo, even if it is not a personal photo.

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
