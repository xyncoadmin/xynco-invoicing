import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/ui/Badge'
import Link from 'next/link'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: client } = await supabase.from('clients').select('*').eq('id', id).single()
  if (!client) notFound()

  const { data: invoices } = await supabase
    .from('invoices').select('*').eq('client_id', id).order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-cloud">{client.name}</h1>
        <p className="text-steel text-sm mt-1">{client.email} · {client.currency} · Net {client.payment_terms}</p>
      </div>
      <h2 className="text-sm font-mono uppercase tracking-widest text-steel mb-3">Invoices</h2>
      <div className="bg-navy border border-wire rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wire">
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Number</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Total</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Due</th>
              <th className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">Status</th>
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).map(inv => (
              <tr key={inv.id} className="border-b border-wire hover:bg-slate/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/invoices/${inv.id}`} className="font-mono text-cyan hover:text-cyan-dim">{inv.number}</Link>
                </td>
                <td className="px-4 py-3 font-mono text-cloud">${Number(inv.total).toFixed(2)}</td>
                <td className="px-4 py-3 text-steel">{inv.due_date}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!invoices?.length && <div className="px-4 py-6 text-center text-steel text-sm">No invoices yet.</div>}
      </div>
    </div>
  )
}
