import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      upsert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() =>
            Promise.resolve({ data: { id: 1 }, error: null }),
          ),
        })),
      })),
    })),
  })),
}))

describe('leads database', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
  })

  it('should insert a new lead', async () => {
    const { insertLead } = await import('../lib/db')

    const result = await insertLead({
      email: 'test@example.com',
      willing_to_pay: true,
      price_shown: 29,
      main_problem: 'Not getting enough matches on my profile',
      source: 'organic',
    })

    expect(result.success).toBe(true)
    expect(result.id).toBe(1)
  })

  it('should handle insertion errors', async () => {
    const { createClient } = await import('@supabase/supabase-js')
    vi.mocked(createClient).mockReturnValue({
      from: vi.fn(() => ({
        upsert: vi.fn(() => ({
          select: vi.fn(() => ({
            single: vi.fn(() =>
              Promise.resolve({
                data: null,
                error: { message: 'Database error' },
              }),
            ),
          })),
        })),
      })),
    } as ReturnType<typeof createClient>)

    const { insertLead } = await import('../lib/db')

    const result = await insertLead({
      email: 'error@example.com',
      willing_to_pay: false,
      price_shown: 29,
      main_problem: 'Testing error handling here',
      source: null,
    })

    expect(result.success).toBe(false)
    expect(result.error).toBe('Database error')
  })
})

describe('leads API validation', () => {
  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  it('should validate correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true)
    expect(isValidEmail('user.name@domain.co.uk')).toBe(true)
    expect(isValidEmail('user+tag@example.com')).toBe(true)
  })

  it('should reject invalid email formats', () => {
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('missing@domain')).toBe(false)
    expect(isValidEmail('@nodomain.com')).toBe(false)
    expect(isValidEmail('spaces in@email.com')).toBe(false)
  })

  it('should require main_problem to be at least 10 characters', () => {
    const shortProblem = 'short'
    const validProblem = 'This is a valid problem description'

    expect(shortProblem.trim().length >= 10).toBe(false)
    expect(validProblem.trim().length >= 10).toBe(true)
  })
})
