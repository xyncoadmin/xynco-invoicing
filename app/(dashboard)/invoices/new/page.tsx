import { createClient } from '@/lib/supabase/server'
import { InvoiceBuilderWrapper } from '@/components/invoices/InvoiceBuilderWrapper'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('*').order('name')
  return (
    <div>
      <h1 className="text-2xl font-bold text-cloud mb-6">New invoice</h1>
      <InvoiceBuilderWrapper clients={clients ?? []} />
    </div>
  )
}
