import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { OptimizerForm } from '@/components/optimizer/optimizer-form'
import { FormStartTracker } from '@/components/optimizer/form-start-tracker'

export const metadata: Metadata = {
  title: 'Optimize Your Tinder Profile | Tinder Profile Optimizer',
  description:
    'Upload your photos, choose your dating goal, and get a personalized Tinder profile optimization delivered to your inbox in minutes.',
}

export default function OptimizePage() {
  return (
    <>
      <Header />
      <main>
        <Container className="pt-20 pb-16 lg:pt-32">
          <div className="mx-auto max-w-2xl">
            <div className="text-center">
              <h1 className="font-display text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
                Optimize your profile
              </h1>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                4 quick steps. Results delivered to your inbox in minutes.
              </p>
            </div>
            <div className="mt-12">
              <FormStartTracker />
              <OptimizerForm />
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
