import { useEffect, useState } from 'react'
import { BookOpen, Check, ChevronRight, GraduationCap, LogOut, Pencil, ShieldCheck, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/auth/AuthProvider'
import { supabase } from '@/lib/supabase'

type TeamMember = { id: string; name: string; usn: string; role: string; contribution: string; sort_order: number }
type Project = { id: string; title: string; department: string; academic_year: string; semester: string; project_type: string; section_name: string; team_size: number | null; guide_name: string; guide_designation: string; guide_department: string }

const brown = '#2b1d18'
const ivory = '#f7f1e8'
const parchment = '#ede3d3'
const gold = '#c6a15b'
const goldInk = '#7a5c22'
const espresso = '#3a241b'

const teamSeed = [
  ['Spoorti', '01FE24BME023'],
  ['Arfaanjum', '01FE24BME022'],
  ['Manikant', '01FE24BME134'],
  ['Pavan', '01FE24BME092'],
  ['Fairoz', '01FE25BME718'],
  ['Shishir', '01FE24BME117'],
] as const

const workflow = [
  ['A1', 'Need'], ['A2', 'Inputs'], ['A3', 'Map'], ['A4', 'Targets'], ['A5', 'Gate'], ['A6', 'Layouts'], ['A7', 'Concepts'],
]

export default function StudentFoundation() {
  const { profile, user, signOut } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [members, setMembers] = useState<TeamMember[]>([])
  const [busy, setBusy] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    if (!supabase || !user) return
    setBusy(true)
    let { data: p, error } = await supabase.from('projects').select('id,title,department,academic_year,semester,project_type,section_name,team_size,guide_name,guide_designation,guide_department').eq('owner_id', user.id).eq('title', 'Clutch Bench Test File').maybeSingle()
    if (error) { toast.error(error.message); setBusy(false); return }

    if (!p) {
      const slug = 'clutch-bench-test-file'
      const created = await supabase.from('projects').insert({
        owner_id: user.id,
        title: 'Clutch Bench Test File',
        slug,
        department: 'Mechanical Engineering',
        academic_year: '3rd Year',
        semester: '5',
        project_type: 'Mini Project',
        section_name: 'A',
        team_size: 6,
        guide_name: 'Gururaj Fattepur',
        guide_designation: '',
        guide_department: 'Mechanical Engineering',
      }).select('id,title,department,academic_year,semester,project_type,section_name,team_size,guide_name,guide_designation,guide_department').single()
      if (created.error) { toast.error(created.error.message); setBusy(false); return }
      p = created.data
    }

    setProject(p as Project)
    const existing = await supabase.from('project_team_members').select('id,name,usn,role,contribution,sort_order').eq('project_id', p.id).order('sort_order')
    if (existing.error) { toast.error(existing.error.message); setBusy(false); return }
    if (!existing.data?.length) {
      const rows = teamSeed.map(([name, usn], index) => ({ project_id: p.id, name, usn, role: '', contribution: '', sort_order: index }))
      const seeded = await supabase.from('project_team_members').insert(rows).select('id,name,usn,role,contribution,sort_order').order('sort_order')
      if (seeded.error) toast.error(seeded.error.message)
      setMembers((seeded.data ?? []) as TeamMember[])
    } else setMembers(existing.data as TeamMember[])
    setBusy(false)
  }

  useEffect(() => { void load() }, [user?.id])

  const saveProject = async () => {
    if (!supabase || !project) return
    setSaving(true)
    const { error } = await supabase.from('projects').update({
      department: project.department,
      academic_year: project.academic_year,
      semester: project.semester,
      project_type: project.project_type,
      section_name: project.section_name,
      team_size: project.team_size,
      guide_name: project.guide_name,
      guide_designation: project.guide_designation,
      guide_department: project.guide_department,
    }).eq('id', project.id)
    setSaving(false)
    if (error) toast.error(error.message); else toast.success('Project details saved')
  }

  const saveMember = async (member: TeamMember) => {
    if (!supabase) return
    const { error } = await supabase.from('project_team_members').update({ role: member.role, contribution: member.contribution }).eq('id', member.id)
    if (error) toast.error(error.message); else toast.success(`${member.name}'s details saved`)
  }

  const patchMember = (id: string, patch: Partial<TeamMember>) => setMembers(current => current.map(m => m.id === id ? { ...m, ...patch } : m))

  if (busy) return <div className="min-h-screen grid place-items-center" style={{ background: ivory, color: brown }}><div className="font-mono text-xs uppercase tracking-[.2em]">Preparing project foundation…</div></div>

  if (!project) return null

  return (
    <div className="min-h-screen" style={{ background: ivory, color: espresso }}>
      <header className="sticky top-0 z-40 border-b" style={{ background: brown, borderColor: `${gold}66` }}>
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: gold }}>Mechanical Engineering · Project Foundation</p>
            <p className="mt-1 font-display text-xl" style={{ color: ivory }}>Clutch Bench Test File</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm sm:block" style={{ color: '#d9c8b4' }}>{profile?.full_name || 'Student'}</span>
            <button onClick={() => void signOut()} className="inline-flex items-center gap-2 border px-3 py-2 text-xs" style={{ borderColor: `${gold}80`, color: ivory }}><LogOut className="h-3.5 w-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden px-6 py-12 md:px-12 md:py-16" style={{ background: brown, color: ivory, backgroundImage: `linear-gradient(${gold}12 1px, transparent 1px), linear-gradient(90deg, ${gold}12 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
          <div className="max-w-4xl">
            <p className="font-mono text-xs uppercase tracking-[.22em]" style={{ color: gold }}>Team 7 · Div-A</p>
            <h1 className="mt-5 font-display text-4xl leading-tight md:text-6xl">Clutch Bench Test File</h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed md:text-lg" style={{ color: '#eadfd3' }}>A structured engineering project record for the Mechanical Engineering team, beginning with the project foundation and continuing into the A1–A7 workflow.</p>
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[.12em]">
              {['3rd Year', 'Semester 5', 'Section A', 'Mechanical Engineering', 'Mini Project'].map(x => <span key={x} className="px-3 py-2" style={{ background: gold, color: espresso }}>{x}</span>)}
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Department" value={project.department} />
          <Info label="Academic year" value={project.academic_year} />
          <Info label="Semester" value={project.semester} />
          <Info label="Section" value={project.section_name} />
        </section>

        <section className="mt-12 grid gap-8 lg:grid-cols-[1.45fr_.75fr]">
          <div>
            <div className="mb-5 flex items-end justify-between">
              <div><p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: goldInk }}>01 · Team</p><h2 className="mt-2 font-display text-3xl" style={{ color: brown }}>Team 7 — Div-A</h2></div>
              <span className="font-mono text-xs" style={{ color: goldInk }}>{members.length} members</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {members.map((member, index) => (
                <article key={member.id} className="border bg-white p-5 shadow-[0_18px_40px_-28px_rgba(43,29,24,.55)]" style={{ borderColor: `${brown}33` }}>
                  <div className="flex items-start gap-4">
                    <div className="grid h-12 w-12 shrink-0 place-items-center border" style={{ borderColor: `${gold}80`, background: parchment, color: brown }}><Users className="h-5 w-5" /></div>
                    <div className="min-w-0 flex-1"><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: goldInk }}>Member 0{index + 1}</p><h3 className="mt-1 font-display text-2xl" style={{ color: brown }}>{member.name}</h3><p className="mt-1 font-mono text-[11px]" style={{ color: '#75645a' }}>{member.usn}</p></div>
                  </div>
                  <div className="mt-5 grid gap-3">
                    <label className="text-xs font-medium" style={{ color: espresso }}>Role <input className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm outline-none" style={{ borderColor: `${brown}25` }} placeholder="Add role later" value={member.role} onChange={e => patchMember(member.id, { role: e.target.value })} /></label>
                    <label className="text-xs font-medium" style={{ color: espresso }}>Contribution <input className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm outline-none" style={{ borderColor: `${brown}25` }} placeholder="Add contribution later" value={member.contribution} onChange={e => patchMember(member.id, { contribution: e.target.value })} /></label>
                  </div>
                  <button onClick={() => void saveMember(member)} className="mt-4 inline-flex items-center gap-2 px-3 py-2 font-mono text-[10px] uppercase tracking-[.12em]" style={{ background: brown, color: ivory }}><Check className="h-3.5 w-3.5" /> Save member</button>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <section className="border p-6" style={{ background: brown, borderColor: `${gold}55`, color: ivory }}>
              <p className="font-mono text-[10px] uppercase tracking-[.2em]" style={{ color: gold }}>Team captain</p>
              <h3 className="mt-3 font-display text-3xl">Shishir</h3>
              <p className="mt-2 font-mono text-xs" style={{ color: '#d9c8b4' }}>01FE24BME117</p>
              <div className="mt-5 h-px" style={{ background: `${gold}55` }} />
              <p className="mt-4 text-sm leading-relaxed" style={{ color: '#eadfd3' }}>Captain information is recorded separately. Individual technical roles remain blank until you assign them.</p>
            </section>

            <section className="border bg-white p-6" style={{ borderColor: `${brown}30` }}>
              <div className="flex items-center gap-2" style={{ color: brown }}><GraduationCap className="h-5 w-5" /><h3 className="font-display text-2xl">Guide</h3></div>
              <div className="mt-5 grid h-24 w-24 place-items-center border" style={{ background: parchment, borderColor: `${gold}80`, color: brown }}><GraduationCap className="h-8 w-8" /></div>
              <p className="mt-5 font-display text-2xl" style={{ color: brown }}>{project.guide_name}</p>
              <label className="mt-4 block text-xs font-medium">Designation<input className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} placeholder="Add designation later" value={project.guide_designation} onChange={e => setProject({ ...project, guide_designation: e.target.value })} /></label>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: goldInk }}>{project.guide_department}</p>
            </section>
          </aside>
        </section>

        <section className="mt-12 border bg-white p-6 md:p-8" style={{ borderColor: `${brown}30` }}>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: goldInk }}>02 · Project information</p><h2 className="mt-2 font-display text-3xl" style={{ color: brown }}>Foundation details</h2></div><button onClick={() => void saveProject()} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold" style={{ background: brown, color: ivory }}><Pencil className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save project details'}</button></div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <EditField label="Project type" value={project.project_type} onChange={v => setProject({ ...project, project_type: v })} />
            <EditField label="Academic year" value={project.academic_year} onChange={v => setProject({ ...project, academic_year: v })} />
            <EditField label="Semester" value={project.semester} onChange={v => setProject({ ...project, semester: v })} />
            <EditField label="Section" value={project.section_name} onChange={v => setProject({ ...project, section_name: v })} />
          </div>
        </section>

        <section className="mt-12">
          <div className="mb-5"><p className="font-mono text-[11px] uppercase tracking-[.2em]" style={{ color: goldInk }}>03 · Engineering workflow</p><h2 className="mt-2 font-display text-3xl" style={{ color: brown }}>A1 → A7</h2><p className="mt-2 max-w-2xl text-sm leading-relaxed" style={{ color: '#69574d' }}>The first build follows the structure in your reference material. Detailed engineering content will be added section by section; nothing is invented here.</p></div>
          <div className="grid gap-px border" style={{ borderColor: `${gold}55`, background: `${gold}55` }}>
            {workflow.map(([code, label], index) => <div key={code} className="group flex items-center justify-between p-5" style={{ background: index < 5 ? parchment : brown, color: index < 5 ? espresso : ivory }}><div><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: index < 5 ? goldInk : gold }}>{code}</p><p className="mt-1 font-display text-xl">{label}</p></div><ChevronRight className="h-5 w-5" style={{ color: index < 5 ? goldInk : gold }} /></div>)}
          </div>
        </section>

        <section className="mt-12 border px-6 py-7 md:px-8" style={{ background: parchment, borderColor: `${brown}25` }}>
          <div className="flex items-start gap-4"><ShieldCheck className="mt-1 h-5 w-5 shrink-0" style={{ color: goldInk }} /><div><h3 className="font-display text-2xl" style={{ color: brown }}>Evidence-first foundation</h3><p className="mt-2 max-w-3xl text-sm leading-relaxed" style={{ color: '#69574d' }}>We will keep source material, engineering statements and verification status distinct. Later pages can add layouts, concepts, comparisons and sources without pretending that unverified information is a confirmed result.</p></div></div>
        </section>

        <footer className="mt-12 flex items-center gap-3 border-t pt-6" style={{ borderColor: `${brown}25`, color: '#75645a' }}><BookOpen className="h-4 w-4" /><span className="font-mono text-[10px] uppercase tracking-[.16em]">KLE Technological University · Mechanical Engineering</span></footer>
      </main>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) { return <div className="border bg-white p-5" style={{ borderColor: `${brown}25` }}><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: goldInk }}>{label}</p><p className="mt-3 font-display text-2xl" style={{ color: brown }}>{value || '—'}</p></div> }
function EditField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="block text-xs font-medium" style={{ color: espresso }}>{label}<input className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} value={value} onChange={e => onChange(e.target.value)} /></label> }
