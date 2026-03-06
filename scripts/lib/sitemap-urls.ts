import { getAllCitySlugs } from '../../src/data/cities'

const BASE_URL = 'https://www.tinderprofileoptimizer.com'

export function getSitemapUrls(): string[] {
  const citySlugs = getAllCitySlugs()

  const urls: string[] = [
    BASE_URL,
    `${BASE_URL}/optimize`,
    `${BASE_URL}/tinder-profile-help`,
  ]

  // City pages
  for (const slug of citySlugs) {
    urls.push(`${BASE_URL}/tinder-profile-help/${slug}`)
  }

  return urls
}
