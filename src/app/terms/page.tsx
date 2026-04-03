import { type Metadata } from 'next'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for Tinder Profile Optimizer.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function TermsOfService() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: March 5, 2026
          </p>

          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                1. Provider
              </h2>
              <p>Tinder Profile Optimizer is operated by:</p>
              <p className="mt-2">
                Philip Gutbrodt
                <br />
                Implerstraße 23
                <br />
                81371 München
                <br />
                E-Mail: p.gutbrodt[at]gmail.com
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                2. Service Description
              </h2>
              <p>
                Tinder Profile Optimizer is a one-time, paid service that
                provides AI-generated feedback on your dating profile. You
                upload photos and profile information, pay a one-time fee of
                $29, and receive a personalized optimization report delivered to
                your email. The report includes photo rankings, bio suggestions,
                conversation starters, and an action plan.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                3. Contract Formation
              </h2>
              <p>
                A binding contract is formed when you complete payment through
                Stripe Checkout. By clicking &quot;Complete & Pay&quot;, you
                submit a binding offer to purchase the service. We accept your
                offer by processing your payment and generating your report.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                4. Pricing and Payment
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  The service costs a one-time payment of $19 USD (promotional
                  pricing may apply).
                </li>
                <li>
                  Payment is processed securely by Stripe. We do not store your
                  payment details.
                </li>
                <li>
                  The price is inclusive of all applicable taxes unless
                  otherwise shown at checkout.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                5. Right of Withdrawal (Widerrufsrecht)
              </h2>
              <p className="mb-3">
                As a consumer in the EU, you generally have a 14-day right of
                withdrawal for online purchases. However, in accordance with
                Art. 16(a) of the EU Consumer Rights Directive (and § 356 Abs. 5
                BGB under German law), you agree that the right of withdrawal
                expires once the digital service has been fully performed.
              </p>
              <p className="mb-3">
                By completing your purchase, you expressly consent to immediate
                performance of the service and acknowledge that you lose your
                right of withdrawal once the report has been delivered to your
                email.
              </p>
              <p>
                If we are unable to deliver your report (e.g., due to a
                technical failure), you will receive a full refund.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                6. Refund Policy
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  If your report cannot be generated or delivered due to a
                  technical error on our end, you will receive a full refund.
                </li>
                <li>
                  If you are unsatisfied with the quality of your report,
                  contact us at{' '}
                  <a
                    href="mailto:support@tinderprofileoptimizer.com"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    support@tinderprofileoptimizer.com
                  </a>{' '}
                  within 7 days of delivery. We will review your case and may
                  offer a partial or full refund at our discretion.
                </li>
                <li>
                  Refunds are not available if the report was successfully
                  delivered and no complaint is raised within 7 days.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                7. What You Must Not Do
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>Upload photos of other people without their consent.</li>
                <li>Upload illegal, explicit, or harmful content.</li>
                <li>
                  Use the service for any purpose other than personal dating
                  profile optimization.
                </li>
                <li>
                  Attempt to reverse-engineer, scrape, or abuse the service.
                </li>
              </ul>
              <p className="mt-3">
                We reserve the right to refuse service and withhold refunds if
                these terms are violated.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                8. AI-Generated Content Disclaimer
              </h2>
              <p>
                The optimization report is generated by artificial intelligence
                (Claude by Anthropic). While we strive for high-quality,
                actionable advice, the report is provided as suggestions only.
                We make no guarantees about specific outcomes (e.g., number of
                matches). Results depend on many factors beyond your profile,
                including location, preferences, and platform algorithms.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                9. Intellectual Property
              </h2>
              <p>
                The AI-generated report delivered to you is for your personal
                use. You may not resell, redistribute, or publish the report
                commercially. All other content on this website (design, code,
                copy) is the property of Philip Gutbrodt and may not be
                reproduced without permission.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                10. Liability
              </h2>
              <p className="mb-3">
                We are liable without limitation for damages caused
                intentionally or through gross negligence, as well as for
                damages arising from injury to life, body, or health.
              </p>
              <p className="mb-3">
                For slight negligence, we are only liable in the event of a
                breach of essential contractual obligations (cardinal
                obligations), and liability is limited to foreseeable, typically
                occurring damages. In such cases, liability is limited to the
                amount paid for the service ($29).
              </p>
              <p>
                This does not affect liability under the German Product
                Liability Act (Produkthaftungsgesetz).
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                11. Data Protection
              </h2>
              <p>
                Details on how we handle your personal data are described in our{' '}
                <a
                  href="/privacy"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                12. Dispute Resolution
              </h2>
              <p className="mb-3">
                The European Commission provides an online dispute resolution
                (ODR) platform at{' '}
                <a
                  href="https://ec.europa.eu/consumers/odr"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://ec.europa.eu/consumers/odr
                </a>
                .
              </p>
              <p>
                We are neither obligated nor willing to participate in dispute
                resolution proceedings before a consumer arbitration board.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                13. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of the Federal Republic of
                Germany, excluding the UN Convention on Contracts for the
                International Sale of Goods (CISG). If you are a consumer in the
                EU, you also retain the protection of mandatory provisions of
                your country of residence.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                14. Changes to These Terms
              </h2>
              <p>
                We may update these terms from time to time. The &quot;last
                updated&quot; date at the top reflects the most recent revision.
                Continued use of the service after changes constitutes
                acceptance of the revised terms.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  )
}
