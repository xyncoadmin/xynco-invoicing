import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PaymentTabs } from '@/components/payment/PaymentTabs'

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, client:clients(*), items:invoice_items(*)')
    .eq('id', id)
    .single()

  if (!invoice || invoice.status === 'void') notFound()

  const client = invoice.client as { name: string; currency: string }

  if (invoice.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F7F9FC', fontFamily: 'Inter, sans-serif' }}>
        <div className="text-center">
          <div className="text-3xl font-extrabold tracking-tight mb-2" style={{ color: '#0A0F1E', letterSpacing: '-0.04em' }}>
            <span style={{ color: '#0099BB' }}>x</span>ynco
          </div>
          <div className="text-lg font-semibold mt-4" style={{ color: '#10B981' }}>✓ Invoice already paid</div>
          <div className="text-sm mt-2" style={{ color: '#6B7280' }}>{invoice.number}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: '#F7F9FC', fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-2xl font-extrabold tracking-tight mb-1" style={{ color: '#0A0F1E', letterSpacing: '-0.04em' }}>
            <span style={{ color: '#0099BB' }}>x</span>ynco
          </div>
          <div className="text-sm" style={{ color: '#6B7280' }}>{invoice.number} · {client.name}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-sm p-5 mb-4 flex justify-between items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: '#9CA3AF' }}>Amount Due</div>
            <div className="text-2xl font-bold font-mono" style={{ color: '#0099BB' }}>${Number(invoice.total).toFixed(2)} {client.currency}</div>
          </div>
          <div className="text-right">
            <div className="text-xs" style={{ color: '#6B7280' }}>Due {invoice.due_date}</div>
            <div className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-mono" style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.2)' }}>
              Pending
            </div>
          </div>
        </div>

        <PaymentTabs
          invoiceId={invoice.id}
          amount={Number(invoice.total)}
          currency={client.currency}
        />

        <div className="text-center mt-4 text-xs font-mono" style={{ color: '#9CA3AF' }}>
          🔒 Secured by Stripe · PCI-DSS Level 1
        </div>
      </div>
    </div>
  )
}
