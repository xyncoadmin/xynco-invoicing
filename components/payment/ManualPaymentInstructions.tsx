'use client'
import { useState } from 'react'

interface Props {
  method: 'etransfer' | 'direct_deposit' | 'venmo'
  invoiceId: string
  amount: number
  currency: string
}

const INSTRUCTIONS = {
  etransfer: {
    title: 'E-Transfer Instructions',
    steps: [
      'Log into your online banking',
      'Send an Interac e-Transfer to sam@xynco.io',
      'Use your invoice number as the message/reference',
      'No security question needed — auto-deposit is enabled',
    ],
  },
  direct_deposit: {
    title: 'Direct Deposit / Wire',
    steps: [
      'Contact us at sam@xynco.io for banking details',
      'Include your invoice number as the reference',
    ],
  },
  venmo: {
    title: 'Venmo',
    steps: [
      'Open Venmo and search @xynco-business',
      'Enter the amount and include your invoice number',
      'Send payment',
    ],
  },
}

export function ManualPaymentInstructions({ method, invoiceId, amount, currency }: Props) {
  const info = INSTRUCTIONS[method]
  const [submitted, setSubmitted] = useState(false)

  async function handleIPaid() {
    await fetch('/api/payments/confirm-manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ invoiceId, method }),
    })
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-4">
        <div className="text-sm font-semibold" style={{ color: '#10B981' }}>✓ Thanks! We&apos;ll confirm your payment shortly.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="font-semibold text-sm" style={{ color: '#0A0F1E' }}>{info.title}</div>
      <ol className="flex flex-col gap-2 list-none p-0 m-0">
        {info.steps.map((step, i) => (
          <li key={i} className="text-sm flex gap-2" style={{ color: '#374151' }}>
            <span className="font-mono text-xs mt-0.5 flex-shrink-0" style={{ color: '#9CA3AF' }}>{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="text-xs font-mono p-3 rounded-sm" style={{ background: '#F9FAFB', color: '#6B7280' }}>
        Amount: ${amount.toFixed(2)} {currency} · Ref: {invoiceId.slice(0, 8).toUpperCase()}
      </div>
      <button
        onClick={handleIPaid}
        className="w-full py-2.5 text-sm font-semibold rounded-md transition-colors"
        style={{ background: '#0A0F1E', color: '#fff' }}
      >
        I&apos;ve sent the payment
      </button>
    </div>
  )
}
