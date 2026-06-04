import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { StatusBadge } from '@/components/ui/Badge'
import { SendInvoiceButton } from '@/components/invoices/SendInvoiceButton'
import Link from 'next/link'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*)')
    .eq('id', id)
    .single()
  if (!invoice) notFound()

  const client = invoice.client as { name: string; email: string; address: string | null; currency: string }
  const items = (invoice.items ?? []) as { id: string; description: string; quantity: number; rate: number; subtotal: number }[]
  const payUrl = `${process.env.NEXT_PUBLIC_APP_URL}/pay/${invoice.id}`

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-cloud font-mono">{invoice.number}</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-steel text-sm">{client?.name}</p>
            <StatusBadge status={invoice.status} />
          </div>
        </div>
        <div className="flex gap-3">
          {invoice.status === 'draft' && <SendInvoiceButton invoiceId={invoice.id} />}
          <a href={payUrl} target="_blank" rel="noopener noreferrer">
            <button className="bg-transparent text-steel border border-wire rounded-md px-4 py-2 text-sm hover:text-cloud transition-colors">
              View payment page ↗
            </button>
          </a>
        </div>
      </div>

      {/* White invoice preview */}
      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-start mb-1">
          <div>
            <div className="text-xl font-extrabold tracking-tight" style={{ color: '#0A0F1E', letterSpacing: '-0.04em' }}>
              <span style={{ color: '#0099BB' }}>x</span>ynco
            </div>
            <div className="text-xs font-mono uppercase tracking-widest mt-0.5" style={{ color: '#9CA3AF' }}>AI Consulting</div>
          </div>
          <div className="text-right">
            <div className="font-mono font-medium text-base" style={{ color: '#0A0F1E' }}>{invoice.number}</div>
            <div className="text-xs mt-1" style={{ color: '#6B7280' }}>Issued {invoice.issue_date}</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>Due {invoice.due_date}</div>
          </div>
        </div>
        <div className="h-0.5 mb-6" style={{ background: '#00D4FF' }} />

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Bill To</div>
            <div className="font-semibold text-sm" style={{ color: '#0A0F1E' }}>{client?.name}</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{client?.email}</div>
            {client?.address && <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>{client.address}</div>}
          </div>
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>From</div>
            <div className="font-semibold text-sm" style={{ color: '#0A0F1E' }}>xynco</div>
            <div className="text-xs mt-0.5" style={{ color: '#6B7280' }}>sam@xynco.io</div>
          </div>
        </div>

        <table className="w-full text-sm mb-4" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              {['Description','Qty','Rate','Total'].map(h => (
                <th key={h} className="text-left px-3 py-2 text-xs font-mono uppercase tracking-wider" style={{ color: '#9CA3AF' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                <td className="px-3 py-2.5 text-sm" style={{ color: '#374151' }}>{item.description}</td>
                <td className="px-3 py-2.5 font-mono text-xs" style={{ color: '#6B7280' }}>{item.quantity}</td>
                <td className="px-3 py-2.5 font-mono text-xs" style={{ color: '#6B7280' }}>${Number(item.rate).toFixed(2)}</td>
                <td className="px-3 py-2.5 font-mono text-sm" style={{ color: '#0A0F1E' }}>${Number(item.subtotal).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-48 flex flex-col gap-1.5">
            <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
              <span>Subtotal</span><span className="font-mono">${Number(invoice.subtotal).toFixed(2)}</span>
            </div>
            {Number(invoice.tax_rate) > 0 && (
              <div className="flex justify-between text-xs" style={{ color: '#6B7280' }}>
                <span>Tax ({(Number(invoice.tax_rate) * 100).toFixed(0)}%)</span>
                <span className="font-mono">${Number(invoice.tax_amount).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-sm pt-1.5" style={{ borderTop: '1px solid #E5E7EB' }}>
              <span style={{ color: '#0A0F1E' }}>Total</span>
              <span className="font-mono" style={{ color: '#0099BB' }}>${Number(invoice.total).toFixed(2)} {client?.currency}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid #F3F4F6' }}>
            <div className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: '#9CA3AF' }}>Notes</div>
            <div className="text-xs" style={{ color: '#6B7280' }}>{invoice.notes}</div>
          </div>
        )}
      </div>
    </div>
  )
}
