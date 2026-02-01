import { type Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import clsx from 'clsx'

import '@/styles/tailwind.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    template: '%s - Tinder Profile Optimizer',
    default:
      'Tinder Profile Optimizer - Get more matches from the profile you already have.',
  },
  description:
    'Get more matches from the profile you already have. A one-time Tinder profile optimization for men who want better results without changing who they are.',
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
