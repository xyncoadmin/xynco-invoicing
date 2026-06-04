import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { addMonths, addWeeks, addYears, format } from 'date-fns'
import { SubscriptionInterval } from '@/types'

const STRIPE_INTERVALS: Record<SubscriptionInterval, { interval: 'week' | 'month' | 'year'; interval_count: number }> = {
  weekly:    { interval: 'week',  interval_count: 1 },
  monthly:   { interval: 'month', interval_count: 1 },
  quarterly: { interval: 'month', interval_count: 3 },
  annual:    { interval: 'year',  interval_count: 1 },
}

function getNextBillingDate(interval: SubscriptionInterval): string {
  const now = new Date()
  if (interval === 'weekly')    return format(addWeeks(now, 1), 'yyyy-MM-dd')
  if (interval === 'monthly')   return format(addMonths(now, 1), 'yyyy-MM-dd')
  if (interval === 'quarterly') return format(addMonths(now, 3), 'yyyy-MM-dd')
  return format(addYears(now, 1), 'yyyy-MM-dd')
}

export async function POST(request: Request) {
  const { client_id, amount, currency, interval } = await request.json()
  const supabase = await createClient()

  const { data: client } = await supabase.from('clients').select('email, name').eq('id', client_id).single()
  if (!client) return NextResponse.json({ error: 'Client not found' }, { status: 404 })

  const customers = await stripe.customers.list({ email: client.email, limit: 1 })
  const customer = customers.data[0] ?? await stripe.customers.create({ email: client.email, name: client.name })

  const price = await stripe.prices.create({
    unit_amount: Math.round(amount * 100),
    currency: (currency as string).toLowerCase(),
    recurring: STRIPE_INTERVALS[interval as SubscriptionInterval],
    product_data: { name: `xynco retainer — ${client.name}` },
  })

  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{ price: price.id }],
    metadata: { client_id },
  })

  let sub
  try {
    const { data, error } = await supabase.from('subscriptions').insert({
      client_id,
      stripe_subscription_id: subscription.id,
      amount,
      currency,
      interval,
      status: 'active',
      next_billing_date: getNextBillingDate(interval as SubscriptionInterval),
    }).select().single()

    if (error) throw error
    sub = data
  } catch (err) {
    // Rollback: cancel the Stripe subscription so customer isn't billed for an orphaned sub
    await stripe.subscriptions.cancel(subscription.id)
    const message = err instanceof Error ? err.message : 'Database error'
    return NextResponse.json({ error: message }, { status: 500 })
  }

  return NextResponse.json(sub)
}

export async function GET() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('subscriptions')
    .select('*, client:clients(name, email)')
    .order('created_at', { ascending: false })
  return NextResponse.json(data)
}
