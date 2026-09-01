import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Post {
  slug: string
  title: string
  date: string
  updatedAt?: string
  description: string
  tags: string[]
  author: string
  content: string
  readingTime: string
}

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

function estimateReadingTime(content: string): string {
  const words = content.split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.round(words / 200))
  return `${minutes} min read`
}

export function getPostSlugs(): string[] {
  try {
    return fs
      .readdirSync(BLOG_DIR)
      .filter((file) => file.endsWith('.mdx'))
      .map((file) => file.replace(/\.mdx$/, ''))
  } catch {
    return []
  }
}

export function getPostBySlug(slug: string): Post | null {
  try {
    const fullPath = path.join(BLOG_DIR, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      title: data.title || 'Untitled',
      date: data.date || new Date().toISOString(),
      updatedAt: data.updatedAt,
      description: data.description || '',
      tags: data.tags || [],
      author: data.author || 'Mathew',
      content,
      readingTime: estimateReadingTime(content),
    }
  } catch {
    return null
  }
}

export function getAllPosts(): Post[] {
  const now = new Date()
  return getPostSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .filter((post) => new Date(post.date) <= now)
    .sort((a, b) => (new Date(b.date) > new Date(a.date) ? 1 : -1))
}
