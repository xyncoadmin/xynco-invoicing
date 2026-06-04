import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import crypto from 'crypto'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('x-cc-webhook-signature')!
  const expected = crypto
    .createHmac('sha256', process.env.COINBASE_COMMERCE_WEBHOOK_SECRET!)
    .update(body)
    .digest('hex')

  if (sig !== expected) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  const event = JSON.parse(body)
  if (event.event?.type === 'charge:confirmed') {
    const { invoiceId } = event.event.data.metadata ?? {}
    if (invoiceId) {
      const supabase = createServiceClient()
      const amount = parseFloat(event.event.data.pricing?.local?.amount ?? '0')
      const currency = (event.event.data.pricing?.local?.currency ?? 'CAD').toUpperCase()
      await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
      await supabase.from('payments').insert({
        invoice_id: invoiceId, method: 'crypto', amount, currency,
        status: 'confirmed', confirmed_at: new Date().toISOString(),
      })
    }
  }
  return NextResponse.json({ received: true })
}
