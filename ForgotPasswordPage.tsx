import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { z } from 'zod'
import { AuthLayout } from './AuthLayout'
import { Field } from '@/components/ui/Field'
import { Alert } from '@/components/ui/Alert'
import { Spinner } from '@/components/ui/Spinner'
import { ConfigMissing } from '@/components/ConfigMissing'
import { supabase, appUrl } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/env'
import { forgotSchema, friendlyAuthError } from '@/lib/validation'

type Values = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(forgotSchema) })

  const onSubmit = async ({ email }: Values) => {
    setFormError(null)
    if (!supabase) return
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: appUrl('/reset-password') })
    if (error) setFormError(friendlyAuthError(error.message))
    else setSent(true)
  }

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your account email and we will send a reset link."
      footer={<Link to="/login" className="text-cyanx hover:underline">Back to sign in</Link>}
    >
      {!isSupabaseConfigured && <div className="mb-4"><ConfigMissing /></div>}
      {sent ? (
        <Alert kind="success">If an account exists for that address, a reset link is on its way. The link expires, so use it soon.</Alert>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {formError && <Alert kind="error">{formError}</Alert>}
          <Field label="Email" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
          <button type="submit" className="btn-primary w-full" disabled={isSubmitting || !isSupabaseConfigured}>
            {isSubmitting && <Spinner />} Send reset link
          </button>
        </form>
      )}
    </AuthLayout>
  )
}
