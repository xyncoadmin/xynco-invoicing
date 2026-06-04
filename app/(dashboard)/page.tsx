import { createClient } from '@/lib/supabase/server'
import { StatsBar } from '@/components/dashboard/StatsBar'
import { RecentInvoices } from '@/components/dashboard/RecentInvoices'
import { Invoice } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, client:clients(name)')
    .order('created_at', { ascending: false })

  const all = (invoices ?? []) as (Invoice & { client: { name: string } | null })[]

  const outstanding = all
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + Number(i.total), 0)

  const now = new Date()
  const paidThisMonth = all
    .filter(i => {
      if (i.status !== 'paid') return false
      const d = new Date(i.created_at)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, i) => s + Number(i.total), 0)

  const { count: clientCount } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true })

  const overdueCount = all.filter(i => i.status === 'overdue').length

  const stats = [
    { label: 'Outstanding', value: `$${outstanding.toFixed(2)}`, color: '#00D4FF' },
    { label: 'Paid this month', value: `$${paidThisMonth.toFixed(2)}`, color: '#10B981' },
    { label: 'Active clients', value: String(clientCount ?? 0), color: '#F0F4F8' },
    { label: 'Overdue', value: String(overdueCount), color: overdueCount > 0 ? '#F59E0B' : '#F0F4F8' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-cloud">Dashboard</h1>
      </div>
      <StatsBar stats={stats} />
      <RecentInvoices invoices={all.slice(0, 8)} />
    </div>
  )
}
