import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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

  return <StudentFoundation />
}
