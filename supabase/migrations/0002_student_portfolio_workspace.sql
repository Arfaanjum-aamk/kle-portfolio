-- 0002: student project workspace, S1-S11 evidence, portfolio themes, and storage buckets.
-- Run after 0001_auth_profiles_roles.sql in the Supabase SQL editor.

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  slug text not null,
  summary text not null default '',
  problem_statement text not null default '',
  status text not null default 'draft' check (status in ('draft','in_progress','review','published','archived')),
  cover_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(owner_id, slug)
);

create index projects_owner_idx on public.projects(owner_id);
create index projects_status_idx on public.projects(status);

create table public.project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_no smallint not null check (stage_no between 1 and 11),
  title text not null,
  objective text not null default '',
  notes text not null default '',
  status text not null default 'not_started' check (status in ('not_started','in_progress','complete','needs_review')),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique(project_id, stage_no)
);

create index project_stages_project_idx on public.project_stages(project_id);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage_id uuid references public.project_stages(id) on delete set null,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  description text not null default '',
  category text not null check (category in ('graph','cad','simulation','video','calculation','drawing','document','photo','test','other')),
  storage_path text,
  external_url text,
  file_name text,
  file_size bigint,
  mime_type text,
  visibility text not null default 'private' check (visibility in ('private','faculty','public')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index evidence_project_idx on public.evidence(project_id);
create index evidence_owner_idx on public.evidence(owner_id);
create index evidence_category_idx on public.evidence(category);

create table public.portfolio_themes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  project_id uuid not null unique references public.projects(id) on delete cascade,
  theme_name text not null default 'Engineering Blueprint',
  accent text not null default '#f5b942',
  background text not null default '#07111f',
  surface text not null default '#0e1b2d',
  text_color text not null default '#f7fafc',
  font_family text not null default 'Inter',
  layout text not null default 'engineering',
  show_timeline boolean not null default true,
  show_metrics boolean not null default true,
  show_contact boolean not null default true,
  custom_css text not null default '',
  updated_at timestamptz not null default now()
);

create index portfolio_themes_owner_idx on public.portfolio_themes(owner_id);

create or replace function public.touch_portfolio_workspace_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create trigger projects_touch_updated_at before update on public.projects
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger stages_touch_updated_at before update on public.project_stages
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger evidence_touch_updated_at before update on public.evidence
for each row execute function public.touch_portfolio_workspace_updated_at();
create trigger themes_touch_updated_at before update on public.portfolio_themes
for each row execute function public.touch_portfolio_workspace_updated_at();

create or replace function public.seed_project_stages() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  stage_titles text[] := array[
    'Need definition','Concept generation and selection','Functional requirements',
    'Functional architecture','Subsystem design','Component design and calculation',
    'CAD and manufacturing drawings','Material and standard component selection',
    'Fabrication and assembly','Testing and predicted vs measured','Documented improvement'
  ];
  i integer;
begin
  for i in 1..11 loop
    insert into public.project_stages(project_id, stage_no, title)
    values (new.id, i, stage_titles[i]);
  end loop;
  insert into public.portfolio_themes(owner_id, project_id) values (new.owner_id, new.id);
  return new;
end $$;

create trigger projects_seed_workspace after insert on public.projects
for each row execute function public.seed_project_stages();

alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.evidence enable row level security;
alter table public.portfolio_themes enable row level security;

revoke all on public.projects, public.project_stages, public.evidence, public.portfolio_themes from anon;
grant select, insert, update, delete on public.projects, public.project_stages, public.evidence, public.portfolio_themes to authenticated;

create policy "projects: owner all" on public.projects for all to authenticated
using (owner_id = auth.uid() or public.is_staff())
with check (owner_id = auth.uid() or public.is_admin());

create policy "stages: project owner or staff" on public.project_stages for all to authenticated
using (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())))
with check (exists (select 1 from public.projects p where p.id = project_id and (p.owner_id = auth.uid() or public.is_staff())));

create policy "evidence: owner or staff" on public.evidence for all to authenticated
using (owner_id = auth.uid() or public.is_staff())
with check (owner_id = auth.uid() or public.is_admin());

create policy "themes: owner or staff" on public.portfolio_themes for all to authenticated
using (owner_id = auth.uid() or public.is_staff())
with check (owner_id = auth.uid() or public.is_admin());

-- Storage buckets. File contents are always protected by Storage RLS policies below.
insert into storage.buckets (id, name, public, file_size_limit)
values
  ('portfolio-media', 'portfolio-media', false, 524288000),
  ('portfolio-models', 'portfolio-models', false, 524288000)
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit;

create policy "portfolio storage: owner read" on storage.objects
for select to authenticated
using (bucket_id in ('portfolio-media','portfolio-models') and (storage.foldername(name))[1] = auth.uid()::text);

create policy "portfolio storage: owner upload" on storage.objects
for insert to authenticated
with check (bucket_id in ('portfolio-media','portfolio-models') and (storage.foldername(name))[1] = auth.uid()::text);

create policy "portfolio storage: owner update" on storage.objects
for update to authenticated
using (bucket_id in ('portfolio-media','portfolio-models') and (storage.foldername(name))[1] = auth.uid()::text)
with check (bucket_id in ('portfolio-media','portfolio-models') and (storage.foldername(name))[1] = auth.uid()::text);

create policy "portfolio storage: owner delete" on storage.objects
for delete to authenticated
using (bucket_id in ('portfolio-media','portfolio-models') and (storage.foldername(name))[1] = auth.uid()::text);
