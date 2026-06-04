import { createPayPalOrder } from '@/lib/paypal'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { invoiceId } = await request.json()
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices').select('total, client:clients(currency)').eq('id', invoiceId).single()
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const client = invoice.client as unknown as { currency: string }
  const order = await createPayPalOrder(Number(invoice.total), client.currency, invoiceId)
  return NextResponse.json({ id: order.id })
}
