import { createClient } from '@/lib/supabase/server'

export async function generateInvoiceNumber(): Promise<string> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('increment_invoice_counter')
  if (error) throw error
  return `INV-${String(data).padStart(3, '0')}`
}
