-- HR:RUSH FOR PRACTICE — initial schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) on a
-- fresh project. See README.md for the full setup walkthrough.

-- ---------------------------------------------------------------------------
-- Extensions
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto with schema public;

-- ---------------------------------------------------------------------------
-- Table: student_applications
-- ---------------------------------------------------------------------------
create table if not exists public.student_applications (
  id                        uuid primary key default gen_random_uuid(),

  -- Лични данни
  first_name                text not null,
  last_name                 text not null,
  email                     text not null,
  phone                     text not null,

  -- Образование
  university                text not null,
  custom_university         text,
  specialty                 text not null,
  study_year                text not null,
  degree                    text not null,

  -- Професионален профил / интереси
  experience_level          text not null,
  career_interests          text[] not null default '{}',
  other_career_interest     text,
  opportunity_preferences   text[] not null default '{}',
  expectations              text,
  development_goals         text,
  linkedin_url              text,

  -- CV (private Storage object path — never a public URL)
  cv_file_path              text,
  cv_original_filename      text,

  -- GDPR (brief section 10)
  gdpr_consent              boolean not null default false,
  consent_timestamp         timestamptz not null default now(),
  privacy_policy_version    text not null default '1.0',

  -- Admin / pipeline
  application_status        text not null default 'new',
  admin_notes               text,
  season                    text not null default 'Season 9',

  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),

  constraint student_applications_gdpr_consent_required check (gdpr_consent is true),
  constraint student_applications_degree_check
    check (degree in ('bachelor', 'master', 'phd', 'other')),
  constraint student_applications_experience_level_check
    check (experience_level in ('none', 'under_1_year', '1_2_years', 'over_2_years')),
  constraint student_applications_status_check
    check (application_status in
      ('new', 'reviewed', 'contact', 'interview', 'approved', 'hired', 'rejected'))
);

comment on table public.student_applications is
  'Candidate applications submitted through the public /apply form.';
comment on column public.student_applications.season is
  'Editable label for the active cohort, e.g. "Season 9". Change the column default (see README "How to switch the active season") when a new season starts; existing rows keep their original season.';

-- Case-insensitive duplicate detection (brief sections 12 & 38): a plain
-- unique index on lower(email) both enforces uniqueness at the DB level and
-- gives the application-layer duplicate check (in app/api/apply/route.ts) a
-- fast index to use.
create unique index if not exists student_applications_email_lower_unique_idx
  on public.student_applications (lower(email));

create index if not exists student_applications_phone_idx
  on public.student_applications (phone);

create index if not exists student_applications_status_idx
  on public.student_applications (application_status);

create index if not exists student_applications_season_idx
  on public.student_applications (season);

create index if not exists student_applications_created_at_idx
  on public.student_applications (created_at desc);

create index if not exists student_applications_university_idx
  on public.student_applications (university);

create index if not exists student_applications_specialty_idx
  on public.student_applications (specialty);

-- Keep `updated_at` current on every UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_student_applications_updated_at on public.student_applications;
create trigger set_student_applications_updated_at
  before update on public.student_applications
  for each row
  execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Table: admins
-- Membership table for the admin panel. There is intentionally NO public
-- sign-up flow anywhere in the app — rows here are added manually by a
-- project owner (see README "How to create an admin user").
-- ---------------------------------------------------------------------------
create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  created_at  timestamptz not null default now()
);

comment on table public.admins is
  'Allow-list of Supabase Auth users who may access /admin. Populate manually — see README.';

-- SECURITY DEFINER helper so RLS policies below can check admin membership
-- without triggering recursive-RLS issues on the admins table itself. This
-- is the standard Supabase pattern for this scenario.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid()
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.student_applications enable row level security;
alter table public.admins enable row level security;

-- Public (anon) visitors may INSERT a new application and nothing else.
-- In practice the app submits through /api/apply using the service-role
-- key (so it can also run the duplicate check and upload the CV), but this
-- policy is kept as defense-in-depth in case the anon key is ever used to
-- insert directly.
drop policy if exists "Public can insert applications" on public.student_applications;
create policy "Public can insert applications"
  on public.student_applications
  for insert
  to anon, authenticated
  with check (gdpr_consent is true);

-- No public SELECT/UPDATE/DELETE policy exists for anon — RLS defaults to
-- deny, so anonymous visitors cannot read back any application data at all.

-- Authenticated admins can read every application.
drop policy if exists "Admins can read applications" on public.student_applications;
create policy "Admins can read applications"
  on public.student_applications
  for select
  to authenticated
  using (public.is_admin());

-- Authenticated admins can update status/notes (and nothing prevents them
-- editing other fields from the DB side, but the app's UI only exposes
-- status + admin_notes editing).
drop policy if exists "Admins can update applications" on public.student_applications;
create policy "Admins can update applications"
  on public.student_applications
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Admins table: an admin may see the list of fellow admins; nobody may
-- insert/update/delete through the API (manage via SQL editor only).
drop policy if exists "Admins can read admin list" on public.admins;
create policy "Admins can read admin list"
  on public.admins
  for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: private bucket for CVs
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cv-uploads',
  'cv-uploads',
  false,
  5242880, -- 5 MB, mirrors lib/constants.ts MAX_CV_SIZE_BYTES
  array[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No storage.objects policies are added for anon/authenticated on purpose:
-- all reads/writes to this bucket go through the server (service-role key,
-- which bypasses RLS) in app/api/apply/route.ts (upload) and the admin CV
-- link route (signed URL generation). This keeps CVs unreachable by anyone
-- without going through our own authorization checks first.
