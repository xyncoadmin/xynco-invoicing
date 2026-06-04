'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Client, Currency } from '@/types'

interface ClientFormProps {
  initial?: Partial<Client>
  onSubmit: (data: Omit<Client, 'id' | 'created_at'>) => Promise<void>
}

export function ClientForm({ initial, onSubmit }: ClientFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [email, setEmail] = useState(initial?.email ?? '')
  const [address, setAddress] = useState(initial?.address ?? '')
  const [currency, setCurrency] = useState<Currency>(initial?.currency ?? 'CAD')
  const [paymentTerms, setPaymentTerms] = useState(initial?.payment_terms ?? 14)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ name, email, address: address || null, currency, payment_terms: paymentTerms })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <Input label="Client name" required value={name} onChange={e => setName(e.target.value)} placeholder="Acme Corp" />
      <Input label="Email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="billing@acme.com" />
      <Input label="Address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Toronto, ON" />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currency" className="text-xs text-steel font-medium">Currency</label>
        <select
          id="currency"
          value={currency} onChange={e => setCurrency(e.target.value as Currency)}
          className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan"
        >
          <option value="CAD">CAD — Canadian Dollar</option>
          <option value="USD">USD — US Dollar</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="payment-terms" className="text-xs text-steel font-medium">Payment terms (days)</label>
        <select
          id="payment-terms"
          value={paymentTerms} onChange={e => setPaymentTerms(Number(e.target.value))}
          className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan"
        >
          <option value={7}>Net 7</option>
          <option value={14}>Net 14</option>
          <option value={30}>Net 30</option>
        </select>
      </div>
      <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save client'}</Button>
    </form>
  )
}
