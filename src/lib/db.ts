import Database from 'better-sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'leads.db')

let db: Database.Database | null = null

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH)
    db.pragma('journal_mode = WAL')
    initializeSchema(db)
  }
  return db
}

function initializeSchema(database: Database.Database): void {
  database.exec(`
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

  database.exec(`
    CREATE TABLE IF NOT EXISTS analytics_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT NOT NULL,
      source TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)
}

export interface Lead {
  email: string
  willing_to_pay: boolean
  price_shown: number
  main_problem: string
  source?: string | null
}

export function insertLead(lead: Lead): { success: boolean; id?: number } {
  const database = getDb()

  const stmt = database.prepare(`
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

export type AnalyticsEvent =
  | 'page_view'
  | 'cta_click'
  | 'intent_yes'
  | 'intent_no'
  | 'form_submit'
  | 'form_error'

export function trackEvent(
  eventName: AnalyticsEvent,
  source?: string | null,
): { success: boolean } {
  const database = getDb()

  const stmt = database.prepare(`
    INSERT INTO analytics_events (event_name, source)
    VALUES (@event_name, @source)
  `)

  stmt.run({
    event_name: eventName,
    source: source ?? null,
  })

  return { success: true }
}
