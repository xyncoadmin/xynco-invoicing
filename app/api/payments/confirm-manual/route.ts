import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { invoiceId, method } = await request.json()
  if (!invoiceId || !method) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('total, status')
    .eq('id', invoiceId)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (invoice.status === 'paid' || invoice.status === 'void' || invoice.status === 'draft') {
    return NextResponse.json({ error: 'Invoice is not payable' }, { status: 400 })
  }

  // Check for existing pending payment with same method to prevent duplicates
  const { data: existing } = await supabase
    .from('payments')
    .select('id')
    .eq('invoice_id', invoiceId)
    .eq('method', method)
    .eq('status', 'pending')
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ ok: true }) // idempotent — already recorded
  }

  await supabase.from('payments').insert({
    invoice_id: invoiceId,
    method,
    amount: invoice.total,
    currency: 'CAD',
    status: 'pending',
  })

  return NextResponse.json({ ok: true })
}
