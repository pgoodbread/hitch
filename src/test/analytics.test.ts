import { describe, it, expect, beforeEach, afterAll } from 'vitest'
import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

const TEST_DB_PATH = path.join(process.cwd(), 'data', 'test-analytics.db')

describe('Analytics', () => {
  let db: Database.Database

  beforeEach(() => {
    // Remove existing test database
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH)
    }

    // Create fresh database
    db = new Database(TEST_DB_PATH)
    db.exec(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_name TEXT NOT NULL,
        source TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      )
    `)
  })

  afterAll(() => {
    if (db) {
      db.close()
    }
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH)
    }
  })

  it('should insert an analytics event', () => {
    const stmt = db.prepare(`
      INSERT INTO analytics_events (event_name, source)
      VALUES (@event_name, @source)
    `)

    const result = stmt.run({
      event_name: 'page_view',
      source: null,
    })

    expect(result.changes).toBe(1)
  })

  it('should store event with source', () => {
    const stmt = db.prepare(`
      INSERT INTO analytics_events (event_name, source)
      VALUES (@event_name, @source)
    `)

    stmt.run({
      event_name: 'cta_click',
      source: 'facebook',
    })

    const event = db
      .prepare('SELECT * FROM analytics_events WHERE event_name = ?')
      .get('cta_click') as { event_name: string; source: string }

    expect(event.event_name).toBe('cta_click')
    expect(event.source).toBe('facebook')
  })

  it('should store all event types', () => {
    const events = [
      'page_view',
      'cta_click',
      'intent_yes',
      'intent_no',
      'form_submit',
      'form_error',
    ]

    const stmt = db.prepare(`
      INSERT INTO analytics_events (event_name, source)
      VALUES (@event_name, @source)
    `)

    events.forEach((event) => {
      stmt.run({ event_name: event, source: null })
    })

    const count = db
      .prepare('SELECT COUNT(*) as count FROM analytics_events')
      .get() as { count: number }

    expect(count.count).toBe(6)
  })
})
