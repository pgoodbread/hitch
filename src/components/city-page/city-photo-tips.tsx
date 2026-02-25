import { Container } from '@/components/container'
import type { CityData } from '@/data/cities'

export function CityPhotoTips({ city }: { city: CityData }) {
  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Best Photo Locations in {city.name}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Use these {city.name} spots to take Tinder photos that actually get
            matches.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-2">
          {city.photoTips.map((tip) => (
            <div key={tip.location} className="rounded-2xl bg-slate-50 p-6">
              <h3 className="font-display text-lg text-slate-900">
                {tip.location}
              </h3>
              <p className="mt-2 text-sm font-medium text-blue-600">
                {tip.tip}
              </p>
              <p className="mt-3 text-sm text-slate-600">{tip.why}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
