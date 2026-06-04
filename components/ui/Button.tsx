import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary:   'bg-cyan text-abyss hover:bg-cyan-dim',
  secondary: 'bg-transparent text-cyan border border-wire hover:border-cyan',
  ghost:     'bg-transparent text-steel border border-wire hover:text-cloud',
  danger:    'bg-transparent text-error border border-error/30 hover:bg-error/10',
}

export function Button({ variant = 'primary', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-md transition-colors duration-150 disabled:opacity-50',
        variants[variant], className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
