import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { ScoreForm } from '@/components/score/score-form'

export const metadata: Metadata = {
  title: 'Free Tinder Profile Score | Tinder Profile Optimizer',
  description:
    'Get your free Tinder profile score in seconds. Upload your photos and bio to see how your profile stacks up — and what to fix.',
  openGraph: {
    title: 'Free Tinder Profile Score',
    description:
      'Get your free Tinder profile score in seconds. See how your profile stacks up.',
  },
}

export default function ScorePage() {
  return (
    <>
      <Header />
      <main>
        <Container className="pt-20 pb-16 lg:pt-32">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="font-display text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                How does your profile score?
              </h1>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Upload your photos and bio. Get your score in seconds — free.
              </p>
            </div>
            <div className="mt-12">
              <ScoreForm />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
