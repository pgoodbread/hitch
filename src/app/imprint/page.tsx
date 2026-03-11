import { type Metadata } from 'next'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Imprint',
  description: 'Legal information and contact details.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function Imprint() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Impressum
          </h1>

          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                Angaben gemäß §5 TMG
              </h2>
              <p>
                Philip Gutbrodt <br />
                Implerstraße 23 <br />
                81371 München
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                Kontakt
              </h2>
              <p>
                Telefon: 0176 43401561 <br />
                E-Mail: support[at]tinderprofileoptimizer.com
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">
                Haftung für Inhalte
              </h3>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen. <br /> Verpflichtungen zur Entfernung oder Sperrung
                der Nutzung von Informationen nach den allgemeinen Gesetzen
                bleiben hiervon unberührt. Eine diesbezügliche Haftung ist
                jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten
                Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden
                Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">
                Haftung für Links
              </h3>
              <p>
                Unser Angebot enthält Links zu externen Websites Dritter, auf
                deren Inhalte wir keinen Einfluss haben. Deshalb können wir für
                diese fremden Inhalte auch keine Gewähr übernehmen. Für die
                Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
                oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten
                wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße
                überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der
                Verlinkung nicht erkennbar. <br /> Eine permanente inhaltliche
                Kontrolle der verlinkten Seiten ist jedoch ohne konkrete
                Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
                Bekanntwerden von Rechtsverletzungen werden wir derartige Links
                umgehend entfernen.
              </p>
            </section>

            <section>
              <h3 className="mb-4 text-xl font-bold text-zinc-800 dark:text-zinc-100">
                Urheberrecht
              </h3>
              <p>
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf
                diesen Seiten unterliegen dem deutschen Urheberrecht. Die
                Vervielfältigung, Bearbeitung, Verbreitung und jede Art der
                Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der
                schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                Downloads und Kopien dieser Seite sind nur für den privaten,
                nicht kommerziellen Gebrauch gestattet. <br />
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt
                wurden, werden die Urheberrechte Dritter beachtet. Insbesondere
                werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie
                trotzdem auf eine Urheberrechtsverletzung aufmerksam werden,
                bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden
                von Rechtsverletzungen werden wir derartige Inhalte umgehend
                entfernen.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  )
}
