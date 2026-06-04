'use client'
import { useState } from 'react'
import { ManualPaymentInstructions } from './ManualPaymentInstructions'

type Tab = 'card' | 'paypal' | 'crypto' | 'etransfer' | 'direct_deposit' | 'venmo'
const TABS: { key: Tab; label: string }[] = [
  { key: 'card', label: 'Card' },
  { key: 'paypal', label: 'PayPal' },
  { key: 'crypto', label: 'Crypto' },
  { key: 'etransfer', label: 'E-Transfer' },
  { key: 'direct_deposit', label: 'Direct Deposit' },
  { key: 'venmo', label: 'Venmo' },
]

interface Props {
  invoiceId: string
  amount: number
  currency: string
  stripePublishableKey?: string
}

export function PaymentTabs({ invoiceId, amount, currency }: Props) {
  const [active, setActive] = useState<Tab>('card')

  return (
    <div className="bg-white border border-gray-200 rounded-sm overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="px-4 pt-4 pb-0 border-b border-gray-100">
        <div className="font-semibold text-xs mb-3" style={{ color: '#0A0F1E' }}>Choose payment method</div>
        <div className="flex gap-1.5 flex-wrap pb-0">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActive(tab.key)}
              className="px-3 py-1.5 rounded-sm text-xs font-medium transition-colors mb-3"
              style={active === tab.key
                ? { background: '#0A0F1E', color: '#fff', border: '1px solid #0A0F1E' }
                : { background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {active === 'card' && (
          <div className="text-sm text-center py-4" style={{ color: '#9CA3AF' }}>
            Card payment powered by Stripe — loads after Stripe is configured (Task 12).
          </div>
        )}
        {active === 'paypal' && (
          <div className="text-sm text-center py-4" style={{ color: '#9CA3AF' }}>
            PayPal — loads after PayPal is configured (Task 13).
          </div>
        )}
        {active === 'crypto' && (
          <div className="text-sm text-center py-4" style={{ color: '#9CA3AF' }}>
            Crypto via Coinbase Commerce — loads after configured (Task 14).
          </div>
        )}
        {(active === 'etransfer' || active === 'direct_deposit' || active === 'venmo') && (
          <ManualPaymentInstructions
            method={active}
            invoiceId={invoiceId}
            amount={amount}
            currency={currency}
          />
        )}
      </div>
    </div>
  )
}
