import { z } from 'zod'

export function emailDomainAllowed(email: string, allowed: string[]): boolean {
  if (allowed.length === 0) return true
  const domain = email.trim().toLowerCase().split('@')[1]
  return Boolean(domain) && allowed.includes(domain)
}

export const passwordSchema = z
  .string()
  .min(10, 'Use at least 10 characters.')
  .regex(/[a-z]/, 'Include a lowercase letter.')
  .regex(/[A-Z]/, 'Include an uppercase letter.')
  .regex(/[0-9]/, 'Include a number.')

export const usernameSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, 'Use at least 3 characters.')
  .max(30, 'Use at most 30 characters.')
  .regex(/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/, 'Lowercase letters, numbers and hyphens only; cannot start or end with a hyphen.')

export function makeLoginSchema() {
  return z.object({
    email: z.string().trim().min(1, 'Enter your email.').email('Enter a valid email address.'),
    password: z.string().min(1, 'Enter your password.'),
  })
}

export function makeRegisterSchema(allowedDomains: string[]) {
  return z
    .object({
      fullName: z.string().trim().min(2, 'Enter your full name.').max(100),
      username: usernameSchema,
      email: z.string().trim().min(1, 'Enter your email.').email('Enter a valid email address.'),
      usn: z.string().trim().max(30).optional(),
      academicYear: z.string().trim().max(20).optional(),
      password: passwordSchema,
      confirmPassword: z.string().min(1, 'Confirm your password.'),
    })
    .refine((v) => emailDomainAllowed(v.email, allowedDomains), {
      path: ['email'],
      message: `Use your institutional email (${allowedDomains.map((d) => '@' + d).join(', ')}).`,
    })
    .refine((v) => v.password === v.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    })
}

export const forgotSchema = z.object({
  email: z.string().trim().min(1, 'Enter your email.').email('Enter a valid email address.'),
})

export const resetSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string().min(1, 'Confirm your password.') })
  .refine((v) => v.password === v.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  })

/** Maps Supabase Auth errors to messages that do not leak internals or enable account enumeration. */
export function friendlyAuthError(message: string | undefined): string {
  const m = (message ?? '').toLowerCase()
  if (m.includes('invalid login credentials')) return 'Incorrect email or password.'
  if (m.includes('email not confirmed')) return 'Please verify your email before signing in.'
  if (m.includes('rate limit') || m.includes('too many')) return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('password') && m.includes('weak')) return 'That password is too weak. Choose a longer, less common one.'
  if (m.includes('network') || m.includes('fetch')) return 'Network problem. Check your connection and try again.'
  return 'Something went wrong. Please try again.'
}
