interface Stat { label: string; value: string; color?: string }

export function StatsBar({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-4 gap-3 mb-8">
      {stats.map(s => (
        <div key={s.label} className="bg-navy border border-wire rounded-sm p-4">
          <div className="font-mono text-lg font-medium" style={{ color: s.color ?? '#F0F4F8' }}>{s.value}</div>
          <div className="text-xs text-muted mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
