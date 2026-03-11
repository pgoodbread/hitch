'use client'

import { useCallback, useState } from 'react'
import { useSwipeable } from 'react-swipeable'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { FaqAccordion } from '@/components/faq-accordion'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageViewTracker } from '@/components/page-view-tracker'
import { ScrollDepthTracker } from '@/components/scroll-depth-tracker'
import { StickyMobileCta } from '@/components/sticky-mobile-cta'
import Testimonial from '@/components/testimonial'
import { track } from '@/lib/analytics'

const howItWorksSteps = [
  {
    number: 1,
    title: 'Upload your photos + bio',
    description: 'Drop in 1-3 Tinder screenshots.',
  },
  {
    number: 2,
    title: 'AI analyzes your profile',
    description: 'Scores your photos, bio, and first impression in 30 seconds.',
  },
  {
    number: 3,
    title: 'Get your score',
    description: "See where you stand + what's holding you back.",
  },
]

const fullAnalysisFeatures = [
  'Photo-by-photo verdict (keep / remove / replace)',
  'Optimal photo order for maximum swipes',
  'Rewritten bio ready to copy-paste',
  "Conversation starters from Tinder's prompt list",
  'Personal action plan — exactly what to fix first',
]

const faqItems = [
  {
    question: 'Is the free score actually free?',
    answer:
      'Yes. No credit card, no catch. Upload your photos and bio, get your score in 30 seconds.',
  },
  {
    question: 'What do I need to upload?',
    answer:
      "1-3 screenshots of your Tinder profile photos + your bio text. That's it.",
  },
  {
    question: 'Is my data safe?',
    answer:
      "Your photos are deleted immediately after analysis. We don't store them.",
  },
  {
    question: "What's in the paid analysis?",
    answer:
      'A full report: photo-by-photo verdicts, rewritten bio, conversation prompts, and a step-by-step action plan. Delivered to your email.',
  },
  {
    question: 'Does this work for Hinge / Bumble?',
    answer: "Right now it's optimized for Tinder only. Other apps coming soon.",
  },
]

const carouselTestimonials = [
  {
    name: 'John',
    age: 39,
    quote:
      'Very good! It exceeded expectations. Especially how detailed the results were. I got noticeably more likes afterwards.',
    image: '/images/testimonials/john.JPG',
  },
  {
    name: 'Phil',
    age: 33,
    quote:
      'Honestly skeptical at first, I thought my profile was pretty good. But boy was I wrong! Photo ranking alone was worth it, but what I loved most is the step-by-step action plan!',
    image: '/images/testimonials/phil.JPG',
  },
]

