import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  // Base routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: 'https://tinderprofileoptimizer.com',
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]

  return routes
}
