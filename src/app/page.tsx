'use client'

import { useEffect, useCallback, useState } from 'react'
import Image from 'next/image'
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Transition,
} from '@headlessui/react'
import clsx from 'clsx'
import { useSwipeable } from 'react-swipeable'

import { Button } from '@/components/button'
import { Container } from '@/components/container'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { PageViewTracker } from '@/components/page-view-tracker'
import { ScrollDepthTracker } from '@/components/scroll-depth-tracker'
import { track } from '@/lib/analytics'
import backgroundCallToAction from '@/images/background-call-to-action.jpg'
import backgroundFaqs from '@/images/background-faqs.jpg'
import backgroundFeatures from '@/images/background-features.jpg'
import { ImageUp, PenLine, MessageCircleHeart, Target } from 'lucide-react'

// Static data for SecondaryFeatures
const deliverables = [
  {
    title: 'Photo Ranking',
    description:
      'Every photo ranked: keep, replace, or remove. Plus the best 3-4 photos for your profile, in the right order.',
    image: '/images/photo-ranking.png',
  },
  {
    title: 'Fresh Bio',
    description:
      'One clear, confident bio that sounds like you. No gimmicks, no pickup lines.',
    image: '/images/bio.png',
  },
  {
    title: 'Tailored Prompts',
    description:
      '2-3 improved prompts or hooks that make it easier for matches to start talking.',
    image: '/images/prompts.png',
  },
  {
    title: 'Goal-Specific Optimization',
    description:
      "Tailored to what you're looking for: long-term relationship, casual dating, or finding new friends.",
    image: '/images/goals.png',
  },
  {
    title: 'Fast Results',
    description: 'Everything delivered in minutes. No waiting around.',
    image: '/images/fast.png',
  },
]

// Static data for CallToAction
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

// Static data for Testimonials
const notThis = [
  'Not pickup lines',
  'Not changing who you are',
  'Not ongoing chat support',
  'Not a subscription',
]

const butThis = [
  'Practical optimization of your photos, bio, and prompts.',
  'Designed specifically for Tinder.',
  'Delivered to your inbox in minutes.',
  'One-time payment.',
  'A second chance at dating.',
]

// Static data for Faqs
const faqs = [
  {
    question: 'What exactly do I get?',
    answer:
      'You get a complete profile review: every photo ranked (keep, replace, or remove), the best 3-4 photos selected and ordered, a rewritten bio, and 3 conversation prompts including answers that actually work. All tailored to your dating goal.',
  },
  {
    question: 'How long does it take?',
    answer:
      "You'll receive your optimized profile within minutes of submitting your current profile screenshots.",
  },
  {
    question: 'Is my data private?',
    answer:
      "Yes. We don't require an account. Your photos and profile info are used only for the review and are not stored or shared.",
  },
]

// Static data for PrimaryFeatures
const painPoints = [
  {
    title: 'Wrong Photos',
    emoji: '❌',
    icon: ImageUp,
    description:
      "You don't know which photos actually work. Is it the hiking one? The suit? You've tried rearranging them, but who knows.",
  },
  {
    title: 'Boring Bio',
    emoji: '💤',
    icon: PenLine,
    description:
      "Your bio feels fine, but it doesn't start conversations. The few People that do swipe right, quickly disappear.",
  },
  {
    title: 'No Ideas',
    emoji: '❓',
    icon: MessageCircleHeart,
    description:
      "Generic advice online doesn't fit your situation. You're not a pickup artist. You just want better results. But you don't know how to get there.",
  },
  {
    title: 'No Matches',
    emoji: '💔',
    icon: Target,
    description:
      "Sometimes you get matches, but not consistently. Some weeks feel okay, most are dead. You've tried everything, but nothing works.",
  },
]

// Static data for Pricing
const pricingFeatures = [
  'Photo ranking and selection',
  'Rewritten bio',
  '3 conversation prompts that actually work',
  'Goal-specific optimization',
  'Delivered in minutes to your inbox',
]

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

const STRIPE_URL = 'https://buy.stripe.com/6oUcN59Ub3Zm4jr07R6EU05'

