import { NextRequest, NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redisUrl = process.env.UPSTASH_REDIS_REST_URL
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN

// Rate limiters are only created if Upstash env vars are set
let ordersLimiter: Ratelimit | null = null
let statusLimiter: Ratelimit | null = null

function getOrdersLimiter(): Ratelimit | null {
  if (!redisUrl || !redisToken) return null
  if (!ordersLimiter) {
    const redis = new Redis({ url: redisUrl, token: redisToken })
    ordersLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      prefix: 'rl:orders',
    })
  }
  return ordersLimiter
}

function getStatusLimiter(): Ratelimit | null {
  if (!redisUrl || !redisToken) return null
  if (!statusLimiter) {
    const redis = new Redis({ url: redisUrl, token: redisToken })
    statusLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, '1 m'),
      prefix: 'rl:status',
    })
  }
  return statusLimiter
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'
  )
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  let limiter: Ratelimit | null = null

  if (pathname === '/api/orders' && request.method === 'POST') {
    limiter = getOrdersLimiter()
  } else if (pathname === '/api/orders/status') {
    limiter = getStatusLimiter()
  }

  if (!limiter) {
    return NextResponse.next()
  }

  const ip = getClientIp(request)
  const { success, reset } = await limiter.limit(ip)

  if (!success) {
    const retryAfter = Math.ceil((reset - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter) },
      },
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/orders', '/api/orders/status'],
}
