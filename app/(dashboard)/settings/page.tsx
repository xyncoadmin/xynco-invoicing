'use client'
import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [venmoHandle, setVenmoHandle] = useState('@xynco-business')
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [transitNumber, setTransitNumber] = useState('')
  const [institutionNumber, setInstitutionNumber] = useState('')
  const [etransferEmail, setEtransferEmail] = useState('sam@xynco.io')
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="max-w-lg flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-cloud">Settings</h1>

      <Card>
        <div className="font-mono text-xs uppercase tracking-widest text-steel mb-4">E-Transfer</div>
        <Input label="E-Transfer email" value={etransferEmail} onChange={e => setEtransferEmail(e.target.value)} />
      </Card>

      <Card>
        <div className="font-mono text-xs uppercase tracking-widest text-steel mb-4">Direct Deposit / Wire</div>
        <div className="flex flex-col gap-3">
          <Input label="Bank name" value={bankName} onChange={e => setBankName(e.target.value)} placeholder="e.g. TD Bank" />
          <Input label="Account number" value={accountNumber} onChange={e => setAccountNumber(e.target.value)} />
          <Input label="Transit number" value={transitNumber} onChange={e => setTransitNumber(e.target.value)} />
          <Input label="Institution number" value={institutionNumber} onChange={e => setInstitutionNumber(e.target.value)} />
        </div>
      </Card>

      <Card>
        <div className="font-mono text-xs uppercase tracking-widest text-steel mb-4">Venmo</div>
        <Input label="Venmo Business handle" value={venmoHandle} onChange={e => setVenmoHandle(e.target.value)} hint="Must be a Venmo Business profile" />
      </Card>

      <div className="pt-2">
        <Button variant="danger" onClick={handleSignOut}>Sign out</Button>
      </div>
    </div>
  )
}
