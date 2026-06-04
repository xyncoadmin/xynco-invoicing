'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/',              label: 'Dashboard',    icon: '▪' },
  { href: '/invoices',      label: 'Invoices',      icon: '◈' },
  { href: '/clients',       label: 'Clients',       icon: '◉' },
  { href: '/subscriptions', label: 'Subscriptions', icon: '↻' },
  { href: '/settings',      label: 'Settings',      icon: '⚙' },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="fixed left-0 top-0 h-full w-14 bg-navy border-r border-wire flex flex-col items-center py-4 gap-1 z-50">
      <div className="mb-4 w-8 h-8 bg-cyan rounded-full flex items-center justify-center">
        <div className="w-3.5 h-3.5 bg-abyss rounded-full" />
      </div>
      <div className="w-8 h-px bg-wire mb-2" />
      {navItems.map(item => {
        const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
        return (
          <Link
            key={item.href}
            href={item.href}
            title={item.label}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-sm text-lg transition-colors duration-150',
              active ? 'text-cyan bg-cyan/10' : 'text-muted hover:text-steel'
            )}
          >
            {item.icon}
          </Link>
        )
      })}
    </aside>
  )
}
