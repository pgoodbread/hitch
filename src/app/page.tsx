import Image from 'next/image'

import { Container } from '@/components/Container'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Hero } from '@/components/Hero'
import { PageViewTracker } from '@/components/PageViewTracker'
import { Pricing } from '@/components/Pricing'
import { PrimaryFeatures } from '@/components/PrimaryFeatures'
import backgroundCallToAction from '@/images/background-call-to-action.jpg'
import backgroundFaqs from '@/images/background-faqs.jpg'

// Static data for SecondaryFeatures
const deliverables = [
  {
    title: 'Photo ranking and selection',
    description:
      'Every photo ranked: keep, replace, or remove. Plus the best 3-4 photos for your profile, in the right order.',
  },
  {
    title: 'Rewritten bio',
    description:
      'One clear, confident bio that sounds like you. No gimmicks, no pickup lines.',
  },
  {
    title: 'Conversation prompts',
    description:
      '2-3 improved prompts or hooks that make it easier for matches to start talking.',
  },
  {
    title: 'Goal-specific optimization',
    description:
      "Tailored to what you're looking for: long-term relationship or casual dating.",
  },
  {
    title: 'Fast turnaround',
    description: 'Everything delivered in 24-48 hours. No waiting around.',
  },
]

// Static data for CallToAction
const steps = [
  {
    number: '1',
    title: 'Upload your current profile',
    description: 'Screenshots of your photos, bio, and prompts.',
  },
  {
    number: '2',
    title: 'Choose your dating goal',
    description: 'Long-term relationship or casual dating.',
  },
  {
    number: '3',
    title: 'Receive your optimized profile',
    description: 'Delivered to your inbox in 24-48 hours.',
  },
]

// Static data for Testimonials
const notThis = [
  'Not pickup lines',
  'Not changing who you are',
  'Not ongoing chat support',
  'Not a subscription',
]

// Static data for Faqs
const faqs = [
  {
    question: 'What exactly do I get?',
    answer:
      'You get a complete profile review: every photo ranked (keep, replace, or remove), the best 3-4 photos selected and ordered, a rewritten bio, and 2-3 conversation prompts. All tailored to your dating goal.',
  },
  {
    question: 'How long does it take?',
    answer:
      "You'll receive your optimized profile within 24-48 hours of submitting your current profile screenshots.",
  },
  {
    question: 'Is my data private?',
    answer:
      "Yes. We don't require an account. Your photos and profile info are used only for the review and are not stored or shared.",
  },
]

// Icons
function CheckIcon() {
  return (
    <svg
      className="h-6 w-6 flex-none text-blue-600"
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
  )
}

function XIcon() {
  return (
    <svg
      className="h-5 w-5 flex-none text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

function SmallCheckIcon() {
  return (
    <svg
      className="h-5 w-5 flex-none text-blue-600"
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
  )
}

export default function Home() {
  return (
    <>
      <PageViewTracker />
      <Header />
      <main>
        <Hero />
        <PrimaryFeatures />

        {/* SecondaryFeatures - What you'll get */}
        <section
          id="deliverables"
          aria-label="What you'll get"
          className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl md:text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                What you&apos;ll get
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                A complete profile review with specific, actionable
                improvements.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl">
              <ul role="list" className="space-y-6">
                {deliverables.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-x-4 rounded-xl bg-slate-50 p-6"
                  >
                    <CheckIcon />
                    <div>
                      <h3 className="font-display text-lg text-slate-900">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>

        {/* CallToAction - How it works */}
        <section
          id="how-it-works"
          className="relative overflow-hidden bg-blue-600 py-20 sm:py-32"
        >
          <Image
            className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
            src={backgroundCallToAction}
            alt=""
            width={2347}
            height={1244}
            unoptimized
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                How it works
              </h2>
              <p className="mt-4 text-lg tracking-tight text-blue-100">
                Three simple steps. No account required. Everything stays
                private.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <span className="font-display text-lg font-medium text-white">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-blue-100">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Testimonials - What this is/isn't */}
        <section
          id="trust"
          aria-label="What this service is and isn't"
          className="bg-slate-50 py-20 sm:py-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                This is not dating coaching.
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                No fluff. No gurus. Just practical optimization of what you
                already have.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-xl">
              <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-900/10">
                <h3 className="font-display text-lg text-slate-900">
                  What this isn&apos;t
                </h3>
                <ul role="list" className="mt-4 space-y-3">
                  {notThis.map((item) => (
                    <li key={item} className="flex items-center gap-x-3">
                      <XIcon />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 border-t border-slate-100 pt-8">
                  <h3 className="font-display text-lg text-slate-900">
                    What this is
                  </h3>
                  <div className="mt-4 flex items-start gap-x-3">
                    <SmallCheckIcon />
                    <span className="text-slate-600">
                      Practical optimization of your photos, bio, and prompts.
                      Designed specifically for Tinder.
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-center text-sm text-slate-500">
                This service removes common profile mistakes. It does not
                promise attraction.
              </p>
            </div>
          </Container>
        </section>

        <Pricing />

        {/* Faqs */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
        >
          <Image
            className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
            src={backgroundFaqs}
            alt=""
            width={1558}
            height={946}
            unoptimized
          />
          <Container className="relative">
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="faq-title"
                className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                Frequently asked questions
              </h2>
            </div>
            <ul
              role="list"
              className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
            >
              {faqs.map((faq) => (
                <li key={faq.question}>
                  <h3 className="font-display text-lg/7 text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-4 text-sm text-slate-700">{faq.answer}</p>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
