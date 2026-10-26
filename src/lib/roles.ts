export type Role = 'student' | 'faculty' | 'admin'

export function homePathForRole(role: Role | null | undefined): string {
  if (role === 'faculty') return '/faculty'
  if (role === 'admin') return '/admin'
  return '/dashboard'
}
