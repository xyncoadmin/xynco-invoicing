'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Client } from '@/types'
import { calcInvoiceTotals, calcItemSubtotal } from '@/lib/invoice-calc'
import { addDays, format } from 'date-fns'

interface LineItem { description: string; quantity: number; rate: number }

interface InvoiceBuilderProps {
  clients: Client[]
  onSubmit: (data: Record<string, unknown>) => Promise<void>
}

export function InvoiceBuilder({ clients, onSubmit }: InvoiceBuilderProps) {
  const [clientId, setClientId] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, rate: 0 }])
  const [taxRate, setTaxRate] = useState(0)
  const [issueDate, setIssueDate] = useState(format(new Date(), 'yyyy-MM-dd'))
  const [dueDate, setDueDate] = useState(format(addDays(new Date(), 14), 'yyyy-MM-dd'))
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedClient = clients.find(c => c.id === clientId)
  const processedItems = items.map(i => ({ ...i, subtotal: calcItemSubtotal(i.quantity, i.rate) }))
  const totals = calcInvoiceTotals(processedItems, taxRate)

  function addItem() { setItems([...items, { description: '', quantity: 1, rate: 0 }]) }
  function removeItem(i: number) { setItems(items.filter((_, idx) => idx !== i)) }
  function updateItem(i: number, field: keyof LineItem, value: string | number) {
    setItems(items.map((item, idx) => idx === i ? { ...item, [field]: value } : item))
  }

  function handleClientChange(id: string) {
    setClientId(id)
    const client = clients.find(c => c.id === id)
    if (client) setDueDate(format(addDays(new Date(issueDate), client.payment_terms), 'yyyy-MM-dd'))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await onSubmit({ client_id: clientId, items: processedItems, tax_rate: taxRate, issue_date: issueDate, due_date: dueDate, notes })
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6">
      <div className="col-span-2 flex flex-col gap-6">
        <div className="bg-navy border border-wire rounded-sm p-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="client-select" className="text-xs text-steel font-medium">Client</label>
            <select
              id="client-select"
              required value={clientId} onChange={e => handleClientChange(e.target.value)}
              className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan"
            >
              <option value="">Select client…</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Issue date" type="date" value={issueDate} onChange={e => setIssueDate(e.target.value)} />
            <Input label="Due date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <Input label="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Project reference, PO number…" />
        </div>

        <div className="bg-navy border border-wire rounded-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-wire grid grid-cols-12 gap-2 text-xs font-mono uppercase tracking-widest text-steel">
            <div className="col-span-6">Description</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Rate</div>
            <div className="col-span-2">Subtotal</div>
          </div>
          {items.map((item, i) => (
            <div key={i} className="px-4 py-3 border-b border-wire grid grid-cols-12 gap-2 items-center">
              <input
                className="col-span-6 bg-abyss border border-wire rounded-sm px-2 py-1.5 text-sm text-cloud outline-none focus:border-cyan"
                value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                placeholder="e.g. Website development"
              />
              <input
                type="number" min="0" step="0.01"
                className="col-span-2 bg-abyss border border-wire rounded-sm px-2 py-1.5 text-sm text-cloud outline-none focus:border-cyan font-mono"
                value={item.quantity} onChange={e => updateItem(i, 'quantity', parseFloat(e.target.value) || 0)}
              />
              <input
                type="number" min="0" step="0.01"
                className="col-span-2 bg-abyss border border-wire rounded-sm px-2 py-1.5 text-sm text-cloud outline-none focus:border-cyan font-mono"
                value={item.rate} onChange={e => updateItem(i, 'rate', parseFloat(e.target.value) || 0)}
              />
              <div className="col-span-1 font-mono text-sm text-cloud">${calcItemSubtotal(item.quantity, item.rate).toFixed(2)}</div>
              <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-muted hover:text-error text-lg leading-none">×</button>
            </div>
          ))}
          <div className="px-4 py-3">
            <button type="button" onClick={addItem} className="text-xs text-cyan hover:text-cyan-dim font-medium">+ Add line item</button>
          </div>
        </div>

        <div className="bg-navy border border-wire rounded-sm p-6">
          <div className="flex justify-end">
            <div className="w-64 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-steel">Subtotal</span>
                <span className="font-mono text-cloud">${totals.subtotal.toFixed(2)} {selectedClient?.currency ?? 'CAD'}</span>
              </div>
              <div className="flex justify-between items-center text-sm gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-steel">Tax</span>
                  <select
                    value={taxRate}
                    onChange={e => setTaxRate(parseFloat(e.target.value))}
                    className="bg-abyss border border-wire rounded-sm px-1.5 py-0.5 text-xs text-cloud outline-none focus:border-cyan"
                  >
                    <option value={0}>None</option>
                    <option value={0.05}>5% GST</option>
                    <option value={0.13}>13% HST (ON)</option>
                    <option value={0.15}>15% HST (NS/NB/PEI/NL)</option>
                  </select>
                </div>
                <span className="font-mono text-cloud">${totals.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-wire pt-2 flex justify-between font-semibold">
                <span className="text-cloud">Total</span>
                <span className="font-mono text-cyan-light text-lg">${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <Button type="submit" disabled={loading || !clientId}>{loading ? 'Creating…' : 'Create invoice'}</Button>
      </div>

      <div className="bg-navy border border-wire rounded-sm p-4 text-sm text-steel h-fit">
        <div className="font-mono text-xs uppercase tracking-widest text-steel mb-3">Client</div>
        {selectedClient ? (
          <div className="flex flex-col gap-1">
            <div className="text-cloud font-medium">{selectedClient.name}</div>
            <div className="text-steel">{selectedClient.email}</div>
            <div className="font-mono text-xs text-muted mt-2">{selectedClient.currency} · Net {selectedClient.payment_terms}</div>
          </div>
        ) : <div className="text-muted text-xs">Select a client to see details</div>}
      </div>
    </form>
  )
}
