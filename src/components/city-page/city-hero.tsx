import Link from 'next/link'
import { Container } from '@/components/container'
import { CityCta } from './city-cta'
import type { CityData } from '@/data/cities'

export function CityHero({ city }: { city: CityData }) {
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center justify-center gap-x-2 text-sm text-slate-500">
          <li>
            <Link href="/" className="hover:text-slate-700">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href="/tinder-profile-help" className="hover:text-slate-700">
              Tinder Profile Help
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-medium text-slate-900">{city.name}</li>
        </ol>
      </nav>
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        {city.h1}
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        {city.introText}
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <CityCta city={city.name} />
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Takes 5 minutes · One-time payment · Results delivered to your inbox
      </p>
    </Container>
  )
}
