/**
 * Quick test script to send a report email with real test data.
 * Usage: npx tsx --tsconfig scripts/tsconfig.json scripts/test-email.ts
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// Load .env.local manually (no dotenv dependency)
const envPath = path.resolve(process.cwd(), '.env.local')
for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eq = trimmed.indexOf('=')
  if (eq === -1) continue
  const key = trimmed.slice(0, eq)
  const val = trimmed.slice(eq + 1).replace(/^["']|["']$/g, '')
  process.env[key] ??= val
}

import { sendReportEmail, type PhotoAttachment } from '../src/lib/email/send'

const TO = 'p.gutbrodt@gmail.com'
const TEST_DIR = path.resolve(process.cwd(), 'data/testing')
const THUMBNAIL_WIDTH = 150

const IMAGE_FILES = [
  'IMG_2940.jpg',
  'IMG_3388.jpg',
  'IMG_3389.jpg',
  'IMG_2134.jpg',
  'wedding_selina.JPG',
]

async function generateThumbnails(): Promise<PhotoAttachment[]> {
  return Promise.all(
    IMAGE_FILES.map(async (file, i) => {
      const buf = fs.readFileSync(path.join(TEST_DIR, file))
      const thumbnail = await sharp(buf)
        .resize(THUMBNAIL_WIDTH)
        .jpeg({ quality: 80 })
        .toBuffer()

      return {
        content: thumbnail,
        filename: `photo${i + 1}.jpg`,
      }
    }),
  )
}

async function main() {
  const report = fs.readFileSync(
    path.join(TEST_DIR, 'dummy-report-content.md'),
    'utf-8',
  )

  console.log(`Generating thumbnails from ${IMAGE_FILES.length} images...`)
  const photos = await generateThumbnails()

  console.log(`Sending test email to ${TO}...`)
  await sendReportEmail(TO, report, photos)
  console.log('Email sent!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
