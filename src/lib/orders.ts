import { cookies } from 'next/headers'
import { createClient } from './supabase/server'

export interface Order {
  id: string
  email: string
  dating_goal: 'relationship' | 'casual' | 'friends'
  about_user: string
  age: number | null
  upload_keys: string[]
  stripe_session_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  ai_report: string | null
  source: string | null
  created_at: string
  updated_at: string
}

export async function createOrder(
  order: Pick<
    Order,
    'email' | 'dating_goal' | 'about_user' | 'age' | 'upload_keys' | 'source'
  >,
): Promise<{ id: string } | { error: string }> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('orders')
    .insert({
      email: order.email,
      dating_goal: order.dating_goal,
      about_user: order.about_user,
      age: order.age,
      upload_keys: order.upload_keys,
      source: order.source,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error creating order:', error)
    return { error: error.message }
  }

  return { id: data.id }
}

export async function getOrderBySessionId(
  sessionId: string,
): Promise<Order | null> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return null
  }

  return data as Order
}

export async function updateOrderStatus(
  id: string,
  status: Order['status'],
  extra?: { stripe_session_id?: string; ai_report?: string },
): Promise<boolean> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from('orders')
    .update({ status, ...extra })
    .eq('id', id)

  if (error) {
    console.error('Error updating order status:', error)
    return false
  }

  return true
}
