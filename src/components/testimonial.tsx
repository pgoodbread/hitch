import Image from 'next/image'

interface TestimonialProps {
  quote: string
  name: string
  title: string
  imageSrc: string
}

export default function Testimonial({ quote, name, title, imageSrc }: TestimonialProps) {
  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8 dark:bg-gray-900">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-100),white)] opacity-20 dark:bg-[radial-gradient(45rem_50rem_at_top,var(--color-indigo-500),transparent)] dark:opacity-10" />
      <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-white shadow-xl ring-1 shadow-indigo-600/10 ring-indigo-50 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center dark:bg-gray-900 dark:shadow-indigo-500/5 dark:ring-white/5" />
      <div className="mx-auto max-w-2xl lg:max-w-4xl">
        <figure className="mt-10">
          <blockquote className="text-center text-xl/8 font-semibold text-gray-900 sm:text-2xl/9 dark:text-white">
            <p>&ldquo;{quote}&rdquo;</p>
          </blockquote>
          <figcaption className="mt-10">
            <Image
              alt={name}
              src={imageSrc}
              width={40}
              height={40}
              className="mx-auto size-10 rounded-full"
            />
            <div className="mt-4 flex items-center justify-center space-x-3 text-base">
              <div className="font-semibold text-gray-900 dark:text-white">{name}</div>
              <svg width={3} height={3} viewBox="0 0 2 2" aria-hidden="true" className="fill-gray-900 dark:fill-white">
                <circle r={1} cx={1} cy={1} />
              </svg>
              <div className="text-gray-600 dark:text-gray-400">{title}</div>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
