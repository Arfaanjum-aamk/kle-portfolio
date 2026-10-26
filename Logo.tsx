export function Logo({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} role="img" aria-label="Engineering Portfolio Studio logo">
      <rect width="32" height="32" rx="7" fill="#0b1524" stroke="#182a45" />
      <circle cx="16" cy="16" r="6" fill="none" stroke="#f5a524" strokeWidth="2.5" />
      <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
        <path d="M16 4v5M16 23v5M4 16h5M23 16h5" />
      </g>
    </svg>
  )
}
