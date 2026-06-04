import Link from 'next/link'
import { StatusBadge } from '@/components/ui/Badge'
import { Invoice } from '@/types'

interface Props {
  invoices: (Invoice & { client: { name: string } | null })[]
}

export function RecentInvoices({ invoices }: Props) {
  return (
    <div className="bg-navy border border-wire rounded-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-wire flex justify-between items-center">
        <span className="text-sm font-semibold text-cloud">Recent invoices</span>
        <Link href="/invoices/new" className="bg-cyan text-abyss text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-cyan-dim transition-colors">
          + New
        </Link>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {invoices.map(inv => (
            <tr key={inv.id} className="border-b border-wire hover:bg-slate/30 transition-colors">
              <td className="px-4 py-3">
                <Link href={`/invoices/${inv.id}`} className="font-mono text-cyan hover:text-cyan-dim">{inv.number}</Link>
              </td>
              <td className="px-4 py-3 text-steel text-xs">{inv.client?.name ?? '—'}</td>
              <td className="px-4 py-3 font-mono text-cloud">${Number(inv.total).toFixed(2)}</td>
              <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
      {invoices.length === 0 && (
        <div className="px-4 py-6 text-center text-steel text-sm">No invoices yet.</div>
      )}
    </div>
  )
}
