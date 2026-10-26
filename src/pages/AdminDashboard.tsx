import { DashboardShell, EmptyState } from './DashboardShell'

export default function AdminDashboard() {
  return (
    <DashboardShell roleLabel="Administrator">
      <EmptyState title="Role management not built yet" body="Faculty role assignment goes through an admin-only database function added in Phase 2. Until then, see the README for the SQL procedure." />
    </DashboardShell>
  )
}
