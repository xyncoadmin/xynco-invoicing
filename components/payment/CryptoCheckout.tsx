'use client'
import { useState } from 'react'

export function CryptoCheckout({ invoiceId }: { invoiceId: string }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    const res = await fetch('/api/coinbase/create-charge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId }),
    })
    const data = await res.json()
    if (data.error) { setError(data.error); setLoading(false); return }
    window.location.href = data.hostedUrl
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm" style={{ color: '#374151' }}>
        Pay with Bitcoin, Ethereum, or USDC via Coinbase Commerce.
      </div>
      <div className="flex gap-2 text-xs font-mono" style={{ color: '#6B7280' }}>
        <span>BTC</span><span>·</span><span>ETH</span><span>·</span><span>USDC</span>
      </div>
      {error && <p className="text-xs" style={{ color: '#EF4444' }}>{error}</p>}
      <button
        onClick={handleClick} disabled={loading}
        className="w-full py-2.5 text-sm font-bold rounded-md disabled:opacity-50 transition-colors"
        style={{ background: '#0052FF', color: '#fff' }}
      >
        {loading ? 'Redirecting…' : 'Pay with Crypto'}
      </button>
    </div>
  )
}
