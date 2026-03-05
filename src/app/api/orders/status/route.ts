import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'session_id is required' },
      { status: 400 },
    )
  }

  const { data: order, error } = await getSupabaseAdmin()
    .from('orders')
    .select('status')
    .eq('stripe_session_id', sessionId)
    .single()

  if (error || !order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ status: order.status })
}
