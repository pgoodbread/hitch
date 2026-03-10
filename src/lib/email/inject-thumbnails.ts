/**
 * Inject inline thumbnail images into the report HTML next to each
 * "Photo N" reference (bold text). Only injects for photos we have.
 */
export function injectPhotoThumbnails(
  html: string,
  photoCount: number,
): string {
  let result = html
  let injectedCount = 0
  for (let i = 1; i <= photoCount; i++) {
    const imgTag =
      `<img src="cid:photo${i}" alt="Photo ${i}" width="60" ` +
      `style="display:block;border-radius:4px;border:1px solid #e2e8f0;margin-bottom:6px">`
    const pattern = new RegExp(`(<strong>Photo ${i}\\b)(.*?</strong>)`)
    const before = result
    result = result.replace(pattern, `${imgTag}$1$2`)
    if (result !== before) injectedCount++
  }
  if (injectedCount !== photoCount) {
    console.warn(
      `[photo-mismatch] Expected ${photoCount} photo references, found ${injectedCount}. AI may have skipped or renumbered photos.`,
    )
  }
  return result
}
