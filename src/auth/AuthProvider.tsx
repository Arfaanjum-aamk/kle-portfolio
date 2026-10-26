import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Role } from '@/lib/roles'

export interface Profile {
  id: string
  username: string
  full_name: string
  role: Role
  avatar_path: string | null
}

interface AuthState {
  session: Session | null
  user: User | null
  profile: Profile | null
  loading: boolean
  /** True once Supabase reports the email as confirmed. */
  emailVerified: boolean
  /** True while the user is in a password-recovery session from an email link. */
  recovering: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))
  const [recovering, setRecovering] = useState(false)

  const loadProfile = useCallback(async (userId: string | undefined) => {
    if (!supabase || !userId) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('id, username, full_name, role, avatar_path')
      .eq('id', userId)
      .maybeSingle()
    setProfile(error ? null : (data as Profile | null))
  }, [])

  useEffect(() => {
    if (!supabase) return
    let active = true
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      await loadProfile(data.session?.user.id)
      if (active) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((event, next) => {
      setSession(next)
      if (event === 'PASSWORD_RECOVERY') setRecovering(true)
      if (event === 'SIGNED_OUT') setRecovering(false)
      // Defer: calling Supabase inside this callback can deadlock the auth client.
      setTimeout(() => void loadProfile(next?.user.id), 0)
    })
    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [loadProfile])

  const value = useMemo<AuthState>(
    () => ({
      session,
      user: session?.user ?? null,
      profile,
      loading,
      emailVerified: Boolean(session?.user.email_confirmed_at),
      recovering,
      signOut: async () => {
        await supabase?.auth.signOut()
      },
      refreshProfile: () => loadProfile(session?.user.id),
    }),
    [session, profile, loading, recovering, loadProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
