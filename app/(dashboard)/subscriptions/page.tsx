import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

const intervalLabels: Record<string, string> = {
  weekly: 'Weekly', monthly: 'Monthly', quarterly: 'Quarterly', annual: 'Annual'
}
const statusColors: Record<string, string> = {
  active: '#10B981', paused: '#F59E0B', cancelled: '#EF4444'
}

export default async function SubscriptionsPage() {
  const supabase = await createClient()
  const { data: subs } = await supabase
    .from('subscriptions').select('*, client:clients(name)').order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cloud">Subscriptions</h1>
        <Link href="/subscriptions/new"><Button>+ New subscription</Button></Link>
      </div>
      <div className="bg-navy border border-wire rounded-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-wire">
              {['Client','Amount','Interval','Next billing','Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-mono uppercase tracking-widest text-steel">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(subs ?? []).map(s => (
              <tr key={s.id} className="border-b border-wire hover:bg-slate/30 transition-colors">
                <td className="px-4 py-3 text-cloud">{(s.client as { name: string } | null)?.name}</td>
                <td className="px-4 py-3 font-mono text-cloud">${Number(s.amount).toFixed(2)} {s.currency}</td>
                <td className="px-4 py-3 text-steel">{intervalLabels[s.interval] ?? s.interval}</td>
                <td className="px-4 py-3 font-mono text-xs text-steel">{s.next_billing_date}</td>
                <td className="px-4 py-3">
                  <span className="font-mono text-xs" style={{ color: statusColors[s.status] ?? '#8FA3BF' }}>{s.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!subs?.length && (
          <div className="px-4 py-8 text-center text-steel text-sm">
            No subscriptions. <Link href="/subscriptions/new" className="text-cyan">Create one.</Link>
          </div>
        )}
      </div>
    </div>
  )
}
