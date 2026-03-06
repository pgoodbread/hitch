import { google } from 'googleapis'
import { getSitemapUrls } from './lib/sitemap-urls'
import { authenticate } from './lib/gsc-auth'

const DELAY_MS = 1000

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const allUrls = getSitemapUrls()

  // Accept optional URL filter as argument: --filter=tinder-profile-help
  const filterArg = process.argv.find((a) => a.startsWith('--filter='))
  const filter = filterArg?.split('=')[1]
  const urls = filter ? allUrls.filter((u) => u.includes(filter)) : allUrls

  console.log(`Requesting indexing for ${urls.length} URLs\n`)

  const auth = await authenticate(['https://www.googleapis.com/auth/indexing'])

  const indexing = google.indexing({ version: 'v3', auth })

  let success = 0
  let failed = 0

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    process.stdout.write(`\r[${i + 1}/${urls.length}] ${url}`)

    try {
      await indexing.urlNotifications.publish({
        requestBody: {
          url,
          type: 'URL_UPDATED',
        },
      })
      success++
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      process.stdout.write(`\n  ERROR: ${message}\n`)
      failed++
    }

    if (i < urls.length - 1) {
      await delay(DELAY_MS)
    }
  }

  process.stdout.write('\r' + ' '.repeat(120) + '\r')
  console.log('\n' + '='.repeat(50))
  console.log(`  Submitted: ${success}`)
  console.log(`  Failed:    ${failed}`)
  console.log('='.repeat(50) + '\n')
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
