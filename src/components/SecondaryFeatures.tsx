import { Container } from '@/components/Container'

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

export function SecondaryFeatures() {
  return (
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
            A complete profile review with specific, actionable improvements.
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
  )
}
