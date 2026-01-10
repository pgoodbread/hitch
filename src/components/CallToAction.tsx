import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-call-to-action.jpg'

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

export function CallToAction() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden bg-blue-600 py-20 sm:py-32"
    >
      <Image
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={backgroundImage}
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
            Three simple steps. No account required. Everything stays private.
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
              <p className="mt-2 text-sm text-blue-100">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
