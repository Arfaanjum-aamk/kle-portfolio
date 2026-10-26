import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Film } from 'lucide-react'
import StudentFoundation from './StudentFoundation'

const workflowCodes = new Set(['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'])

export default function StudentFoundationShell() {
  const navigate = useNavigate()

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null
      const card = target?.closest('.group') as HTMLElement | null
      const match = card?.textContent?.match(/A[1-7]/)
      const code = match?.[0]
      if (card && code && workflowCodes.has(code)) navigate(`/dashboard/workflow/${code}`)
    }

    document.querySelectorAll('.group').forEach((el) => {
      if (/A[1-7]/.test(el.textContent || '')) (el as HTMLElement).style.cursor = 'pointer'
    })

    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [navigate])

  return (
    <>
      <StudentFoundation />
      <button
        onClick={() => navigate('/dashboard/evidence')}
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 border px-4 py-3 text-xs font-semibold uppercase tracking-[.12em] shadow-[0_18px_40px_-20px_rgba(43,29,24,.8)]"
        style={{ background: '#2b1d18', borderColor: '#c6a15b', color: '#f7f1e8' }}
      >
        <Film className="h-4 w-4" /> Engineering evidence
      </button>
    </>
  )
}
