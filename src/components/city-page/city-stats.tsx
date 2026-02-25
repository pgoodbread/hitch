import { Container } from '@/components/container'
import type { CityData } from '@/data/cities'

const competitionColors = {
  low: 'text-green-600 bg-green-50',
  medium: 'text-yellow-600 bg-yellow-50',
  high: 'text-orange-600 bg-orange-50',
  'very-high': 'text-red-600 bg-red-50',
}

const competitionLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  'very-high': 'Very High',
}

export function CityStats({ city }: { city: CityData }) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Tinder Dating Stats for {city.name}
          </h2>
        </div>
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">Metro Population</p>
            <p className="mt-2 font-display text-2xl font-medium text-slate-900">
              {city.population.toLocaleString()}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">Singles Rate</p>
            <p className="mt-2 font-display text-2xl font-medium text-slate-900">
              {city.singlePercentage}%
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">Gender Ratio</p>
            <p className="mt-2 font-display text-lg font-medium text-slate-900">
              {city.genderRatio}
            </p>
          </div>
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm ring-1 ring-slate-100">
            <p className="text-sm text-slate-500">Competition Level</p>
            <p
              className={`mt-2 inline-block rounded-full px-3 py-1 font-display text-lg font-medium ${competitionColors[city.tinderCompetitionLevel]}`}
            >
              {competitionLabels[city.tinderCompetitionLevel]}
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-3xl">
          <h3 className="font-display text-xl tracking-tight text-slate-900">
            Dating Culture in {city.name}
          </h3>
          <p className="mt-4 text-base leading-7 text-slate-600">
            {city.datingCulture}
          </p>
        </div>
      </Container>
    </section>
  )
}
