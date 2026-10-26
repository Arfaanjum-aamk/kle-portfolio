import type { ReactNode } from 'react'
import { LogOut } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { useAuth } from '@/auth/AuthProvider'

/** Shared signed-in frame. Dashboard contents arrive in later phases; nothing here is fabricated data. */
export function DashboardShell({ roleLabel, children }: { roleLabel: string; children: ReactNode }) {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen bg-ink-950">
      <header className="flex items-center justify-between border-b border-ink-700 px-5 py-3">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="font-display font-semibold text-white">Engineering Portfolio Studio</span>
          <span className="hidden rounded bg-ink-800 px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-amber-eng sm:inline">{roleLabel}</span>
        </div>
        <button className="btn-ghost" onClick={() => void signOut()}>
          <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
        </button>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="font-display text-2xl font-semibold text-white">Welcome, {profile?.full_name ?? 'there'}</h1>
        {children}
      </main>
    </div>
  )
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="mt-6 rounded-xl border border-dashed border-ink-700 bg-ink-900/50 p-8 text-center">
      <p className="font-display text-lg text-white">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-steel-300">{body}</p>
    </div>
  )
}
