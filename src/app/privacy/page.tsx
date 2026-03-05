import { type Metadata } from 'next'
import { Container } from '@/components/container'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for Tinder Profile Optimizer.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function PrivacyPolicy() {
  return (
    <Container className="mt-16 sm:mt-32">
      <div className="grid grid-cols-1 gap-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Last updated: March 5, 2026
          </p>

          <div className="mt-6 space-y-7 text-base text-zinc-600 dark:text-zinc-400">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                1. Controller
              </h2>
              <p>
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
                2. What Data We Collect
              </h2>
              <p className="mb-3">
                When you use Tinder Profile Optimizer, we collect:
              </p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Email address</strong> — to deliver your optimization
                  report.
                </li>
                <li>
                  <strong>Photos you upload</strong> — to analyze your dating
                  profile. Photos are processed by our AI, then permanently
                  deleted within 24 hours of report delivery.
                </li>
                <li>
                  <strong>Profile information you provide</strong> — dating
                  goal, age, location, gender, and what you&apos;re looking for.
                  Used solely to personalize your report.
                </li>
                <li>
                  <strong>Payment information</strong> — processed entirely by
                  Stripe. We never see or store your card details.
                </li>
                <li>
                  <strong>Usage analytics</strong> — page views, button clicks,
                  and scroll depth via PostHog, only if you accept cookies.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                3. Why We Process Your Data
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Contract fulfillment (Art. 6(1)(b) GDPR)</strong> —
                  processing your order, generating your AI report, and
                  delivering it via email.
                </li>
                <li>
                  <strong>Consent (Art. 6(1)(a) GDPR)</strong> — analytics
                  cookies (PostHog) are only set after you explicitly accept
                  them. You can withdraw consent at any time by clearing your
                  cookies.
                </li>
                <li>
                  <strong>Legitimate interest (Art. 6(1)(f) GDPR)</strong> —
                  fraud prevention and service improvement.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                4. Third-Party Processors
              </h2>
              <p className="mb-3">We share data with:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Stripe</strong> (payment processing) — San Francisco,
                  USA. Subject to EU-US Data Privacy Framework.{' '}
                  <a
                    href="https://stripe.com/privacy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Anthropic / Claude AI</strong> (photo and profile
                  analysis) — San Francisco, USA. Your photos and profile text
                  are sent for AI analysis and are not retained by Anthropic
                  beyond request processing.{' '}
                  <a
                    href="https://www.anthropic.com/privacy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>UploadThing</strong> (temporary file storage) — files
                  are deleted after processing.{' '}
                  <a
                    href="https://uploadthing.com/privacy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Resend</strong> (email delivery) — used to send your
                  report.{' '}
                  <a
                    href="https://resend.com/legal/privacy-policy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Supabase</strong> (database) — hosted in EU
                  (Frankfurt).{' '}
                  <a
                    href="https://supabase.com/privacy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>PostHog</strong> (analytics, consent-gated) — EU
                  hosting.{' '}
                  <a
                    href="https://posthog.com/privacy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <strong>Vercel</strong> (hosting) — edge network, data may
                  transit through USA.{' '}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                5. Photo Handling
              </h2>
              <p>
                Your photos are uploaded to a temporary storage service
                (UploadThing) solely for the purpose of AI analysis. After your
                report is generated and delivered, all uploaded photos are
                permanently deleted. We do not use your photos for training AI
                models, marketing, or any purpose other than generating your
                personal report.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                6. Cookies
              </h2>
              <p>
                We use a cookie consent banner. Only essential cookies (session
                management) are set by default. Analytics cookies (PostHog) are
                only activated after you give explicit consent. You can withdraw
                consent at any time by clearing your browser cookies or
                declining when the banner reappears.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                7. Data Retention
              </h2>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Photos</strong> — deleted within 24 hours of report
                  delivery.
                </li>
                <li>
                  <strong>Order data</strong> (email, profile info, AI report) —
                  retained for 12 months for customer support and legal
                  obligations, then deleted.
                </li>
                <li>
                  <strong>Payment records</strong> — retained by Stripe per
                  their policies and applicable tax law.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                8. Your Rights (GDPR)
              </h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc space-y-2 pl-6">
                <li>
                  <strong>Access</strong> your personal data
                </li>
                <li>
                  <strong>Rectify</strong> inaccurate data
                </li>
                <li>
                  <strong>Erase</strong> your data (&quot;right to be
                  forgotten&quot;)
                </li>
                <li>
                  <strong>Restrict</strong> processing
                </li>
                <li>
                  <strong>Data portability</strong>
                </li>
                <li>
                  <strong>Object</strong> to processing based on legitimate
                  interest
                </li>
                <li>
                  <strong>Withdraw consent</strong> at any time (without
                  affecting prior lawful processing)
                </li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email{' '}
                <a
                  href="mailto:support@tinderprofileoptimizer.com"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  support@tinderprofileoptimizer.com
                </a>
                . We will respond within 30 days.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                9. Supervisory Authority
              </h2>
              <p>
                You have the right to lodge a complaint with a data protection
                authority. The competent authority for Bavaria is:
              </p>
              <p className="mt-2">
                Bayerisches Landesamt für Datenschutzaufsicht (BayLDA)
                <br />
                Promenade 18
                <br />
                91522 Ansbach
                <br />
                <a
                  href="https://www.lda.bayern.de"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  www.lda.bayern.de
                </a>
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-zinc-800 dark:text-zinc-100">
                10. Changes to This Policy
              </h2>
              <p>
                We may update this privacy policy from time to time. The
                &quot;last updated&quot; date at the top reflects the most
                recent revision. Continued use of the service after changes
                constitutes acceptance.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Container>
  )
}
