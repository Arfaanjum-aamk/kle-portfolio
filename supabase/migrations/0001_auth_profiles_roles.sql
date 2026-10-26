-- 0001: profiles, roles, signup trigger, email-domain restriction, RLS.
-- Run in the Supabase SQL editor (or `supabase db push`). Safe to read before running.

create type public.app_role as enum ('student', 'faculty', 'admin');

-- Platform settings (single row). Only admins can change them, through RLS below.
create table public.platform_settings (
  id boolean primary key default true check (id),            -- enforces a single row
  allowed_email_domains text[] not null default '{}',        -- empty = any domain allowed
  updated_at timestamptz not null default now()
);
insert into public.platform_settings (id) values (true);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  full_name text not null default '',
  role public.app_role not null default 'student',
  usn text,
  academic_year text,
  avatar_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_format check (username ~ '^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$')
);
create unique index profiles_username_key on public.profiles (lower(username));
create index profiles_role_idx on public.profiles (role);

-- ---------------------------------------------------------------- helpers
create or replace function public.current_app_role() returns public.app_role
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() = 'admin', false)
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(public.current_app_role() in ('faculty', 'admin'), false)
$$;

create or replace function public.username_available(candidate text) returns boolean
language sql stable security definer set search_path = public as $$
  select not exists (select 1 from public.profiles where lower(username) = lower(candidate))
$$;
grant execute on function public.username_available(text) to anon, authenticated;

-- ---------------------------------------------------------------- signup guards
-- Server-side institutional email restriction (the client check is only a convenience).
create or replace function public.enforce_email_domain() returns trigger
language plpgsql security definer set search_path = public as $$
declare allowed text[]; dom text;
begin
  select allowed_email_domains into allowed from public.platform_settings where id;
  if allowed is not null and array_length(allowed, 1) > 0 then
    dom := lower(split_part(new.email, '@', 2));
    if not (dom = any (select lower(d) from unnest(allowed) d)) then
      raise exception 'Registration is restricted to approved institutional email domains.';
    end if;
  end if;
  return new;
end $$;

create trigger enforce_email_domain_before_signup
  before insert on auth.users
  for each row execute function public.enforce_email_domain();

-- Every new account is a STUDENT. Role is never read from signup metadata.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare uname text;
begin
  uname := lower(coalesce(new.raw_user_meta_data ->> 'username', ''));
  if uname !~ '^[a-z0-9]([a-z0-9-]{1,28})[a-z0-9]$' or exists (select 1 from public.profiles where lower(username) = uname) then
    uname := 'user-' || substr(replace(new.id::text, '-', ''), 1, 12);
  end if;
  insert into public.profiles (id, username, full_name, usn, academic_year, role)
  values (
    new.id,
    uname,
    left(coalesce(new.raw_user_meta_data ->> 'full_name', ''), 100),
    left(new.raw_user_meta_data ->> 'usn', 30),
    left(new.raw_user_meta_data ->> 'academic_year', 20),
    'student'
  );
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Block role changes from signed-in clients. Allowed only inside set_user_role()
-- (admin-checked) or from the SQL editor / service role, where auth.uid() is null.
create or replace function public.guard_profile_update() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  if new.role is distinct from old.role
     and auth.uid() is not null
     and coalesce(current_setting('app.role_change_ok', true), '') <> 'on' then
    raise exception 'Role changes are not permitted.';
  end if;
  if new.id is distinct from old.id then
    raise exception 'Profile id cannot change.';
  end if;
  return new;
end $$;

create trigger profiles_guard_update
  before update on public.profiles
  for each row execute function public.guard_profile_update();

-- Admin-only role assignment (the "trusted administrative process").
create or replace function public.set_user_role(target uuid, new_role public.app_role) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then
    raise exception 'Only administrators can assign roles.';
  end if;
  perform set_config('app.role_change_ok', 'on', true);
  update public.profiles set role = new_role where id = target;
end $$;
revoke all on function public.set_user_role(uuid, public.app_role) from public, anon;
grant execute on function public.set_user_role(uuid, public.app_role) to authenticated;

-- ---------------------------------------------------------------- RLS
alter table public.profiles enable row level security;
alter table public.platform_settings enable row level security;

revoke all on public.profiles from anon;
revoke all on public.platform_settings from anon;
grant select, update on public.profiles to authenticated;
grant select, update on public.platform_settings to authenticated;

-- No INSERT/DELETE policy on profiles: rows are created by the trigger and removed with the auth user.
create policy "profiles: read own" on public.profiles
  for select to authenticated using (id = auth.uid());
create policy "profiles: staff read all" on public.profiles
  for select to authenticated using (public.is_staff());
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy "settings: staff read" on public.platform_settings
  for select to authenticated using (public.is_staff());
create policy "settings: admin update" on public.platform_settings
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
