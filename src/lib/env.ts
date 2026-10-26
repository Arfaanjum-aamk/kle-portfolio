/** Public, build-time configuration. Only the Supabase URL and publishable key belong here. */
const raw = import.meta.env

export const env = {
  supabaseUrl: (raw.VITE_SUPABASE_URL as string | undefined)?.trim() ?? '',
  supabaseKey: (raw.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)?.trim() ?? '',
  allowedEmailDomains: parseDomains(raw.VITE_ALLOWED_EMAIL_DOMAINS as string | undefined),
}

export function parseDomains(value: string | undefined): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((d) => d.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean)
}

export const isSupabaseConfigured = Boolean(env.supabaseUrl && env.supabaseKey)
