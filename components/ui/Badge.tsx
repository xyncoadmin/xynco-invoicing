import { cn } from '@/lib/utils'
import { InvoiceStatus } from '@/types'

const statusStyles: Record<InvoiceStatus, string> = {
  draft:    'bg-steel/10 text-steel border-steel/20',
  sent:     'bg-cyan/10 text-cyan border-cyan/20',
  paid:     'bg-success/10 text-success border-success/20',
  overdue:  'bg-amber/10 text-amber border-amber/20',
  void:     'bg-muted/10 text-muted border-muted/20',
}

const labels: Record<InvoiceStatus, string> = {
  draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue', void: 'Void'
}

export function StatusBadge({ status }: { status: InvoiceStatus }) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-pill text-xs font-mono font-medium border',
      statusStyles[status]
    )}>
      {labels[status]}
    </span>
  )
}
