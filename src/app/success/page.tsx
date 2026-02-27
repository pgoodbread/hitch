import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { SuccessContent } from '@/components/success/success-content'

export const metadata: Metadata = {
  title: 'Order Confirmed | Tinder Profile Optimizer',
  robots: { index: false, follow: false },
}

export default function SuccessPage() {
  return (
    <>
      <Header />
      <main>
        <Container className="pt-20 pb-16 lg:pt-32">
          <Suspense
            fallback={
              <div className="text-center text-slate-500">Loading...</div>
            }
          >
            <SuccessContent />
          </Suspense>
        </Container>
      </main>
      <Footer />
    </>
  )
}
