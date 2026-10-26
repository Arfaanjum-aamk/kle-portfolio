import type { ReactNode } from 'react'
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const styles = {
  error: { box: 'border-red-400/40 bg-red-500/10 text-red-100', Icon: AlertTriangle },
  success: { box: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100', Icon: CheckCircle2 },
  info: { box: 'border-cyanx/40 bg-cyanx/10 text-sky-100', Icon: Info },
} as const

export function Alert({ kind, children }: { kind: keyof typeof styles; children: ReactNode }) {
  const { box, Icon } = styles[kind]
  return (
    <div role={kind === 'error' ? 'alert' : 'status'} className={`flex gap-2.5 rounded-lg border px-3.5 py-3 text-sm ${box}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}
