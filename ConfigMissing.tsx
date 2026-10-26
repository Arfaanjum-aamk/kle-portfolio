import { Alert } from '@/components/ui/Alert'

export function ConfigMissing() {
  return (
    <Alert kind="error">
      <p className="font-semibold">Supabase is not configured.</p>
      <p className="mt-1 text-xs opacity-90">
        Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env</code> and set{' '}
        <code className="font-mono">VITE_SUPABASE_URL</code> and <code className="font-mono">VITE_SUPABASE_PUBLISHABLE_KEY</code>.
        See the README, section 2.
      </p>
    </Alert>
  )
}
