'use client'
import { useRouter } from 'next/navigation'
import { InvoiceBuilder } from './InvoiceBuilder'
import { Client } from '@/types'

export function InvoiceBuilderWrapper({ clients }: { clients: Client[] }) {
  const router = useRouter()

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch('/api/invoices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    const invoice = await res.json()
    if (invoice.id) router.push(`/invoices/${invoice.id}`)
  }

  return <InvoiceBuilder clients={clients} onSubmit={handleSubmit} />
}
