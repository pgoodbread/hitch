import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'
import { fetchImageAsBase64 } from '@/lib/ai/images'
import { analyzeFreeScore } from '@/lib/ai/free-score'
import { deleteUploadedFiles } from '@/lib/uploadthing-server'
import { sendFreeScoreNotification } from '@/lib/email/send'

interface ScoreRequest {
  email: string
  bio: string
  upload_keys: string[]
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const MAX_BIO_LENGTH = 2000
const MAX_UPLOAD_KEYS = 3
const UPLOADTHING_BASE_URL = 'https://utfs.io/f/'

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ScoreRequest

    // Validate
    if (!body.email || !isValidEmail(body.email)) {
      return badRequest('Valid email is required')
    }

    if (
      !body.bio ||
      typeof body.bio !== 'string' ||
      body.bio.trim().length < 10
    ) {
      return badRequest('Bio must be at least 10 characters')
    }

    if (body.bio.trim().length > MAX_BIO_LENGTH) {
      return badRequest(`Bio must be at most ${MAX_BIO_LENGTH} characters`)
    }

    if (!Array.isArray(body.upload_keys)) {
      return badRequest('upload_keys must be an array')
    }

    if (body.upload_keys.length > MAX_UPLOAD_KEYS) {
      return badRequest(`Maximum ${MAX_UPLOAD_KEYS} photos allowed`)
    }

    if (
      body.upload_keys.some((key) => typeof key !== 'string' || !key.trim())
    ) {
      return badRequest('Invalid upload key')
    }

    const email = body.email.trim().toLowerCase()
    const bio = body.bio.trim()

    // Fetch and compress images (if any)
    const images =
      body.upload_keys.length > 0
        ? await Promise.all(
            body.upload_keys
              .map((key) => `${UPLOADTHING_BASE_URL}${key}`)
              .map(fetchImageAsBase64),
          )
        : []

    // Run AI analysis
    const scores = await analyzeFreeScore(images, bio)

    // Store to free_scores table
    await getSupabaseAdmin().from('free_scores').insert({
      email,
      overall_score: scores.overall_score,
      photo_score: scores.photo_score,
      bio_score: scores.bio_score,
      first_impression_score: scores.first_impression_score,
    })

    // Send notification email to support (fire and forget)
    sendFreeScoreNotification({ email, ...scores }).catch((err) =>
      console.error('Failed to send free score notification:', err),
    )

    // Delete uploaded files (fire and forget)
    if (body.upload_keys.length > 0) {
      deleteUploadedFiles(body.upload_keys).catch((err) =>
        console.error('Failed to delete uploaded files:', err),
      )
    }

    return NextResponse.json(scores)
  } catch (error) {
    console.error('Error processing free score:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}
