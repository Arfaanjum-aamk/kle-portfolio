-- 0003: Phase 1 project foundation — team, guide, engineering sections, layouts, concepts, sources.
-- Run after 0002_student_portfolio_workspace.sql.

alter table public.projects
  add column if not exists department text not null default 'Mechanical Engineering',
  add column if not exists academic_year text not null default '',
  add column if not exists semester text not null default '',
  add column if not exists project_type text not null default '',
  add column if not exists section_name text not null default '',
  add column if not exists team_size smallint,
  add column if not exists guide_name text not null default '',
  add column if not exists guide_designation text not null default '',
  add column if not exists guide_department text not null default 'Mechanical Engineering',
  add column if not exists guide_photo_path text,
  add column if not exists guide_contact text,
  add column if not exists cover_caption text not null default '';

create table public.project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  name text not null,
  usn text not null default '',
  role text not null default '',
  contribution text not null default '',
  photo_path text,
  contact text,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_team_members_project_idx on public.project_team_members(project_id, sort_order);

create table public.project_sections (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  section_key text not null check (section_key in ('problem','a1_need','a2_inputs','a3_map','a4_targets','a5_gate','constraints','design_notes','to_verify','sources')),
  title text not null,
  content text not null default '',
  verification_status text not null default 'not_checked' check (verification_status in ('not_checked','draft','verified','needs_source')),
  source_notes text not null default '',
  sort_order smallint not null default 0,
  updated_at timestamptz not null default now(),
  unique(project_id, section_key)
);
create index project_sections_project_idx on public.project_sections(project_id, sort_order);

create table public.project_layouts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  layout_no smallint not null,
  title text not null default '',
  image_path text,
  drawn_by text not null default '',
  layout_date date,
  what_varies text not null default '',
  load_path text not null default '',
  weakness text not null default '',
  labels text not null default '',
  verification_status text not null default 'not_checked' check (verification_status in ('not_checked','draft','verified','needs_source')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, layout_no)
);
create index project_layouts_project_idx on public.project_layouts(project_id, layout_no);

create table public.project_concepts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  concept_no smallint not null,
  title text not null default '',
  image_path text,
  drawn_by text not null default '',
  concept_date date,
  what_changes text not null default '',
  how_it_works text not null default '',
  advantages text not null default '',
  weaknesses text not null default '',
  verification_notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, concept_no)
);
create index project_concepts_project_idx on public.project_concepts(project_id, concept_no);

create table public.project_concept_comparisons (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  criterion text not null,
  values jsonb not null default '{}'::jsonb,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(project_id, criterion)
);
create index project_concept_comparisons_project_idx on public.project_concept_comparisons(project_id, sort_order);

create table public.project_sources (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  source_type text not null default 'document',
  url text,
  citation text not null default '',
  status text not null default 'not_checked' check (status in ('not_checked','used','not_received','cross_check','verified')),
  notes text not null default '',
  sort_order smallint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index project_sources_project_idx on public.project_sources(project_id, sort_order);

create trigger project_team_touch_updated_at before update on public.project_team_members
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger project_sections_touch_updated_at before update on public.project_sections
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger project_layouts_touch_updated_at before update on public.project_layouts
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger project_concepts_touch_updated_at before update on public.project_concepts
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger project_concept_comparisons_touch_updated_at before update on public.project_concept_comparisons
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger project_sources_touch_updated_at before update on public.project_sources
for each row execute function public.touch_portfolio_workspace_updated_at();

alter table public.project_team_members enable row level security;
alter table public.project_sections enable row level security;
alter table public.project_layouts enable row level security;
alter table public.project_concepts enable row level security;
alter table public.project_concept_comparisons enable row level security;
alter table public.project_sources enable row level security;

revoke all on public.project_team_members, public.project_sections, public.project_layouts, public.project_concepts, public.project_concept_comparisons, public.project_sources from anon;
grant select, insert, update, delete on public.project_team_members, public.project_sections, public.project_layouts, public.project_concepts, public.project_concept_comparisons, public.project_sources to authenticated;

create policy "team: project owner or staff" on public.project_team_members for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "sections: project owner or staff" on public.project_sections for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "layouts: project owner or staff" on public.project_layouts for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "concepts: project owner or staff" on public.project_concepts for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "comparisons: project owner or staff" on public.project_concept_comparisons for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));

create policy "sources: project owner or staff" on public.project_sources for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_admin())));
