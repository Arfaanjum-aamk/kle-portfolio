import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './AuthProvider'
import { homePathForRole, type Role } from '@/lib/roles'
import { FullPageSpinner } from '@/components/ui/Spinner'

/**
 * Route guards improve navigation only. Real access control is Row Level Security
 * in the database; a user who bypasses these guards still cannot read or write data.
 */
export function RequireAuth({ allow }: { allow?: Role[] }) {
  const { user, profile, loading, emailVerified } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageSpinner label="Checking your session…" />
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  if (!emailVerified) return <Navigate to="/verify-email" replace />
  if (!profile) return <FullPageSpinner label="Loading your profile…" />
  if (allow && !allow.includes(profile.role)) {
    return <Navigate to={homePathForRole(profile.role)} replace />
  }
  return <Outlet />
}

/** Keeps signed-in, verified users away from the login and registration pages. */
export function RedirectIfAuthed() {
  const { user, profile, loading, emailVerified } = useAuth()
  if (loading) return <FullPageSpinner label="Checking your session…" />
  if (user && emailVerified && profile) return <Navigate to={homePathForRole(profile.role)} replace />
  return <Outlet />
}
