import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env'

/**
 * Browser client. Uses only the public project URL and publishable key; every
 * permission is enforced by Row Level Security in the database, not by this code.
 * Null when the environment is not configured so the UI can explain what is missing
 * instead of crashing.
 */
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null

/** Absolute URL for a route, correct under a GitHub Pages project-site base path. */
export function appUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base}${path.startsWith('/') ? path : `/${path}`}`
}