export default function Home() {
  const [selectedDeliverableIndex, setSelectedDeliverableIndex] = useState(0)
  const [tabOrientation, setTabOrientation] = useState<
    'horizontal' | 'vertical'
  >('horizontal')

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSelectedDeliverableIndex((prev) =>
        Math.min(prev + 1, deliverables.length - 1),
      )
    },
    onSwipedRight: () => {
      setSelectedDeliverableIndex((prev) => Math.max(prev - 1, 0))
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  })

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  const handleCtaClick = useCallback(() => {
    track('cta_click')
    window.location.href = STRIPE_URL
  }, [])

  return (
    <>
      <PageViewTracker />
      <ScrollDepthTracker />
      <Header />
      <main>
        {/* Hero */}
        <Container className="pt-20 pb-16 text-center lg:pt-32">
          <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
            Get{' '}
            <span className="relative whitespace-nowrap text-blue-600">
              <svg
                aria-hidden="true"
                viewBox="0 0 418 42"
                className="absolute top-2/3 left-0 h-[0.58em] w-full fill-blue-300/70"
                preserveAspectRatio="none"
              >
                <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
              </svg>
              <span className="relative">more matches</span>
            </span>{' '}
            from the profile you already have.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
            A one-time Tinder profile optimization for men who want better
            results without changing who they are.
          </p>
          <div className="mt-10 flex justify-center gap-x-6">
            <Button onClick={handleCtaClick}>Optimize my profile</Button>
          </div>
          <p className="mt-6 text-sm text-slate-500">
            Takes 5 minutes · One-time payment · Results delivered to your inbox
          </p>
        </Container>

        {/* PrimaryFeatures */}
        <section
          id="features"
          aria-label="Common profile problems"
          className="relative overflow-hidden bg-blue-600 pt-20 pb-28 sm:py-32"
        >
          <Image
            className="absolute top-1/2 left-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
            src={backgroundFeatures}
            alt=""
            width={2245}
            height={1636}
            unoptimized
          />
          <Container className="relative">
            <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
              <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
                It&apos;s not you.
                <br />
                It&apos;s{' '}
                <span className="relative px-1 whitespace-nowrap text-white">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute top-1/4 left-0 z-1 h-[1em] w-full fill-red-500"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span className="relative z-0">me</span>
                </span>
                !
                <br />
                No - It&apos;s your profile.
              </h2>
              <p className="mt-6 text-lg tracking-tight text-blue-100">
                Most guys have the same few problems. Small fixes lead to real
                results.
              </p>
            </div>
            <TabGroup
              className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
              vertical={tabOrientation === 'vertical'}
              selectedIndex={selectedDeliverableIndex}
              onChange={setSelectedDeliverableIndex}
            >
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 px-4 whitespace-nowrap sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {deliverables.map((point, pointIndex) => (
                    <div
                      key={point.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedDeliverableIndex === pointIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-white/10 lg:ring-inset'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display text-lg data-selected:not-data-focus:outline-hidden',
                            selectedDeliverableIndex === pointIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {point.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedDeliverableIndex === pointIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {point.description}
                      </p>
                    </div>
                  ))}
                </TabList>
              </div>
              <div {...swipeHandlers} className="lg:col-span-7">
                <TabPanels>
                  {deliverables.map((point, pointIndex) => (
                    <TabPanel key={point.title} unmount={false}>
                      <Transition
                        as="div"
                        show={selectedDeliverableIndex === pointIndex}
                        enter="transition-opacity duration-300 ease-out"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-200 ease-in"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <div className="relative sm:px-6 lg:hidden">
                          <div className="absolute -inset-x-4 -top-26 -bottom-17 bg-linear-to-b from-white/10 to-white/0 ring-1 ring-white/10 ring-inset sm:inset-x-0 sm:rounded-t-xl" />
                          <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                            {point.description}
                          </p>
                        </div>
                        <div className="mt-10 flex items-center justify-center lg:mt-0">
                          <div className="w-full rounded-2xl bg-white/10 p-4 text-center ring-1 ring-white/20 ring-inset md:w-1/2">
                            <Image
                              src={point.image}
                              alt={point.title}
                              width={1000}
                              height={1000}
                              className="rounded-lg shadow-lg"
                            />
                          </div>
                        </div>
                      </Transition>
                    </TabPanel>
                  ))}
                </TabPanels>
              </div>
            </TabGroup>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button onClick={handleCtaClick}>Optimize my profile</Button>
            </div>
          </Container>
        </section>

        {/* SecondaryFeatures - What you'll get */}
        <section
          id="deliverables"
          aria-label="What you'll get"
          className="pt-20 pb-14 sm:pt-32 sm:pb-20 lg:pb-32"
        >
          <Container>
            <div className="mx-auto max-w-2xl md:text-center">
              <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                What you&apos;ll solve
              </h2>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Get rid of the common problems that are holding you back from
                getting more matches.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl">
              <ul role="list" className="space-y-6">
                {painPoints.map((item) => (
                  <li
                    key={item.title}
                    className="flex gap-x-4 rounded-xl bg-slate-50"
                  >
                    <div className="flex items-center justify-center rounded-xl bg-blue-600/10 p-6">
                      <div className="relative">
                        <item.icon className="h-10 w-10 text-blue-600" />
                        <span className="absolute top-1/2 -right-2 text-lg">
                          {item.emoji}
                        </span>
                      </div>
                    </div>
                    <div className="py-4">
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
            <div className="mt-10 flex justify-center gap-x-6">
              <Button onClick={handleCtaClick}>Optimize my profile</Button>
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
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 sm:grid-cols-4">
              {steps.map((step) => (
                <div key={step.number} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <span className="relative text-lg font-medium text-white not-last:font-display">
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
              <Button onClick={handleCtaClick}>Optimize my profile</Button>
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
                  <ul role="list" className="mt-4 space-y-3">
                    {butThis.map((item) => (
                      <li key={item} className="flex items-center gap-x-3">
                        <SmallCheckIcon />
                        <span className="text-slate-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-8 text-center text-sm text-slate-500">
                This service removes common profile mistakes. It does not
                promise attraction.
              </p>
            </div>
            <div className="mt-10 flex justify-center gap-x-6">
              <Button onClick={handleCtaClick}>Optimize my profile</Button>
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
                <div className="flex items-baseline justify-center gap-x-2">
                  <span className="font-display text-2xl font-light tracking-tight text-red-500 line-through">
                    $49
                  </span>
                  <span className="font-display text-5xl font-light tracking-tight text-white">
                    $29
                  </span>
                  <span className="text-lg text-blue-200">one-time</span>
                </div>
                <p className="mt-4 text-center text-sm text-blue-200">
                  Early access · Limited spots
                </p>
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
                <Button
                  onClick={handleCtaClick}
                  color="white"
                  className="mt-8 w-full"
                >
                  Buy once - match forever!
                </Button>
              </div>
            </div>
          </Container>
        </section>

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
            <div className="mt-10 flex justify-center gap-x-6">
              <Button onClick={handleCtaClick}>Optimize my profile</Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  )
}
