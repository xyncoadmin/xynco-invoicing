import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { invoiceId, method } = await request.json()
  const supabase = await createClient()

  const { data: invoice } = await supabase.from('invoices').select('total').eq('id', invoiceId).single()
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await supabase.from('payments').insert({
    invoice_id: invoiceId,
    method,
    amount: invoice.total,
    currency: 'CAD',
    status: 'pending',
  })

  return NextResponse.json({ ok: true })
}
