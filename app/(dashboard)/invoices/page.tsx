import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, client:clients(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cloud">Invoices</h1>
        <Link href="/invoices/new"><Button>+ New invoice</Button></Link>
      </div>
      <div className="bg-navy border border-wire rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wire">
              {['Number','Client','Total','Issued','Due','Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(invoices ?? []).map(inv => (
              <tr key={inv.id} className="border-b border-wire hover:bg-slate/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/invoices/${inv.id}`} className="font-mono text-cyan hover:text-cyan-dim">{inv.number}</Link>
                </td>
                <td className="px-4 py-3 text-steel">{(inv.client as { name: string } | null)?.name}</td>
                <td className="px-4 py-3 font-mono text-cloud">${Number(inv.total).toFixed(2)}</td>
                <td className="px-4 py-3 text-steel font-mono text-xs">{inv.issue_date}</td>
                <td className="px-4 py-3 text-steel font-mono text-xs">{inv.due_date}</td>
                <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!invoices?.length && (
          <div className="px-4 py-8 text-center text-steel text-sm">No invoices. <Link href="/invoices/new" className="text-cyan">Create one.</Link></div>
        )}
      </div>
    </div>
  )
}
