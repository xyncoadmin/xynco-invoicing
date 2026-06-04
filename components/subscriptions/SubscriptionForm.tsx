'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Client, SubscriptionInterval } from '@/types'

const INTERVALS: { value: SubscriptionInterval; label: string }[] = [
  { value: 'weekly',    label: 'Weekly' },
  { value: 'monthly',   label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly (every 3 months)' },
  { value: 'annual',    label: 'Annual' },
]

interface Props {
  clients: Client[]
  onSubmit: (d: Record<string, unknown>) => Promise<void>
}

export function SubscriptionForm({ clients, onSubmit }: Props) {
  const [clientId, setClientId] = useState('')
  const [amount, setAmount] = useState('')
  const [interval, setInterval] = useState<SubscriptionInterval>('monthly')
  const [loading, setLoading] = useState(false)

  const selectedClient = clients.find(c => c.id === clientId)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ client_id: clientId, amount: parseFloat(amount), currency: selectedClient?.currency ?? 'CAD', interval })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sub-client" className="text-xs text-steel font-medium">Client</label>
        <select id="sub-client" required value={clientId} onChange={e => setClientId(e.target.value)}
          className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan">
          <option value="">Select client…</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <Input label="Amount" type="number" min="1" step="0.01" required value={amount}
        onChange={e => setAmount(e.target.value)}
        hint={selectedClient ? `Billed in ${selectedClient.currency}` : undefined} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="sub-interval" className="text-xs text-steel font-medium">Billing interval</label>
        <select id="sub-interval" value={interval} onChange={e => setInterval(e.target.value as SubscriptionInterval)}
          className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan">
          {INTERVALS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
      </div>
      <Button type="submit" disabled={loading || !clientId || !amount}>
        {loading ? 'Creating…' : 'Create subscription'}
      </Button>
    </form>
  )
}
