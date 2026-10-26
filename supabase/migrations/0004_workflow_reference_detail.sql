-- 0004: Preserve the full source detail needed by editable A6 workflow records.
-- Run after 0003_project_foundation.sql.

alter table public.project_layouts
  add column if not exists red_path text not null default '',
  add column if not exists verification_flags text not null default '';
