import Image from 'next/image'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-faqs.jpg'

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

export function Faqs() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="relative overflow-hidden bg-slate-50 py-20 sm:py-32"
    >
      <Image
        className="absolute top-0 left-1/2 max-w-none translate-x-[-30%] -translate-y-1/4"
        src={backgroundImage}
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
  )
}
