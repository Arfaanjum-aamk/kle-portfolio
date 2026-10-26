import { Loader2 } from 'lucide-react'

export function Spinner({ className = 'h-4 w-4' }: { className?: string }) {
  return <Loader2 className={`animate-spin ${className}`} aria-hidden="true" />
}

export function FullPageSpinner({ label }: { label: string }) {
  return (
    <div role="status" className="flex h-full min-h-screen flex-col items-center justify-center gap-3 text-steel-300">
      <Spinner className="h-6 w-6" />
      <p className="text-sm">{label}</p>
    </div>
  )
}