const exampleScores = [
  { label: 'Photos', score: '5.1 / 10' },
  { label: 'Bio', score: '3.4 / 10' },
  { label: 'First Impression', score: '4.2 / 10' },
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = useCallback(
    () => setCurrentSlide((s) => (s + 1) % carouselTestimonials.length),
    [],
  )
  const prevSlide = useCallback(
    () =>
      setCurrentSlide(
        (s) =>
          (s - 1 + carouselTestimonials.length) % carouselTestimonials.length,
      ),
    [],
  )

  const swipeHandlers = useSwipeable({
    onSwipedLeft: nextSlide,
    onSwipedRight: prevSlide,
    trackMouse: true,
  })

  const handleCtaClick = useCallback(
    (placement: string, destination: string) => {
      track(destination === '/score' ? 'free_score_cta_click' : 'cta_click', {
        placement,
      })
    },
    [],
  )

  return (
    <>
      <PageViewTracker />
      <ScrollDepthTracker />
      <Header />
      <main className="pb-20 md:pb-0">
        {/* Hero */}
        <Container className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Not Getting Matches?{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">Your profile</span>
            </span>{' '}
            is the problem.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            AI analyzes your Tinder profile in 30 seconds and tells you exactly
            what&apos;s killing your swipes.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              href="/score?utm_source=lp&utm_content=hero"
              onClick={() => handleCtaClick('hero', '/score')}
              color="blue"
              className="w-full sm:w-auto"
            >
              Get Your Free Profile Score
            </Button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Takes 30 seconds. No credit card required.
          </p>
        </Container>

        {/* How It Works */}
        <section id="how-it-works" className="bg-slate-50 py-20 sm:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                How it works
              </h2>
            </div>
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3">
              {howItWorksSteps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="font-display text-lg font-medium">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-lg text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Example Score */}
        <section className="py-20 sm:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                What you&apos;ll get
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-md">
              <div className="rounded-2xl bg-slate-50 p-8 shadow-lg">
                <p className="text-center text-sm font-medium tracking-wide text-slate-500 uppercase">
                  Your Tinder Profile Score
                </p>
                <p className="mt-2 text-center font-display text-5xl font-medium text-slate-900">
                  4.2 <span className="text-2xl text-slate-400">/ 10</span>
                </p>
                <div className="mt-8 space-y-4">
                  {exampleScores.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between border-b border-slate-200 pb-3 last:border-0"
                    >
                      <span className="text-sm text-slate-600">
                        {item.label}
                      </span>
                      <span className="font-medium text-slate-900">
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-slate-500 italic">
                  &ldquo;Your lead photo is the weakest in your lineup.&rdquo;
                </p>
              </div>
              <div className="mt-10 flex justify-center">
                <Button
                  href="/score?utm_source=lp&utm_content=example"
                  onClick={() => handleCtaClick('example', '/score')}
                  color="blue"
                  className="w-full sm:w-auto"
                >
                  Check Your Score Free
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonial Carousel */}
        <section id="testimonials" className="py-12 sm:py-16">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                Real results from real guys
              </h2>
            </div>
            <div className="mx-auto mt-12 max-w-4xl">
              <div className="relative" {...swipeHandlers}>
                <div className="overflow-hidden rounded-2xl">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{
                      transform: `translateX(-${currentSlide * 100}%)`,
                    }}
                  >
                    {carouselTestimonials.map((testimonial) => (
                      <div key={testimonial.name} className="w-full shrink-0">
                        <Testimonial
                          quote={testimonial.quote}
                          name={testimonial.name}
                          age={testimonial.age}
                          imageSrc={testimonial.image}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={prevSlide}
                  aria-label="Previous testimonial"
                  className="absolute top-1/2 -left-4 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4 text-slate-600" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next testimonial"
                  className="absolute top-1/2 -right-4 -translate-y-1/2 rounded-full bg-white p-1.5 shadow-md transition-colors hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4 text-slate-600" />
                </button>
              </div>
              <div className="mt-4 flex justify-center gap-2">
                {carouselTestimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      i === currentSlide ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* Full Analysis Upsell */}
        <section className="bg-slate-900 py-20 sm:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
                Want the full fix?
              </h2>
              <p className="mt-4 text-lg text-slate-400">
                Your free score shows the problem.
                <br />
                The full analysis gives you the solution.
              </p>
            </div>
            <ul role="list" className="mx-auto mt-12 max-w-lg space-y-4">
              {fullAnalysisFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-x-3">
                  <Check className="mt-0.5 h-5 w-5 flex-none text-blue-400" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 flex justify-center">
              <Button
                href="/optimize?utm_source=lp&utm_content=upsell"
                onClick={() => handleCtaClick('upsell', '/optimize')}
                color="white"
              >
                Get Full Analysis — $29
              </Button>
            </div>
            <p className="mt-6 text-center text-sm text-slate-500">
              Most users see more matches within a week.
            </p>
          </Container>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          aria-labelledby="faq-title"
          className="bg-slate-50 py-20 sm:py-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2
                id="faq-title"
                className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl"
              >
                Frequently asked questions
              </h2>
            </div>
            <div className="mx-auto mt-16 max-w-2xl">
              <FaqAccordion items={faqItems} />
            </div>
          </Container>
        </section>

        {/* Footer CTA */}
        <section className="py-20 sm:py-32">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                Ready to fix your profile?
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Get your free score in 30 seconds. See exactly what&apos;s
                holding you back.
              </p>
              <div className="mt-10 flex justify-center">
                <Button
                  href="/score?utm_source=lp&utm_content=footer"
                  onClick={() => handleCtaClick('footer', '/score')}
                  color="blue"
                  className="w-full sm:w-auto"
                >
                  Get Your Free Profile Score
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  )
}
