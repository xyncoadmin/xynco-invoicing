import { cn } from '@/lib/utils'

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('bg-navy border border-wire rounded-sm p-6', className)}>
      {children}
    </div>
  )
}
