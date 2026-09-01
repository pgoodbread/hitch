import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import { ArrowLeft } from 'lucide-react'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Container } from '@/components/container'
import { getAllPosts, getPostBySlug } from '@/lib/content'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL!

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found' }
  }

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `${BASE_URL}/blog/${slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url: `${BASE_URL}/blog/${slug}`,
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    ...(post.updatedAt && { dateModified: post.updatedAt }),
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'Tinder Profile Optimizer' },
    mainEntityOfPage: `${BASE_URL}/blog/${slug}`,
  }

  return (
    <>
      <Header />
      <main>
        <Container className="py-16 sm:py-20">
          <article className="mx-auto max-w-2xl lg:max-w-3xl">
            <Link
              href="/blog"
              className="mb-8 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to the blog
            </Link>

            <header className="mb-10">
              <h1 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl">
                {post.title}
              </h1>
              <p className="mt-4 text-sm text-slate-400">
                By {post.author} ·{' '}
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                · {post.readingTime}
              </p>
            </header>

            <div className="prose max-w-none prose-slate">
              <MDXRemote
                source={post.content}
                options={{
                  mdxOptions: { remarkPlugins: [remarkGfm] },
                }}
              />
            </div>

            <aside className="mt-12 rounded-2xl bg-slate-50 p-6 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-900">
                Want this done for you?
              </h2>
              <p className="mt-2 text-slate-600">
                Get your Tinder profile scored for free, or let us optimize your
                photos, bio, and prompts in minutes.
              </p>
              <div className="mt-4 flex flex-wrap gap-4">
                <Link
                  href="/score"
                  className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                >
                  Get your free score
                </Link>
                <Link
                  href="/optimize"
                  className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-400"
                >
                  Optimize my profile
                </Link>
              </div>
            </aside>
          </article>
        </Container>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
    </>
  )
}
