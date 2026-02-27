import { NextRequest, NextResponse } from 'next/server'
import { getOrderBySessionId } from '@/lib/orders'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')

  if (!sessionId) {
    return NextResponse.json(
      { error: 'session_id is required' },
      { status: 400 },
    )
  }

  const order = await getOrderBySessionId(sessionId)

  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }

  return NextResponse.json({ status: order.status })
}
