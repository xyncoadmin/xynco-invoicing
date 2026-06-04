import { capturePayPalOrder } from '@/lib/paypal'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { orderId } = await request.json()
  const capture = await capturePayPalOrder(orderId)
  if (capture.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Capture failed' }, { status: 400 })
  }

  const invoiceId = capture.purchase_units?.[0]?.custom_id
  if (!invoiceId) {
    return NextResponse.json({ error: 'Missing invoiceId in order metadata' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const amount = parseFloat(capture.purchase_units[0].payments.captures[0].amount.value)
  const currency = (capture.purchase_units[0].payments.captures[0].amount.currency_code as string).toUpperCase()

  await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
  await supabase.from('payments').insert({
    invoice_id: invoiceId, method: 'paypal', amount, currency, status: 'confirmed', confirmed_at: new Date().toISOString(),
  })
  return NextResponse.json({ ok: true })
}
