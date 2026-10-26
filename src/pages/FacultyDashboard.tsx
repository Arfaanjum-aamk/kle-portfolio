import { DashboardShell, EmptyState } from './DashboardShell'

export default function FacultyDashboard() {
  return (
    <DashboardShell roleLabel="Faculty">
      <EmptyState title="No review queue yet" body="Authorised student lists, review queues and rubric feedback arrive in Phase 7." />
    </DashboardShell>
  )
}
