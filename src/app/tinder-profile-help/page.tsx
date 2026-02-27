import type { Metadata } from 'next'
import Link from 'next/link'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { getCitiesByRegion } from '@/data/cities'
import type { CityData } from '@/data/cities'

const BASE_URL = 'https://tinderprofileoptimizer.com'

const regions: CityData['region'][] = [
  'Northeast',
  'Southeast',
  'Midwest',
  'Southwest',
  'West Coast',
]

export const metadata: Metadata = {
  title: 'Tinder Profile Help by City',
  description:
    'Get Tinder profile optimization tailored to your city. City-specific photo tips, bio advice, and dating culture insights for 50 US cities. One-time $29.',
  alternates: {
    canonical: `${BASE_URL}/tinder-profile-help`,
  },
  openGraph: {
    title: 'Tinder Profile Help by City - Tinder Profile Optimizer',
    description:
      'Get Tinder profile optimization tailored to your city. City-specific photo tips, bio advice, and dating culture insights for 50 US cities.',
    url: `${BASE_URL}/tinder-profile-help`,
    type: 'website',
  },
}

export default function CityIndexPage() {
  return (
    <>
      <Header />
      <main>
        <Container className="pt-20 pb-16 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-4xl font-medium tracking-tight text-slate-900 sm:text-5xl">
              Tinder Profile Help by City
            </h1>
            <p className="mt-6 text-lg tracking-tight text-slate-700">
              Every city has its own Tinder culture. Get profile optimization
              tailored to your local dating scene — photo locations, bio tips,
              and strategies that work where you live.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-5xl">
            {regions.map((region) => {
              const regionCities = getCitiesByRegion(region)
              if (regionCities.length === 0) return null

              return (
                <div key={region} className="mt-12 first:mt-0">
                  <h2 className="font-display text-2xl tracking-tight text-slate-900">
                    {region}
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {regionCities.map((city) => (
                      <Link
                        key={city.slug}
                        href={`/tinder-profile-help/${city.slug}`}
                        className="rounded-lg bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
                      >
                        {city.name}, {city.stateAbbr}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mx-auto mt-16 max-w-2xl text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t see your city? Our profile optimization works for any
              location.{' '}
              <a
                href="/optimize"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Get started for $29 &rarr;
              </a>
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
