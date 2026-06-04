'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function SendInvoiceButton({ invoiceId }: { invoiceId: string }) {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSend() {
    setSending(true)
    const res = await fetch(`/api/invoices/${invoiceId}/send`, { method: 'POST' })
    if (res.ok) setSent(true)
    setSending(false)
  }

  return (
    <Button onClick={handleSend} disabled={sending || sent}>
      {sent ? '✓ Sent' : sending ? 'Sending…' : 'Send invoice'}
    </Button>
  )
}
