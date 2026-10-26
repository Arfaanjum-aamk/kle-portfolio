import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Box, ExternalLink, FileImage, Film, Image as ImageIcon, Loader2, Play, Plus, Save, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '@/auth/AuthProvider'
import { supabase } from '@/lib/supabase'

type Kind = 'video' | 'cad' | 'simulation' | 'photo'
type Evidence = {
  id: string
  title: string
  description: string
  category: Kind
  storage_path: string | null
  external_url: string | null
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  visibility: 'private' | 'faculty' | 'public'
  metadata: { preview_path?: string; software?: string; study?: string; solver?: string }
  created_at: string
}
type Project = { id: string; title: string }

const brown = '#2b1d18'
const ivory = '#f7f1e8'
const parchment = '#ede3d3'
const gold = '#c6a15b'
const goldInk = '#7a5c22'
const espresso = '#3a241b'
const ink = '#69574d'
const MAX_DIRECT_UPLOAD = 6 * 1024 * 1024

const labels: Record<Kind, string> = { video: 'Video documentation', cad: 'CAD / CAED model', simulation: 'Simulation evidence', photo: 'Project photos' }
const icons: Record<Kind, typeof Film> = { video: Film, cad: Box, simulation: FileImage, photo: ImageIcon }

function formatSize(bytes: number | null) {
  if (!bytes) return '—'
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function safeName(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-|-$/g, '')
}

function youtubeEmbed(url: string | null) {
  if (!url) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}`
    if (parsed.hostname.includes('youtube.com')) {
      const id = parsed.searchParams.get('v')
      return id ? `https://www.youtube.com/embed/${id}` : null
    }
  } catch { return null }
  return null
}

