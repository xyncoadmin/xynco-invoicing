import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { invoiceId } = await request.json()
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(currency, email, name)')
    .eq('id', invoiceId)
    .single()

  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const client = invoice.client as { currency: string; email: string; name: string }
  const amountInCents = Math.round(Number(invoice.total) * 100)

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: client.currency.toLowerCase(),
    metadata: { invoiceId, invoiceNumber: invoice.number },
    receipt_email: client.email,
  })

  return NextResponse.json({ clientSecret: paymentIntent.client_secret })
}
