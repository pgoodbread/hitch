import type { MetadataRoute } from 'next'
import { getAllCitySlugs } from '@/data/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tinderprofileoptimizer.com'

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date('2026-02-01'),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/tinder-profile-help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  const cityRoutes: MetadataRoute.Sitemap = getAllCitySlugs().map((slug) => ({
    url: `${baseUrl}/tinder-profile-help/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  return [...routes, ...cityRoutes]
}
