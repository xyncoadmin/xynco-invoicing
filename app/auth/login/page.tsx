'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false); return }
    router.refresh()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-abyss flex items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-3xl font-extrabold tracking-tight text-cloud mb-1">
            <span className="text-cyan-light">x</span>ynco
          </div>
          <div className="text-sm text-steel font-mono uppercase tracking-widest">Invoicing</div>
        </div>
        <form onSubmit={handleLogin} className="bg-navy border border-wire rounded-sm p-8 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-xs text-steel font-medium">Email</label>
            <input
              id="email"
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan transition-colors"
              placeholder="you@xynco.io"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-xs text-steel font-medium">Password</label>
            <input
              id="password"
              type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className="bg-abyss border border-wire rounded-sm px-3 py-2 text-sm text-cloud outline-none focus:border-cyan transition-colors"
            />
          </div>
          {error && <p className="text-xs text-error">{error}</p>}
          <button
            type="submit" disabled={loading}
            className="bg-cyan text-abyss font-semibold text-sm py-2 rounded-md hover:bg-cyan-dim transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
