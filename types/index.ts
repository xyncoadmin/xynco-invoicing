export type Currency = 'CAD' | 'USD'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'void'
export type PaymentMethod = 'card' | 'paypal' | 'crypto' | 'etransfer' | 'direct_deposit' | 'venmo'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed'
export type SubscriptionInterval = 'weekly' | 'monthly' | 'quarterly' | 'annual'
export type SubscriptionStatus = 'active' | 'paused' | 'cancelled'

export interface Client {
  id: string
  name: string
  email: string
  address: string | null
  currency: Currency
  payment_terms: number
  created_at: string
}

export interface InvoiceItem {
  id: string
  invoice_id: string
  description: string
  quantity: number
  rate: number
  /** Derived: quantity * rate. Stored in DB for query performance. Do not set manually. */
  subtotal: number
}

export interface Invoice {
  id: string
  client_id: string
  number: string
  status: InvoiceStatus
  issue_date: string
  due_date: string
  /** Sum of all line item subtotals. */
  subtotal: number
  tax_rate: number
  /** Derived: subtotal * tax_rate. */
  tax_amount: number
  total: number
  notes: string | null
  stripe_invoice_id: string | null
  created_at: string
  client?: Client
  items?: InvoiceItem[]
}

export interface Subscription {
  id: string
  client_id: string
  stripe_subscription_id: string
  amount: number
  currency: Currency
  interval: SubscriptionInterval
  status: SubscriptionStatus
  next_billing_date: string
  client?: Client
  created_at: string
}

export interface Payment {
  id: string
  invoice_id: string
  method: PaymentMethod
  amount: number
  currency: Currency
  status: PaymentStatus
  confirmed_at: string | null
  stripe_payment_intent_id: string | null
  created_at: string
}
