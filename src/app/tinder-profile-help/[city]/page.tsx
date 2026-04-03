import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { CityHero } from '@/components/city-page/city-hero'
import { CityStats } from '@/components/city-page/city-stats'
import { CityPhotoTips } from '@/components/city-page/city-photo-tips'
import { CityBioTips } from '@/components/city-page/city-bio-tips'
import { CityFaq } from '@/components/city-page/city-faq'
import { CityCta } from '@/components/city-page/city-cta'
import { CityInternalLinks } from '@/components/city-page/city-internal-links'
import { getCityBySlug, getAllCitySlugs } from '@/data/cities'

import backgroundCallToAction from '@/images/background-call-to-action.jpg'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!

const steps = [
  {
    number: 1,
    title: 'Upload your current profile',
    description: 'Screenshots of your photos, bio, and prompts.',
  },
  {
    number: 2,
    title: 'Choose your dating goal',
    description: 'Long-term relationship, casual dating, or friends.',
  },
  {
    number: 3,
    title: 'Tell us about yourself',
    description: 'So we can tailor the optimization to YOU.',
  },
  {
    number: 4,
    title: 'Enjoy your optimized profile',
    description: 'Delivered to your inbox in minutes.',
  },
]

const pricingFeatures = [
  'Photo ranking and selection',
  'Rewritten bio',
  '3 conversation prompts that actually work',
  'Goal-specific optimization',
  'Delivered in minutes to your inbox',
]

function PricingCheckIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`h-6 w-6 flex-none fill-current stroke-current ${className || ''}`}
    >
      <path
        d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
        strokeWidth={0}
      />
      <circle
        cx={12}
        cy={12}
        r={8.25}
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function generateStaticParams() {
  return getAllCitySlugs().map((city) => ({ city }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) return {}

  return {
    title: city.metaTitle,
    description: city.metaDescription,
    alternates: {
      canonical: `${BASE_URL}/tinder-profile-help/${city.slug}`,
    },
    openGraph: {
      title: city.metaTitle,
      description: city.metaDescription,
      url: `${BASE_URL}/tinder-profile-help/${city.slug}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: city.metaTitle,
      description: city.metaDescription,
    },
  }
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>
}) {
  const { city: slug } = await params
  const city = getCityBySlug(slug)
  if (!city) notFound()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Tinder Profile Optimization',
    description: city.metaDescription,
    provider: {
      '@type': 'Organization',
      name: 'Tinder Profile Optimizer',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'City',
      name: city.name,
      containedInPlace: {
        '@type': 'State',
        name: city.state,
      },
    },
    offers: {
      '@type': 'Offer',
      price: '29',
      priceCurrency: 'USD',
      url: `${BASE_URL}/score`,
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Tinder Profile Help',
        item: `${BASE_URL}/tinder-profile-help`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: city.name,
        item: `${BASE_URL}/tinder-profile-help/${city.slug}`,
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <Header />
      <main>
        <CityHero city={city} />
        <CityStats city={city} />
        <CityPhotoTips city={city} />
        <CityBioTips city={city} />

        {/* How It Works */}
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
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <span className="relative font-display text-lg font-medium text-white">
                      {step.number}
                      {step.number === 4 && (
                        <span className="absolute -top-5 -right-10 text-3xl">
                          🎉
                        </span>
                      )}
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
            <div className="mt-10 flex justify-center gap-x-6">
              <CityCta city={city.name} />
            </div>
          </Container>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          aria-label="Pricing"
          className="bg-slate-900 py-20 sm:py-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                One-time profile optimization
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                No subscription.
                <br />
                No recurring fees.
                <br />
                Just results.
              </p>
              <p className="mt-4 text-xl font-bold text-blue-300">
                What are you waiting for? You got nothing to lose.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-md">
              <div className="rounded-3xl bg-blue-600 px-6 py-8 sm:px-8">
                <p className="mb-3 text-center text-sm font-semibold tracking-wider text-emerald-300 uppercase">
                  Spring Sale — Get ready for summer
                </p>
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="font-display text-2xl font-light tracking-tight text-red-400 line-through">
                    $29
                  </span>
                  <span className="font-display text-5xl font-light tracking-tight text-white">
                    $19
                  </span>
                  <span className="text-lg text-blue-200">one-time</span>
                </div>
                <ul
                  role="list"
                  className="mt-8 flex flex-col gap-y-3 text-sm text-white"
                >
                  {pricingFeatures.map((feature) => (
                    <li key={feature} className="flex">
                      <PricingCheckIcon className="text-white" />
                      <span className="ml-4">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex justify-center">
                  <CityCta city={city.name} label="Buy once - match forever!" />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <CityFaq city={city} />
        <CityInternalLinks city={city} />
      </main>
      <Footer />
    </>
  )
}
