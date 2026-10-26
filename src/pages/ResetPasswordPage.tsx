import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { PasswordField } from '@/components/ui/Field'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { useAuth } from '@/auth/AuthProvider'
import { supabase } from '@/lib/supabase'
import { friendlyAuthError, resetSchema } from '@/lib/validation'

type Values = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const { recovering, session, loading } = useAuth()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(resetSchema) })

  const onSubmit = async ({ password }: Values) => {
    setFormError(null)
    if (!supabase) return
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setFormError(friendlyAuthError(error.message))
      return
    }
    toast.success('Password updated. Please sign in with your new password.')
    await supabase.auth.signOut()
    navigate('/login', { replace: true })
  }

  const canReset = recovering || Boolean(session)

  return (
    <AuthLayout title="Choose a new password" footer={<Link to="/login" className="text-cyanx hover:underline">Back to sign in</Link>}>
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-steel-300"><Spinner /> Verifying your link…</p>
      ) : !canReset ? (
        <Alert kind="error">
          This reset link is invalid or has expired. <Link to="/forgot-password" className="underline">Request a new one</Link>.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {formError && <Alert kind="error">{formError}</Alert>}
          <PasswordField label="New password" autoComplete="new-password" hint="10+ characters with upper, lower case and a number." error={errors.password?.message} {...register('password')} />
          <PasswordField label="Confirm new password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
            {isSubmitting && <Spinner />} Update password
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
