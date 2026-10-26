import { DashboardShell, EmptyState } from './DashboardShell'

export default function StudentDashboard() {
  return (
    <DashboardShell roleLabel="Student">
      <p className="mt-1 text-sm text-steel-300">Your signed-in student area is protected and ready.</p>
      <EmptyState
        title="No projects yet"
        body="Project workspaces, the S1–S11 workflow, evidence uploads and portfolio tools are built in the next phases. Nothing on this page is sample data."
      />
    </DashboardShell>
  )
}
