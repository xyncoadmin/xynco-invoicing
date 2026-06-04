import { createClient } from '@/lib/supabase/server'
import { generateInvoiceNumber } from '@/lib/invoice-number'
import { calcInvoiceTotals, calcItemSubtotal } from '@/lib/invoice-calc'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const body = await request.json()
  const { client_id, items, tax_rate, due_date, notes, issue_date } = body

  const processedItems = items.map((item: { description: string; quantity: number; rate: number }) => ({
    ...item,
    subtotal: calcItemSubtotal(item.quantity, item.rate),
  }))

  const { subtotal, taxAmount, total } = calcInvoiceTotals(processedItems, tax_rate ?? 0)
  const number = await generateInvoiceNumber()

  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert({ client_id, number, status: 'draft', issue_date, due_date, subtotal, tax_rate: tax_rate ?? 0, tax_amount: taxAmount, total, notes: notes || null })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  if (processedItems.length > 0) {
    await supabase.from('invoice_items').insert(
      processedItems.map((item: { description: string; quantity: number; rate: number; subtotal: number }) => ({ ...item, invoice_id: invoice.id }))
    )
  }

  return NextResponse.json(invoice)
}

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('invoices')
    .select('*, client:clients(name, email, currency)')
    .order('created_at', { ascending: false })
  return NextResponse.json(data)
}
