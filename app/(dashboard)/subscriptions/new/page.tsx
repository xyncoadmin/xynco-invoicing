'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm'
import { Client } from '@/types'

export default function NewSubscriptionPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    createClient().from('clients').select('*').order('name').then(({ data }) => setClients(data ?? []))
  }, [])

  async function handleSubmit(data: Record<string, unknown>) {
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) router.push('/subscriptions')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cloud mb-6">New subscription</h1>
      <SubscriptionForm clients={clients} onSubmit={handleSubmit} />
    </div>
  )
}
