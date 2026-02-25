import { Container } from '@/components/container'
import { CityCta } from './city-cta'
import type { CityData } from '@/data/cities'

export function CityFaq({ city }: { city: CityData }) {
  return (
    <section id="faq" className="bg-slate-50 py-16 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
            Tinder FAQ for {city.name}
          </h2>
        </div>
        <dl className="mx-auto mt-12 max-w-3xl space-y-8">
          {city.faqs.map((faq) => (
            <div key={faq.question}>
              <dt className="font-display text-lg/7 text-slate-900">
                {faq.question}
              </dt>
              <dd className="mt-2 text-sm text-slate-700">{faq.answer}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-12 flex justify-center">
          <CityCta city={city.name} />
        </div>
      </Container>
    </section>
  )
}
