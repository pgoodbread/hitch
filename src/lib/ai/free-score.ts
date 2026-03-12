import Anthropic from '@anthropic-ai/sdk'

let _client: Anthropic | null = null
function getClient(): Anthropic {
  if (!_client) _client = new Anthropic()
  return _client
}

export interface ScoreResult {
  overall_score: number
  photo_score: number
  bio_score: number
  first_impression_score: number
  photo_teaser: string
  bio_teaser: string
  first_impression_teaser: string
}

const FREE_SCORE_CONFIG = {
  model: 'claude-haiku-4-5-20251001' as const,
  maxTokens: 1024,
  retry: {
    maxAttempts: 2,
    backoffMs: [1000],
  },
}

const FREE_SCORE_PROMPT = `You are a brutally honest dating profile analyst. Analyze this Tinder profile and return ONLY a JSON object with this exact structure, no other text:

{
  "overall_score": <number 1-10, one decimal>,
  "photo_score": <number 1-10, one decimal>,
  "bio_score": <number 1-10, one decimal>,
  "first_impression_score": <number 1-10, one decimal>,
  "photo_teaser": "<one provocative sentence about their biggest photo problem>",
  "bio_teaser": "<one provocative sentence about their biggest bio problem>",
  "first_impression_teaser": "<one provocative sentence about overall vibe>"
}

Rules:
- Be specific enough to feel personal, vague enough that they need the full analysis
- Never give actionable advice — just identify the problem
- Teasers should create curiosity and urgency
- Most profiles should score 3-6. Be harsh but fair. A 7+ is genuinely good.
- Reference specific things you see ("your mirror selfie", "your group photo")`

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function analyzeFreeScore(
  images: { data: string; mediaType: string }[],
  bio: string,
): Promise<ScoreResult> {
  const hasPhotos = images.length > 0
  const userContent: Anthropic.MessageCreateParams['messages'][0]['content'] = [
    ...images.map(
      (img) =>
        ({
          type: 'image' as const,
          source: {
            type: 'base64' as const,
            media_type: img.mediaType as
              | 'image/jpeg'
              | 'image/png'
              | 'image/gif'
              | 'image/webp',
            data: img.data,
          },
        }) satisfies Anthropic.ImageBlockParam,
    ),
    {
      type: 'text' as const,
      text: hasPhotos
        ? `Analyze these ${images.length} profile photo(s) and this bio:\n\n<user_input>${bio}</user_input>`
        : `Analyze this Tinder bio (no photos provided — score photos as 3.0 and note they didn't provide any, focus your analysis on the bio and overall impression):\n\n<user_input>${bio}</user_input>`,
    },
  ]

  for (
    let attempt = 0;
    attempt < FREE_SCORE_CONFIG.retry.maxAttempts;
    attempt++
  ) {
    try {
      const response = await getClient().messages.create({
        model: FREE_SCORE_CONFIG.model,
        max_tokens: FREE_SCORE_CONFIG.maxTokens,
        system: FREE_SCORE_PROMPT,
        messages: [{ role: 'user', content: userContent }],
      })

      const textBlock = response.content.find((block) => block.type === 'text')
      if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude')
      }

      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }

      const parsed = JSON.parse(jsonMatch[0]) as ScoreResult

      // Validate shape
      if (
        typeof parsed.overall_score !== 'number' ||
        typeof parsed.photo_score !== 'number' ||
        typeof parsed.bio_score !== 'number' ||
        typeof parsed.first_impression_score !== 'number' ||
        typeof parsed.photo_teaser !== 'string' ||
        typeof parsed.bio_teaser !== 'string' ||
        typeof parsed.first_impression_teaser !== 'string'
      ) {
        throw new Error('Invalid score response shape')
      }

      return parsed
    } catch (error) {
      if (attempt === FREE_SCORE_CONFIG.retry.maxAttempts - 1) throw error
      const delay = FREE_SCORE_CONFIG.retry.backoffMs[attempt] ?? 1000
      console.warn(
        `Free score attempt ${attempt + 1} failed, retrying in ${delay}ms`,
      )
      await sleep(delay)
    }
  }

  throw new Error('All free score retry attempts failed')
}
