import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/service'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!
  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 })
  }

  const supabase = createServiceClient()

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent
    const invoiceId = pi.metadata?.invoiceId
    if (invoiceId) {
      await supabase.from('invoices').update({ status: 'paid' }).eq('id', invoiceId)
      await supabase.from('payments').insert({
        invoice_id: invoiceId,
        method: 'card',
        amount: pi.amount / 100,
        currency: pi.currency.toUpperCase(),
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        stripe_payment_intent_id: pi.id,
      })
    }
  }

  return NextResponse.json({ received: true })
}
