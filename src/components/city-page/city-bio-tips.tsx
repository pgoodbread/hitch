import { Container } from '@/components/container'
import type { CityData } from '@/data/cities'

export function CityBioTips({ city }: { city: CityData }) {
  return (
    <section className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Tinder Bio Tips for {city.name}
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            What to write in your bio to connect with {city.name} matches.
          </p>
        </div>
        <ul className="mx-auto mt-12 max-w-2xl space-y-4">
          {city.bioTips.map((tip) => (
            <li key={tip} className="flex gap-x-3 rounded-xl bg-white p-4">
              <svg
                className="mt-0.5 h-5 w-5 flex-none text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
              <span className="text-slate-700">{tip}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
