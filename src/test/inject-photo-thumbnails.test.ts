import { describe, it, expect, vi } from 'vitest'
import { injectPhotoThumbnails } from '../lib/email/inject-thumbnails'

describe('injectPhotoThumbnails', () => {
  it('injects thumbnails for all matching photos', () => {
    const html =
      '<strong>Photo 1 — ⭐️ Keep</strong><strong>Photo 2 — ❌ Remove</strong>'
    const result = injectPhotoThumbnails(html, 2)
    expect(result).toContain('src="cid:photo1"')
    expect(result).toContain('src="cid:photo2"')
  })

  it('logs warning when AI skips a photo', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    // AI skipped Photo 2 — only Photo 1 and Photo 3 present
    const html =
      '<strong>Photo 1 — ⭐️ Keep</strong><strong>Photo 3 — ❌ Remove</strong>'
    injectPhotoThumbnails(html, 3)
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('[photo-mismatch]'),
    )
    warnSpy.mockRestore()
  })

  it('does not warn when all photos match', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const html =
      '<strong>Photo 1 — ⭐️ Keep</strong><strong>Photo 2 — 🔄 Replace</strong>'
    injectPhotoThumbnails(html, 2)
    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
  })

  it('handles zero photos gracefully', () => {
    const result = injectPhotoThumbnails('<p>No photos</p>', 0)
    expect(result).toBe('<p>No photos</p>')
  })
})
