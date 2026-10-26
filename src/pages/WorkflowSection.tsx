import { ChevronLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const brown = '#2b1d18'
const ivory = '#f7f1e8'
const parchment = '#ede3d3'
const gold = '#c6a15b'
const goldInk = '#7a5c22'
const espresso = '#3a241b'

const sections: Record<string, { label: string; intro: string; items: string[] }> = {
  A1: { label: 'Need', intro: 'This section records the need identified for the project, following the structure of the reference material.', items: ['Need statement', 'Why the need matters', 'Source / evidence', 'Verification status'] },
  A2: { label: 'Inputs', intro: 'This section records the inputs that the engineering workflow starts from.', items: ['Inputs and observations', 'Known information', 'Source documents', 'Verification status'] },
  A3: { label: 'Map', intro: 'This section records the functional map used to organize the engineering problem.', items: ['Functional map', 'Functions and relationships', 'System boundary', 'Verification notes'] },
  A4: { label: 'Targets', intro: 'This section records the targets and measurable outcomes defined for the project.', items: ['Target values', 'Acceptance criteria', 'Measurement basis', 'Verification status'] },
  A5: { label: 'Gate', intro: 'This section records the gate/checkpoint before moving into layout and concept development.', items: ['Gate decision', 'Constraints', 'Design considerations', 'To verify / sources'] },
  A6: { label: 'Layouts', intro: 'This section is prepared for the layout alternatives shown in the reference material.', items: ['Layout number', 'Sketch / image', 'Created by', 'Date', 'What varies', 'Load path', 'Weakness', 'Verification flags'] },
  A7: { label: 'Concepts', intro: 'This section is prepared for concept generation, ownership, comparison and verification.', items: ['Concept number', 'Concept title', 'Concept image', 'Drawn by', 'Date', 'How it works', 'Advantages', 'Weaknesses', 'Comparison', 'Verification notes'] },
}

export default function WorkflowSection() {
  const navigate = useNavigate()
  const { code = 'A1' } = useParams()
  const requested = code.toUpperCase()
  const actualCode = requested in sections ? requested : 'A1'
  const section = sections[actualCode]

  return (
    <div className="min-h-screen" style={{ background: ivory, color: espresso }}>
      <header className="border-b" style={{ background: brown, borderColor: `${gold}66` }}>
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: gold }}>Mechanical Engineering · Engineering Workflow</p>
            <p className="mt-1 font-display text-xl" style={{ color: ivory }}>Clutch Bench Test File</p>
          </div>
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 border px-3 py-2 text-xs" style={{ borderColor: `${gold}80`, color: ivory }}><ChevronLeft className="h-4 w-4" /> Back to foundation</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-5 py-10 lg:px-8 lg:py-14">
        <p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: goldInk }}>03 · Engineering workflow · {actualCode}</p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <div><h1 className="font-display text-5xl" style={{ color: brown }}>{actualCode} — {section.label}</h1><p className="mt-4 max-w-3xl text-base leading-relaxed" style={{ color: '#69574d' }}>{section.intro}</p></div>
          <span className="px-3 py-2 font-mono text-[10px] uppercase tracking-[.14em]" style={{ background: gold, color: espresso }}>Ready for content</span>
        </div>

        <section className="mt-10 border bg-white p-6 md:p-8" style={{ borderColor: `${brown}30` }}>
          <div className="grid gap-4 md:grid-cols-2">
            {section.items.map((item, index) => <div key={item} className="border p-5" style={{ background: index % 2 ? ivory : parchment, borderColor: `${gold}55` }}><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: goldInk }}>0{index + 1}</p><h2 className="mt-2 font-display text-2xl" style={{ color: brown }}>{item}</h2><p className="mt-2 text-sm" style={{ color: '#75645a' }}>Content will be added from the project evidence and reference material.</p></div>)}
          </div>
        </section>

        <section className="mt-8 border px-6 py-6" style={{ background: parchment, borderColor: `${brown}25` }}>
          <p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: goldInk }}>Evidence-first rule</p>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#69574d' }}>No engineering value is being invented on this page. When the actual project evidence is entered, the source, engineering statement and verification status will remain distinct.</p>
        </section>
      </main>
    </div>
  )
}
