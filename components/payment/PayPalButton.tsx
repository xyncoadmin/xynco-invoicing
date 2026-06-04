'use client'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import { useRouter } from 'next/navigation'

export function PayPalButton({ invoiceId, currency }: { invoiceId: string; currency: string }) {
  const router = useRouter()

  return (
    <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!, currency }}>
      <PayPalButtons
        style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay' }}
        createOrder={async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ invoiceId }),
          })
          const data = await res.json()
          return data.id
        }}
        onApprove={async (data) => {
          await fetch('/api/paypal/capture-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: data.orderID, invoiceId }),
          })
          router.push(`/pay/${invoiceId}/success`)
        }}
      />
    </PayPalScriptProvider>
  )
}
