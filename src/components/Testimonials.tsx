import { Container } from '@/components/Container'

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

function CheckIcon() {
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

const notThis = [
  'Not pickup lines',
  'Not changing who you are',
  'Not ongoing chat support',
  'Not a subscription',
]

export function Testimonials() {
  return (
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
            No fluff. No gurus. Just practical optimization of what you already
            have.
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
                <CheckIcon />
                <span className="text-slate-600">
                  Practical optimization of your photos, bio, and prompts.
                  Designed specifically for Tinder.
                </span>
              </div>
            </div>
          </div>
          <p className="mt-8 text-center text-sm text-slate-500">
            This service removes common profile mistakes. It does not promise
            attraction.
          </p>
        </div>
      </Container>
    </section>
  )
}