export default function EngineeringEvidence() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState<Project | null>(null)
  const [items, setItems] = useState<Evidence[]>([])
  const [signed, setSigned] = useState<Record<string, string>>({})
  const [previewSigned, setPreviewSigned] = useState<Record<string, string>>({})
  const [kind, setKind] = useState<Kind>('video')
  const [busy, setBusy] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [modal, setModal] = useState<Evidence | null>(null)
  const [form, setForm] = useState({ title: '', description: '', url: '', visibility: 'private' as Evidence['visibility'], software: '', study: '', solver: '' })

  const load = async () => {
    if (!supabase || !user) return
    setBusy(true)
    const { data: p, error: projectError } = await supabase.from('projects').select('id,title').eq('owner_id', user.id).eq('title', 'Clutch Bench Test File').maybeSingle()
    if (projectError || !p) {
      toast.error(projectError?.message || 'Project not found')
      setBusy(false)
      return
    }
    setProject(p as Project)
    const { data, error } = await supabase.from('evidence').select('id,title,description,category,storage_path,external_url,file_name,file_size,mime_type,visibility,metadata,created_at').eq('project_id', p.id).in('category', ['video', 'cad', 'simulation', 'photo']).order('created_at', { ascending: false })
    if (error) toast.error(error.message)
    const next = (data ?? []) as Evidence[]
    setItems(next)
    const paths = next.filter(x => x.storage_path).map(x => x.storage_path as string)
    if (paths.length) {
      const { data: urls } = await supabase.storage.from('portfolio-media').createSignedUrls(paths, 3600)
      const map: Record<string, string> = {}
      urls?.forEach((x, i) => { if (x.signedUrl) map[paths[i]] = x.signedUrl })
      setSigned(map)
    }
    const previewPaths = next.map(x => x.metadata?.preview_path).filter(Boolean) as string[]
    if (previewPaths.length) {
      const { data: urls } = await supabase.storage.from('portfolio-media').createSignedUrls(previewPaths, 3600)
      const map: Record<string, string> = {}
      urls?.forEach((x, i) => { if (x.signedUrl) map[previewPaths[i]] = x.signedUrl })
      setPreviewSigned(map)
    }
    setBusy(false)
  }

  useEffect(() => { void load() }, [user?.id])

  const filtered = useMemo(() => items.filter(x => x.category === kind), [items, kind])

  const uploadFile = async (file: File, bucket: 'portfolio-media' | 'portfolio-models', folder: string) => {
    if (!supabase || !user || !project) throw new Error('Project session is not ready')
    if (file.size > MAX_DIRECT_UPLOAD) throw new Error('Direct uploads are limited to 6 MB. For larger video/CAD files, use the external link field for now.')
    const path = `${user.id}/projects/${project.id}/${folder}/${Date.now()}-${safeName(file.name)}`
    const { error } = await supabase.storage.from(bucket).upload(path, file, { contentType: file.type || 'application/octet-stream', upsert: false })
    if (error) throw error
    return { path, bucket }
  }

  const saveEvidence = async (file?: File, previewFile?: File) => {
    if (!supabase || !user || !project) return
    if (!form.title.trim()) { toast.error('Add a title first'); return }
    if (!file && !form.url.trim()) { toast.error('Add a file or an external link'); return }
    setUploading(true)
    try {
      let storagePath: string | null = null
      let previewPath: string | undefined
      if (file) {
        const result = await uploadFile(file, kind === 'cad' ? 'portfolio-models' : 'portfolio-media', kind)
        storagePath = result.path
      }
      if (previewFile && kind === 'cad') {
        const result = await uploadFile(previewFile, 'portfolio-media', 'cad-previews')
        previewPath = result.path
      }
      const metadata = { software: form.software, study: form.study, solver: form.solver, ...(previewPath ? { preview_path: previewPath } : {}) }
      const { error } = await supabase.from('evidence').insert({
        project_id: project.id,
        owner_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: kind,
        storage_path: storagePath,
        external_url: form.url.trim() || null,
        file_name: file?.name ?? null,
        file_size: file?.size ?? null,
        mime_type: file?.type ?? null,
        visibility: form.visibility,
        metadata,
      })
      if (error) throw error
      toast.success(`${labels[kind]} added`)
      setForm({ title: '', description: '', url: '', visibility: 'private', software: '', study: '', solver: '' })
      await load()
    } catch (error: any) {
      toast.error(error?.message || 'Could not save evidence')
    } finally { setUploading(false) }
  }

  const remove = async (item: Evidence) => {
    if (!supabase) return
    const paths = [item.storage_path, item.metadata?.preview_path].filter(Boolean) as string[]
    const bucket = item.category === 'cad' ? 'portfolio-models' : 'portfolio-media'
    if (item.storage_path) await supabase.storage.from(bucket).remove([item.storage_path])
    if (item.metadata?.preview_path) await supabase.storage.from('portfolio-media').remove([item.metadata.preview_path])
    const { error } = await supabase.from('evidence').delete().eq('id', item.id)
    if (error) toast.error(error.message); else { toast.success('Evidence removed'); setModal(null); void load() }
    void paths
  }

  if (busy) return <div className="min-h-screen grid place-items-center" style={{ background: ivory, color: brown }}><Loader2 className="animate-spin" /></div>

  return (
    <div className="min-h-screen" style={{ background: ivory, color: espresso }}>
      <header className="sticky top-0 z-40 border-b" style={{ background: brown, borderColor: `${gold}66` }}>
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div><p className="font-mono text-[10px] uppercase tracking-[.22em]" style={{ color: gold }}>04 · Engineering evidence</p><h1 className="mt-1 font-display text-2xl" style={{ color: ivory }}>Video · CAD / CAED · Simulation · Photos</h1></div>
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 border px-3 py-2 text-xs" style={{ borderColor: `${gold}80`, color: ivory }}><ArrowLeft className="h-3.5 w-3.5" /> Foundation</button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden px-6 py-12 md:px-12 md:py-14" style={{ background: brown, color: ivory, backgroundImage: `linear-gradient(${gold}12 1px, transparent 1px), linear-gradient(90deg, ${gold}12 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
          <p className="font-mono text-xs uppercase tracking-[.22em]" style={{ color: gold }}>Evidence-first engineering record</p>
          <h2 className="mt-4 max-w-4xl font-display text-4xl leading-tight md:text-6xl">Make the work visible, not just the final answer.</h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed" style={{ color: '#eadfd3' }}>Keep test videos, original photographs, CAD / CAED models and simulation evidence beside the engineering workflow. Each item remains tied to the project and can be kept private, shared with faculty, or marked for future public presentation.</p>
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(labels) as Kind[]).map(k => { const Icon = icons[k]; return <button key={k} onClick={() => setKind(k)} className="border p-5 text-left transition" style={{ background: kind === k ? parchment : '#fff', borderColor: kind === k ? `${gold}99` : `${brown}25` }}><Icon className="h-5 w-5" style={{ color: brown }} /><p className="mt-4 font-display text-xl" style={{ color: brown }}>{labels[k]}</p><p className="mt-1 font-mono text-xs" style={{ color: goldInk }}>{items.filter(x => x.category === k).length} item(s)</p></button> })}
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]">
          <section className="border bg-white p-6 md:p-8" style={{ borderColor: `${brown}30` }}>
            <div className="flex items-end justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: goldInk }}>Add evidence</p><h3 className="mt-2 font-display text-3xl" style={{ color: brown }}>{labels[kind]}</h3></div><Plus className="h-5 w-5" style={{ color: goldInk }} /></div>
            <div className="mt-6 space-y-4">
              <label className="block text-xs font-medium">Title<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm outline-none" style={{ borderColor: `${brown}25` }} placeholder={kind === 'video' ? 'Clutch engagement test — run 01' : kind === 'cad' ? 'Clutch bench assembly — final CAD' : kind === 'simulation' ? 'Shaft torsion check' : 'Fabrication photograph — bench plate'} /></label>
              <label className="block text-xs font-medium">Description<textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm outline-none" style={{ borderColor: `${brown}25` }} placeholder="What does this evidence show? Include test condition, part, view or result." /></label>
              {(kind === 'cad' || kind === 'simulation') && <div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium">Software<input value={form.software} onChange={e => setForm({ ...form, software: e.target.value })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} placeholder="SolidWorks / ANSYS / CAED" /></label><label className="text-xs font-medium">{kind === 'cad' ? 'Version / model note' : 'Study / result type'}<input value={kind === 'cad' ? form.study : form.study} onChange={e => setForm({ ...form, study: e.target.value })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} placeholder={kind === 'cad' ? 'Assembly v01' : 'Static structural / thermal / CFD' } /></label></div>}
              {kind === 'simulation' && <label className="block text-xs font-medium">Solver / method<input value={form.solver} onChange={e => setForm({ ...form, solver: e.target.value })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} placeholder="Solver or calculation method" /></label>}
              <label className="block text-xs font-medium">External link <span className="font-normal text-[#806f64]">(best for large videos/CAD)</span><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }} placeholder="YouTube / Google Drive / institutional file link" /></label>
              <label className="block text-xs font-medium">File upload <span className="font-normal text-[#806f64]">(up to 6 MB in this first media build)</span><input id="evidence-file" type="file" accept={kind === 'video' ? 'video/*' : kind === 'photo' ? 'image/*' : kind === 'cad' ? '.step,.stp,.iges,.igs,.stl,.obj,.dwg,.dxf,.pdf' : 'image/*,.pdf,.csv'} className="mt-1.5 block w-full border bg-[#f7f1e8] p-2 text-sm" style={{ borderColor: `${brown}25` }} /></label>
              {kind === 'cad' && <label className="block text-xs font-medium">CAD preview image <span className="font-normal text-[#806f64]">(optional)</span><input id="cad-preview-file" type="file" accept="image/*" className="mt-1.5 block w-full border bg-[#f7f1e8] p-2 text-sm" style={{ borderColor: `${brown}25` }} /></label>}
              <label className="block text-xs font-medium">Visibility<select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value as Evidence['visibility'] })} className="mt-1.5 w-full border bg-[#f7f1e8] px-3 py-2.5 text-sm" style={{ borderColor: `${brown}25` }}><option value="private">Private</option><option value="faculty">Faculty review</option><option value="public">Public-ready</option></select></label>
              <button disabled={uploading} onClick={() => { const file = (document.getElementById('evidence-file') as HTMLInputElement | null)?.files?.[0]; const preview = (document.getElementById('cad-preview-file') as HTMLInputElement | null)?.files?.[0]; void saveEvidence(file, preview) }} className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 text-sm font-semibold" style={{ background: brown, color: ivory }}>{uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{uploading ? 'Saving…' : 'Save evidence'}</button>
              <p className="text-xs leading-relaxed" style={{ color: ink }}>Large video/CAD files should use the external-link option for now. Supabase recommends resumable TUS uploads for files above 6 MB; we can add that uploader as the next media upgrade.</p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[.18em]" style={{ color: goldInk }}>Evidence library</p><h3 className="mt-2 font-display text-3xl" style={{ color: brown }}>{labels[kind]}</h3></div><span className="font-mono text-xs" style={{ color: goldInk }}>{filtered.length} records</span></div>
            {filtered.length === 0 ? <div className="grid min-h-[280px] place-items-center border bg-white p-8 text-center" style={{ borderColor: `${brown}25` }}><div><Film className="mx-auto h-8 w-8" style={{ color: goldInk }} /><p className="mt-4 font-display text-2xl" style={{ color: brown }}>No evidence added yet</p><p className="mt-2 max-w-md text-sm" style={{ color: ink }}>Add the original project material here. Do not replace source evidence with invented images or results.</p></div></div> : <div className="grid gap-4 md:grid-cols-2">{filtered.map(item => { const url = item.storage_path ? signed[item.storage_path] : item.external_url; const preview = item.metadata?.preview_path ? previewSigned[item.metadata.preview_path] : (item.category === 'photo' && url ? url : null); return <article key={item.id} className="overflow-hidden border bg-white" style={{ borderColor: `${brown}25` }}>
              <button onClick={() => setModal(item)} className="block w-full text-left">
                <div className="grid min-h-48 place-items-center" style={{ background: parchment }}>{preview ? <img src={preview} alt={item.title} className="h-48 w-full object-cover" /> : item.category === 'video' && youtubeEmbed(item.external_url) ? <div className="flex items-center gap-2 font-mono text-xs uppercase" style={{ color: goldInk }}><Play className="h-5 w-5" /> YouTube video</div> : <div className="text-center"><Box className="mx-auto h-9 w-9" style={{ color: brown }} /><p className="mt-2 font-mono text-[10px] uppercase tracking-[.14em]" style={{ color: goldInk }}>{item.file_name || 'External evidence'}</p></div>}</div>
                <div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: goldInk }}>{item.category}</p><h4 className="mt-1 font-display text-2xl" style={{ color: brown }}>{item.title}</h4></div><ExternalLink className="h-4 w-4 shrink-0" style={{ color: goldInk }} /></div><p className="mt-2 text-sm leading-relaxed" style={{ color: ink }}>{item.description || 'No description added.'}</p><div className="mt-4 flex flex-wrap gap-2 font-mono text-[10px] uppercase" style={{ color: goldInk }}><span>{item.visibility}</span><span>·</span><span>{formatSize(item.file_size)}</span>{item.metadata?.software && <><span>·</span><span>{item.metadata.software}</span></>}</div></div>
              </button>
              <div className="border-t p-3" style={{ borderColor: `${brown}18` }}><button onClick={() => void remove(item)} className="inline-flex items-center gap-1 text-xs" style={{ color: '#8b3a2e' }}><Trash2 className="h-3.5 w-3.5" /> Remove</button></div>
            </article> })}</div>}
          </section>
        </section>
      </main>

      {modal && <div className="fixed inset-0 z-[80] grid place-items-center bg-black/70 p-4" role="dialog" aria-modal="true" onMouseDown={e => { if (e.currentTarget === e.target) setModal(null) }}>
        <div className="max-h-[92vh] w-full max-w-5xl overflow-auto border bg-white" style={{ borderColor: `${gold}88` }}>
          <div className="flex items-center justify-between border-b p-4" style={{ borderColor: `${brown}20` }}><div><p className="font-mono text-[10px] uppercase tracking-[.16em]" style={{ color: goldInk }}>{modal.category}</p><h3 className="font-display text-2xl" style={{ color: brown }}>{modal.title}</h3></div><button onClick={() => setModal(null)} aria-label="Close"><X /></button></div>
          <div className="p-5 md:p-8">
            {modal.category === 'video' && youtubeEmbed(modal.external_url) ? <div className="aspect-video overflow-hidden bg-black"><iframe className="h-full w-full" src={youtubeEmbed(modal.external_url) || ''} title={modal.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div> : modal.category === 'video' && modal.storage_path && signed[modal.storage_path] ? <video controls className="max-h-[65vh] w-full bg-black" src={signed[modal.storage_path]} /> : modal.category === 'photo' && modal.storage_path && signed[modal.storage_path] ? <img src={signed[modal.storage_path]} alt={modal.title} className="mx-auto max-h-[70vh] max-w-full object-contain" /> : modal.category === 'cad' ? <div className="grid gap-6 lg:grid-cols-[1.25fr_.75fr]"><div className="grid min-h-[360px] place-items-center border" style={{ background: parchment, borderColor: `${brown}20` }}>{modal.metadata?.preview_path && previewSigned[modal.metadata.preview_path] ? <img src={previewSigned[modal.metadata.preview_path]} alt={`${modal.title} preview`} className="max-h-[520px] max-w-full object-contain" /> : <div className="text-center"><Box className="mx-auto h-14 w-14" style={{ color: brown }} /><p className="mt-4 font-display text-2xl" style={{ color: brown }}>CAD / CAED model</p><p className="mt-2 text-sm" style={{ color: ink }}>The model file is securely stored. Add a preview image to show the assembly here while the full 3D viewer is developed.</p></div>}</div><div className="space-y-4"><Meta label="Software" value={modal.metadata?.software || 'Not specified'} /><Meta label="Version / note" value={modal.metadata?.study || 'Not specified'} /><Meta label="File" value={modal.file_name || 'External model'} /><Meta label="Size" value={formatSize(modal.file_size)} />{(signed[modal.storage_path || ''] || modal.external_url) && <a href={signed[modal.storage_path || ''] || modal.external_url || '#'} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold" style={{ background: brown, color: ivory }}>Open / download model <ExternalLink className="h-4 w-4" /></a>}</div></div> : modal.category === 'simulation' && modal.storage_path && signed[modal.storage_path] ? (modal.mime_type?.startsWith('image/') ? <img src={signed[modal.storage_path]} alt={modal.title} className="mx-auto max-h-[70vh] max-w-full object-contain" /> : <div className="border p-6" style={{ background: parchment, borderColor: `${brown}20` }}><p className="font-display text-2xl" style={{ color: brown }}>Simulation result file</p><p className="mt-2 text-sm" style={{ color: ink }}>{modal.file_name}</p><a className="mt-5 inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold" href={signed[modal.storage_path]} target="_blank" rel="noreferrer" style={{ background: brown, color: ivory }}>Open result <ExternalLink className="h-4 w-4" /></a></div>) : <div className="border p-6" style={{ background: parchment, borderColor: `${brown}20` }}><p className="text-sm" style={{ color: ink }}>{modal.description || 'Evidence record'}</p>{modal.external_url && <a className="mt-5 inline-flex items-center gap-2 px-4 py-3 text-sm font-semibold" href={modal.external_url} target="_blank" rel="noreferrer" style={{ background: brown, color: ivory }}>Open evidence <ExternalLink className="h-4 w-4" /></a>}</div>}
            <div className="mt-6 border-t pt-5" style={{ borderColor: `${brown}18` }}><p className="text-sm leading-relaxed" style={{ color: ink }}>{modal.description || 'No description.'}</p></div>
          </div>
        </div>
      </div>}
    </div>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return <div className="border p-4" style={{ borderColor: '#2b1d1825', background: '#f7f1e8' }}><p className="font-mono text-[10px] uppercase tracking-[.15em]" style={{ color: '#7a5c22' }}>{label}</p><p className="mt-1 text-sm" style={{ color: '#3a241b' }}>{value}</p></div>
}
