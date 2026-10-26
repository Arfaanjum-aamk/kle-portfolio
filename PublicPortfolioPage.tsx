import { Link, useParams } from 'react-router-dom'
import { EmptyState } from './DashboardShell'

/** Route is live so deep links and refreshes work on GitHub Pages. Published content arrives in Phase 6. */
export default function PublicPortfolioPage() {
  const { username } = useParams()
  return (
    <main className="mx-auto max-w-3xl px-5 py-16">
      <p className="font-mono text-xs uppercase tracking-widest text-amber-eng">Student portfolio</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-white">{username}</h1>
      <EmptyState title="Public portfolios are not available yet" body="Only content a student explicitly publishes will appear here, once publishing is implemented." />
      <p className="mt-6 text-sm"><Link to="/login" className="text-cyanx hover:underline">Sign in</Link></p>
    </main>
  )
}
