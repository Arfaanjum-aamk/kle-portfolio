import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env'

/**
 * Browser client. Uses only the public project URL and publishable key; every
 * permission is enforced by Row Level Security in the database, not by this code.
 *
 * The app requires Supabase in order to run. Keeping the exported client typed as
 * a SupabaseClient lets TypeScript correctly type database/storage calls throughout
 * the browser application. If configuration is missing, fail with a clear message
 * when the client is accessed instead of producing dozens of nullable-client build
 * errors across individual pages.
 */
const missingSupabase = new Proxy({} as SupabaseClient, {
  get() {
    throw new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.')
  },
})

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(env.supabaseUrl, env.supabaseKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : missingSupabase

/** Absolute URL for a route, correct under a GitHub Pages project-site base path. */
export function appUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '')
  return `${window.location.origin}${base}${path.startsWith('/') ? path : `/${path}`}`
}
