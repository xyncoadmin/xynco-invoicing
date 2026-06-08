import { Resend } from 'resend'
import { render } from '@react-email/render'
import { InvoiceEmail } from '@/emails/InvoiceEmail'

interface SendInvoiceEmailParams {
  to: string
  invoiceNumber: string
  clientName: string
  total: string
  currency: string
  dueDate: string
  payUrl: string
  items: { description: string; quantity: number; rate: number; subtotal: number }[]
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not set — email not sent')
    return
  }
  const resend = new Resend(process.env.RESEND_API_KEY)
  const html = await render(InvoiceEmail(params))
  return resend.emails.send({
    from: process.env.EMAIL_FROM!,
    to: params.to,
    subject: `Invoice ${params.invoiceNumber} from xynco — ${params.total} ${params.currency} due ${params.dueDate}`,
    html,
  })
}
