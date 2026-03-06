import { google } from 'googleapis'
import type { JWT } from 'google-auth-library'

const SITE_URL = 'sc-domain:tinderprofileoptimizer.com'
const DELAY_MS = 200

export interface InspectionResult {
  url: string
  verdict: string
  coverageState: string
  indexingState: string
  pageFetchState: string
  robotsTxtState: string
  lastCrawlTime: string | null
  userCanonical: string | null
  googleCanonical: string | null
  error?: string
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function inspectUrls(
  auth: JWT,
  urls: string[],
): Promise<InspectionResult[]> {
  const searchconsole = google.searchconsole({ version: 'v1', auth })
  const results: InspectionResult[] = []
  const total = urls.length

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]
    process.stdout.write(`\rInspecting ${i + 1}/${total}: ${url}`)

    try {
      const response = await searchconsole.urlInspection.index.inspect({
        requestBody: {
          inspectionUrl: url,
          siteUrl: SITE_URL,
        },
      })

      const result = response.data.inspectionResult
      const indexStatus = result?.indexStatusResult
      results.push({
        url,
        verdict: indexStatus?.verdict || 'UNKNOWN',
        coverageState: indexStatus?.coverageState || 'UNKNOWN',
        indexingState: indexStatus?.indexingState || 'UNKNOWN',
        pageFetchState: indexStatus?.pageFetchState || 'UNKNOWN',
        robotsTxtState: indexStatus?.robotsTxtState || 'UNKNOWN',
        lastCrawlTime: indexStatus?.lastCrawlTime || null,
        userCanonical: indexStatus?.userCanonical || null,
        googleCanonical: indexStatus?.googleCanonical || null,
      })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      results.push({
        url,
        verdict: 'ERROR',
        coverageState: 'ERROR',
        indexingState: 'ERROR',
        pageFetchState: 'ERROR',
        robotsTxtState: 'ERROR',
        lastCrawlTime: null,
        userCanonical: null,
        googleCanonical: null,
        error: message,
      })
    }

    if (i < urls.length - 1) {
      await delay(DELAY_MS)
    }
  }

  // Clear the progress line
  process.stdout.write('\r' + ' '.repeat(120) + '\r')

  return results
}
