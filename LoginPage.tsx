import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import type { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { Field, PasswordField } from '@/components/ui/Field'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ConfigMissing } from '@/components/ConfigMissing'
import { supabase, appUrl } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/env'
import { friendlyAuthError, makeLoginSchema } from '@/lib/validation'
import { UserPlus } from 'lucide-react'

const schema = makeLoginSchema()
type Values = z.infer<typeof schema>

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formError, setFormError] = useState<string | null>(null)
  const [unverified, setUnverified] = useState(false)
  const [resending, setResending] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = async (values: Values) => {
    setFormError(null)
    setUnverified(false)
    if (!supabase) return
    const { error } = await supabase.auth.signInWithPassword(values)
    if (error) {
      setUnverified(error.message.toLowerCase().includes('email not confirmed'))
      setFormError(friendlyAuthError(error.message))
      return
    }
    toast.success('Signed in')
    // The guard sends the user to the right dashboard for their role.
    navigate((location.state as { from?: string } | null)?.from ?? '/', { replace: true })
  }

  const resend = async () => {
    if (!supabase) return
    setResending(true)
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: getValues('email').trim(),
      options: { emailRedirectTo: appUrl('/login') },
    })
    setResending(false)
    if (error) toast.error(friendlyAuthError(error.message))
    else toast.success('Verification email sent. Check your inbox and spam folder.')
  }

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back. Continue documenting your engineering work."
      footer={
        <div className="flex flex-col gap-3">
          <p>New to the platform?</p>
          <Link to="/register" className="btn-secondary w-full border-amber-eng/60 text-amber-eng hover:bg-amber-eng/10">
            <UserPlus className="h-4 w-4" aria-hidden="true" /> Create Student Account
          </Link>
        </div>
      }
    >
      {!isSupabaseConfigured && <div className="mb-4"><ConfigMissing /></div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && (
          <Alert kind="error">
            <p>{formError}</p>
            {unverified && (
              <button type="button" onClick={resend} disabled={resending} className="mt-1.5 text-xs font-semibold underline underline-offset-2">
                {resending ? 'Sending…' : 'Resend verification email'}
              </button>
            )}
          </Alert>
        )}
        <Field label="Email" type="email" autoComplete="email" inputMode="email" placeholder="you@kletech.ac.in" error={errors.email?.message} {...register('email')} />
        <PasswordField label="Password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-cyanx hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting && <Spinner />} {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </AuthLayout>
  )
}
