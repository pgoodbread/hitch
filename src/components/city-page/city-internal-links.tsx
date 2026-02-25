import Link from 'next/link'
import { Container } from '@/components/container'
import { getCityBySlug } from '@/data/cities'
import type { CityData } from '@/data/cities'

export function CityInternalLinks({ city }: { city: CityData }) {
  const nearbyCities = city.nearbyCities
    .map(getCityBySlug)
    .filter((c): c is CityData => c !== undefined)

  if (nearbyCities.length === 0) return null

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl tracking-tight text-slate-900 sm:text-3xl">
            Tinder Profile Help in Nearby Cities
          </h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {nearbyCities.map((nearby) => (
            <Link
              key={nearby.slug}
              href={`/tinder-profile-help/${nearby.slug}`}
              className="rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700"
            >
              {nearby.name}, {nearby.stateAbbr}
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/tinder-profile-help"
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            Browse all cities &rarr;
          </Link>
        </div>
      </Container>
    </section>
  )
}
