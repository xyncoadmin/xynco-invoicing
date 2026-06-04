import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-abyss">
      <Sidebar />
      <main className="pl-14 min-h-screen">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
