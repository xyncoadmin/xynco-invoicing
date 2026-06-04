import { createCoinbaseCharge } from '@/lib/coinbase'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { invoiceId } = await request.json()
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices').select('total, number, client:clients(currency)').eq('id', invoiceId).single()
  if (!invoice) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const client = invoice.client as unknown as { currency: string }
  const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoiceId}/success`
  try {
    const charge = await createCoinbaseCharge({
      name: `xynco ${invoice.number}`,
      amount: Number(invoice.total).toFixed(2),
      currency: client.currency,
      invoiceId,
      redirectUrl,
    })
    return NextResponse.json({ hostedUrl: charge.data.hosted_url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create charge'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
