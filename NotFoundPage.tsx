import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-5 text-center">
      <p className="font-mono text-sm text-amber-eng">404</p>
      <h1 className="font-display text-2xl text-white">Page not found</h1>
      <Link to="/" className="btn-secondary">Go home</Link>
    </main>
  )
}
