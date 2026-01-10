import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-leads.db')

function createTestDb() {
  // Clean up any existing test database
  if (fs.existsSync(TEST_DB_PATH)) {
    fs.unlinkSync(TEST_DB_PATH)
  }

  const db = new Database(TEST_DB_PATH)
  db.pragma('journal_mode = WAL')
  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      willing_to_pay INTEGER NOT NULL DEFAULT 0,
      price_shown INTEGER NOT NULL,
      main_problem TEXT NOT NULL,
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
  return db
}

function insertLead(
  db: Database.Database,
  lead: {
    email: string
    willing_to_pay: boolean
    price_shown: number
    main_problem: string
    source?: string | null
  },
) {
  const stmt = db.prepare(`
    INSERT INTO leads (email, willing_to_pay, price_shown, main_problem, source)
    VALUES (@email, @willing_to_pay, @price_shown, @main_problem, @source)
    ON CONFLICT(email) DO UPDATE SET
      willing_to_pay = @willing_to_pay,
      price_shown = @price_shown,
      main_problem = @main_problem,
      source = COALESCE(@source, leads.source),
      created_at = datetime('now')
  `)

  const result = stmt.run({
    email: lead.email,
    willing_to_pay: lead.willing_to_pay ? 1 : 0,
    price_shown: lead.price_shown,
    main_problem: lead.main_problem,
    source: lead.source ?? null,
  })

  return {
    success: true,
    id: result.lastInsertRowid as number,
  }
}

describe('leads database', () => {
  let db: Database.Database

  beforeEach(() => {
    db = createTestDb()
  })

  afterEach(() => {
    db.close()
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH)
    }
    // Clean up WAL files
    const walPath = TEST_DB_PATH + '-wal'
    const shmPath = TEST_DB_PATH + '-shm'
    if (fs.existsSync(walPath)) fs.unlinkSync(walPath)
    if (fs.existsSync(shmPath)) fs.unlinkSync(shmPath)
  })

  it('should insert a new lead', () => {
    const result = insertLead(db, {
      email: 'test@example.com',
      willing_to_pay: true,
      price_shown: 29,
      main_problem: 'Not getting enough matches on my profile',
      source: 'organic',
    })

    expect(result.success).toBe(true)
    expect(result.id).toBeGreaterThan(0)

    const row = db
      .prepare('SELECT * FROM leads WHERE email = ?')
      .get('test@example.com') as {
      email: string
      willing_to_pay: number
      price_shown: number
      main_problem: string
      source: string
    }
    expect(row.email).toBe('test@example.com')
    expect(row.willing_to_pay).toBe(1)
    expect(row.price_shown).toBe(29)
    expect(row.main_problem).toBe('Not getting enough matches on my profile')
    expect(row.source).toBe('organic')
  })

  it('should upsert on duplicate email', () => {
    insertLead(db, {
      email: 'duplicate@example.com',
      willing_to_pay: false,
      price_shown: 29,
      main_problem: 'Original problem description here',
      source: 'utm_source_1',
    })

    insertLead(db, {
      email: 'duplicate@example.com',
      willing_to_pay: true,
      price_shown: 29,
      main_problem: 'Updated problem description here',
      source: null,
    })

    const rows = db
      .prepare('SELECT * FROM leads WHERE email = ?')
      .all('duplicate@example.com')
    expect(rows.length).toBe(1)

    const row = rows[0] as {
      willing_to_pay: number
      main_problem: string
      source: string
    }
    expect(row.willing_to_pay).toBe(1)
    expect(row.main_problem).toBe('Updated problem description here')
    // Source should be preserved from original if new source is null
    expect(row.source).toBe('utm_source_1')
  })

  it('should store willing_to_pay as 0 when false', () => {
    insertLead(db, {
      email: 'notwilling@example.com',
      willing_to_pay: false,
      price_shown: 29,
      main_problem: 'Just testing the flow here',
      source: null,
    })

    const row = db
      .prepare('SELECT willing_to_pay FROM leads WHERE email = ?')
      .get('notwilling@example.com') as { willing_to_pay: number }
    expect(row.willing_to_pay).toBe(0)
  })

  it('should handle null source', () => {
    insertLead(db, {
      email: 'nosource@example.com',
      willing_to_pay: true,
      price_shown: 29,
      main_problem: 'Problem without source tracking',
      source: null,
    })

    const row = db
      .prepare('SELECT source FROM leads WHERE email = ?')
      .get('nosource@example.com') as { source: string | null }
    expect(row.source).toBeNull()
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
