import { createClient } from '@/lib/supabase/server'
import { sendInvoiceEmail } from '@/lib/resend'
import { NextResponse } from 'next/server'

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*)')
    .eq('id', id)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const client = invoice.client as { name: string; email: string; currency: string }
  const items = (invoice.items ?? []) as { description: string; quantity: number; rate: number; subtotal: number }[]
  const payUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`

  await sendInvoiceEmail({
    to: client.email,
    invoiceNumber: invoice.number,
    clientName: client.name,
    total: Number(invoice.total).toFixed(2),
    currency: client.currency,
    dueDate: invoice.due_date,
    payUrl,
    items,
  })

  await supabase.from('invoices').update({ status: 'sent' }).eq('id', id)

  return NextResponse.json({ ok: true })
}
