const COINBASE_API = 'https://api.commerce.coinbase.com'

interface CreateChargeParams {
  name: string
  amount: string
  currency: string
  invoiceId: string
  redirectUrl: string
}

export async function createCoinbaseCharge(params: CreateChargeParams) {
  const res = await fetch(`${COINBASE_API}/charges`, {
    method: 'POST',
    headers: {
      'X-CC-Api-Key': process.env.COINBASE_COMMERCE_API_KEY!,
      'X-CC-Version': '2018-03-22',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.name,
      pricing_type: 'fixed_price',
      local_price: { amount: params.amount, currency: params.currency },
      metadata: { invoiceId: params.invoiceId },
      redirect_url: params.redirectUrl,
      cancel_url: params.redirectUrl,
    }),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error?.message ?? 'Coinbase Commerce error')
  }
  return res.json()
}
