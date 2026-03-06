import { getSitemapUrls } from './lib/sitemap-urls'
import { authenticate } from './lib/gsc-auth'
import { inspectUrls } from './lib/url-inspector'
import { printReport, saveJsonReport } from './lib/report'

const saveJson = process.argv.includes('--json')

async function main() {
  console.log('Building URL list from content...')
  const urls = getSitemapUrls()
  console.log(`Found ${urls.length} pages\n`)

  const auth = await authenticate()
  const results = await inspectUrls(auth, urls)

  printReport(results)

  if (saveJson) {
    const filePath = saveJsonReport(results)
    console.log(`JSON report saved to ${filePath}\n`)
  }
}

main().catch((err) => {
  console.error('Fatal error:', err.message)
  process.exit(1)
})
