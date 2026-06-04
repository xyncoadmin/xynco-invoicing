'use client'
import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ invoiceId }: { invoiceId: string }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: submitError } = await elements.submit()
    if (submitError) { setError(submitError.message ?? 'Error'); setLoading(false); return }

    const res = await fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    })
    const { clientSecret, error: apiError } = await res.json()
    if (apiError) { setError(apiError); setLoading(false); return }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/pay/${invoiceId}/success` },
    })
    if (confirmError) { setError(confirmError.message ?? 'Payment failed'); setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error && <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>}
      <button
        type="submit" disabled={!stripe || loading}
        className="w-full py-2.5 text-sm font-bold rounded-md disabled:opacity-50 transition-colors"
        style={{ background: '#0099BB', color: '#fff' }}
      >
        {loading ? 'Processing…' : 'Pay now'}
      </button>
    </form>
  )
}

export function StripeCardForm({ invoiceId }: { invoiceId: string }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    }).then(r => r.json()).then(d => { if (d.clientSecret) setClientSecret(d.clientSecret) })
  }, [invoiceId])

  if (!clientSecret) {
    return <div className="text-sm text-center py-4" style={{ color: '#9CA3AF' }}>Loading payment form…</div>
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
      <CheckoutForm invoiceId={invoiceId} />
    </Elements>
  )
}
