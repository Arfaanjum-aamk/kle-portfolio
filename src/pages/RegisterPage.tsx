import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { MailCheck } from 'lucide-react'
import { AuthLayout } from './AuthLayout'
import { Field, PasswordField } from '@/components/ui/Field'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ConfigMissing } from '@/components/ConfigMissing'
import { supabase, appUrl } from '@/lib/supabase'
import { env, isSupabaseConfigured } from '@/lib/env'
import { friendlyAuthError, makeRegisterSchema } from '@/lib/validation'

export default function RegisterPage() {
  const schema = useMemo(() => makeRegisterSchema(env.allowedEmailDomains), [])
  type Values = z.infer<typeof schema>
  const [formError, setFormError] = useState<string | null>(null)
  const [sentTo, setSentTo] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(schema) })

  const onSubmit = async (v: Values) => {
    setFormError(null)
    if (!supabase) return

    // Friendly pre-check; the database unique constraint is the real guarantee.
    const { data: available, error: rpcError } = await supabase.rpc('username_available', { candidate: v.username })
    if (!rpcError && available === false) {
      setError('username', { message: 'That username is already taken.' })
      return
    }

    // Note: no role is sent. New accounts are always students; the database trigger enforces this.
    const { error } = await supabase.auth.signUp({
      email: v.email.trim(),
      password: v.password,
      options: {
        emailRedirectTo: appUrl('/login'),
        data: { full_name: v.fullName, username: v.username, usn: v.usn || null, academic_year: v.academicYear || null },
      },
    })
    if (error) {
      setFormError(friendlyAuthError(error.message))
      return
    }
    setSentTo(v.email.trim())
  }

  if (sentTo) {
    return (
      <AuthLayout title="Check your email" footer={<Link to="/login" className="text-cyanx hover:underline">Back to sign in</Link>}>
        <Alert kind="success">
          <div className="flex items-start gap-2">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p>
              If this address can be registered, a verification link has been sent to <strong>{sentTo}</strong>. Open it to activate your account, then sign in.
            </p>
          </div>
        </Alert>
        <p className="mt-4 text-xs text-steel-500">Nothing arrived? Check spam, then try signing in and use “Resend verification email”.</p>
      </AuthLayout>
    )
  }

  const domainHint = env.allowedEmailDomains.length ? `Use your ${env.allowedEmailDomains.map((d) => '@' + d).join(' / ')} email.` : undefined

  return (
    <AuthLayout
      title="Create student account"
      subtitle="Your portfolio starts here. Faculty accounts are issued by the department, not through this form."
      footer={<p>Already registered? <Link to="/login" className="font-semibold text-cyanx hover:underline">Sign in</Link></p>}
    >
      {!isSupabaseConfigured && <div className="mb-4"><ConfigMissing /></div>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {formError && <Alert kind="error">{formError}</Alert>}
        <Field label="Full name" autoComplete="name" error={errors.fullName?.message} {...register('fullName')} />
        <Field
          label="Username"
          autoComplete="username"
          autoCapitalize="none"
          hint="Used in your public portfolio link: /student/username"
          error={errors.username?.message}
          {...register('username')}
        />
        <Field label="Email" type="email" autoComplete="email" inputMode="email" hint={domainHint} error={errors.email?.message} {...register('email')} />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="USN (optional)" error={errors.usn?.message} {...register('usn')} />
          <Field label="Year (optional)" placeholder="e.g. 2024–25" error={errors.academicYear?.message} {...register('academicYear')} />
        </div>
        <PasswordField label="Password" autoComplete="new-password" hint="10+ characters with upper, lower case and a number." error={errors.password?.message} {...register('password')} />
        <PasswordField label="Confirm password" autoComplete="new-password" error={errors.confirmPassword?.message} {...register('confirmPassword')} />
        <button type="submit" className="btn-primary w-full" disabled={isSubmitting || !isSupabaseConfigured}>
          {isSubmitting && <Spinner />} {isSubmitting ? 'Creating account…' : 'Create account'}
        </button>
      </form>
    </AuthLayout>
  )
}
