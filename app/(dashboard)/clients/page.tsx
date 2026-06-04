import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cloud">Clients</h1>
        <Link href="/clients/new"><Button>+ New client</Button></Link>
      </div>
      <div className="bg-navy border border-wire rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wire">
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Name</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Email</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Currency</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Terms</th>
            </tr>
          </thead>
          <tbody>
            {(clients as Client[] ?? []).map(c => (
              <tr key={c.id} className="border-b border-wire hover:bg-slate/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/clients/${c.id}`} className="text-cloud hover:text-cyan transition-colors">{c.name}</Link>
                </td>
                <td className="px-4 py-3 text-steel">{c.email}</td>
                <td className="px-4 py-3 font-mono text-steel">{c.currency}</td>
                <td className="px-4 py-3 text-steel">Net {c.payment_terms}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!clients?.length && (
          <div className="px-4 py-8 text-center text-steel text-sm">No clients yet. <Link href="/clients/new" className="text-cyan">Add one.</Link></div>
        )}
      </div>
    </div>
  )
}
