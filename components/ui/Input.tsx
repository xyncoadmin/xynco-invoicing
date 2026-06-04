import { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
}

export function Input({ label, hint, error, className, id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label htmlFor={inputId} className="text-xs text-steel font-medium">{label}</label>}
      <input
        id={inputId}
        className={cn(
          'bg-abyss border rounded-sm px-3 py-2 text-sm text-cloud outline-none transition-colors',
          error ? 'border-error focus:border-error' : 'border-wire focus:border-cyan',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-error">{error}</span>}
      {hint && !error && <span className="text-xs text-muted">{hint}</span>}
    </div>
  )
}
