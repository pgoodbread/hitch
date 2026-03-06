import fs from 'fs'
import path from 'path'
import type { InspectionResult } from './url-inspector'

export function printReport(results: InspectionResult[]): void {
  const indexed = results.filter((r) => r.verdict === 'PASS')
  const notIndexed = results.filter(
    (r) => r.verdict !== 'PASS' && r.verdict !== 'ERROR',
  )
  const errors = results.filter((r) => r.verdict === 'ERROR')

  const pct = ((indexed.length / results.length) * 100).toFixed(1)
  const notPct = ((notIndexed.length / results.length) * 100).toFixed(1)

  console.log('\n' + '='.repeat(70))
  console.log('  GOOGLE SEARCH CONSOLE INDEXING REPORT')
  console.log('='.repeat(70))
  console.log(`  Date:         ${new Date().toISOString().split('T')[0]}`)
  console.log(`  Total pages:  ${results.length}`)
  console.log(`  Indexed:      ${indexed.length} (${pct}%)`)
  console.log(`  Not indexed:  ${notIndexed.length} (${notPct}%)`)
  if (errors.length > 0) {
    console.log(`  Errors:       ${errors.length}`)
  }
  console.log('='.repeat(70))

  // Indexed pages
  if (indexed.length > 0) {
    console.log('\n  INDEXED PAGES')
    console.log('  ' + '-'.repeat(68))
    for (const r of indexed) {
      const crawled = r.lastCrawlTime
        ? r.lastCrawlTime.split('T')[0]
        : 'unknown'
      console.log(`  ${r.url}`)
      console.log(`    Last crawl: ${crawled}`)
    }
  }

  // Not indexed pages
  if (notIndexed.length > 0) {
    console.log('\n  NOT INDEXED')
    console.log('  ' + '-'.repeat(68))
    for (const r of notIndexed) {
      console.log(`  ${r.url}`)
      console.log(`    Verdict:    ${r.verdict}`)
      console.log(`    Coverage:   ${r.coverageState}`)
      console.log(`    Indexing:   ${r.indexingState}`)
      console.log(`    Fetch:      ${r.pageFetchState}`)
      console.log(`    Robots:     ${r.robotsTxtState}`)
    }
  }

  // Errors
  if (errors.length > 0) {
    console.log('\n  ERRORS')
    console.log('  ' + '-'.repeat(68))
    for (const r of errors) {
      console.log(`  ${r.url}`)
      console.log(`    ${r.error}`)
    }
  }

  console.log('')
}

export function saveJsonReport(results: InspectionResult[]): string {
  const reportsDir = path.join(process.cwd(), 'scripts', 'reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  const date = new Date().toISOString().split('T')[0]
  const filePath = path.join(reportsDir, `indexing-${date}.json`)

  const indexed = results.filter((r) => r.verdict === 'PASS')
  const notIndexed = results.filter(
    (r) => r.verdict !== 'PASS' && r.verdict !== 'ERROR',
  )
  const errors = results.filter((r) => r.verdict === 'ERROR')

  const report = {
    date,
    summary: {
      total: results.length,
      indexed: indexed.length,
      notIndexed: notIndexed.length,
      errors: errors.length,
      indexedPercent: parseFloat(
        ((indexed.length / results.length) * 100).toFixed(1),
      ),
    },
    results,
  }

  fs.writeFileSync(filePath, JSON.stringify(report, null, 2))
  return filePath
}
