'use client'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { ClientForm } from '@/components/clients/ClientForm'
import { Client } from '@/types'

export default function NewClientPage() {
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(data: Omit<Client, 'id' | 'created_at'>) {
    const { error } = await supabase.from('clients').insert(data)
    if (!error) router.push('/clients')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-cloud mb-6">New client</h1>
      <ClientForm onSubmit={handleSubmit} />
    </div>
  )
}
