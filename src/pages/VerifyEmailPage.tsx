import { Link } from 'react-router-dom'
import { useState } from 'react'
import { toast } from 'sonner'
import { AuthLayout } from './AuthLayout'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/auth/AuthProvider'
import { supabase, appUrl } from '@/lib/supabase'
import { friendlyAuthError } from '@/lib/validation'

export default function VerifyEmailPage() {
  const { user, signOut } = useAuth()
  const [busy, setBusy] = useState(false)

  const resend = async () => {
    if (!supabase || !user?.email) return
    setBusy(true)
    const { error } = await supabase.auth.resend({ type: 'signup', email: user.email, options: { emailRedirectTo: appUrl('/login') } })
    setBusy(false)
    if (error) toast.error(friendlyAuthError(error.message))
    else toast.success('Verification email sent.')
  }

  return (
    <AuthLayout title="Verify your email" footer={<Link to="/login" onClick={() => void signOut()} className="text-cyanx hover:underline">Sign out</Link>}>
      <Alert kind="info">Your email address has not been verified yet. Open the link we sent to {user?.email ?? 'your inbox'} to continue.</Alert>
      {user?.email && (
        <button type="button" className="btn-secondary mt-4 w-full" onClick={resend} disabled={busy}>
          {busy && <Spinner />} Resend verification email
        </button>
      )}
    </AuthLayout>
  )
}
