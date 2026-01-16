import { cookies } from 'next/headers'
import { createClient } from './supabase/server'

export interface Lead {
  email: string
  willing_to_pay: boolean
  price_shown: number
  main_problem: string
  source?: string | null
}

export interface InsertLeadResult {
  success: boolean
  id?: number
  error?: string
}

export async function insertLead(lead: Lead): Promise<InsertLeadResult> {
  const cookieStore = await cookies()
  const supabase = await createClient(cookieStore)

  const { data, error } = await supabase
    .from('leads')
    .upsert(
      {
        email: lead.email,
        willing_to_pay: lead.willing_to_pay,
        price_shown: lead.price_shown,
        main_problem: lead.main_problem,
        source: lead.source ?? null,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'email',
        ignoreDuplicates: false,
      },
    )
    .select('id')
    .single()

  if (error) {
    console.error('Error inserting lead:', error)
    return { success: false, error: error.message }
  }

  return { success: true, id: data?.id }
}
