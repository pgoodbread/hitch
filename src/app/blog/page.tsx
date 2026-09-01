import type { Metadata } from 'next'
import Link from 'next/link'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { getAllPosts } from '@/lib/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export const metadata: Metadata = {
  title: 'Tinder Profile Advice That Actually Works',
  description:
    'Practical, no-fluff advice on Tinder photos, bios, and prompts — from the team that optimizes profiles for a living.',
  alternates: { canonical: `${BASE_URL}/blog` },
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <>
      <Header />
      <main>
        <Container className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl lg:max-w-3xl">
            <h1 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
              The Blog
            </h1>
            <p className="mt-4 text-lg text-slate-700">
              Practical advice on Tinder photos, bios, and prompts. No recycled
              tips — just what actually gets matches.
            </p>

            {posts.length === 0 ? (
              <p className="mt-12 text-slate-500">No articles yet.</p>
            ) : (
              <div className="mt-12 space-y-10">
                {posts.map((post) => (
                  <article key={post.slug} className="group relative">
                    <h2 className="text-xl font-semibold text-slate-900 group-hover:text-blue-600">
                      <Link href={`/blog/${post.slug}`}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </Link>
                    </h2>
                    <p className="mt-2 text-slate-600">{post.description}</p>
                    <p className="mt-2 text-sm text-slate-400">
                      {new Date(post.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      · {post.readingTime}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
