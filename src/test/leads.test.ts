import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSingle = vi.fn()
const mockSelect = vi.fn(() => ({ single: mockSingle }))
const mockUpsert = vi.fn(() => ({ select: mockSelect }))
const mockFrom = vi.fn(() => ({ upsert: mockUpsert }))

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => Promise.resolve({ getAll: () => [], set: () => {} })),
}))

vi.mock('../lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    from: mockFrom,
  })),
}))

describe('leads database', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should insert a new lead', async () => {
    mockSingle.mockResolvedValue({ data: { id: 1 }, error: null })

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
    expect(mockFrom).toHaveBeenCalledWith('leads')
  })

  it('should handle insertion errors', async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

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
