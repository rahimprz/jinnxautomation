-- JinnxAutomation — inquiries schema
-- Run once in the Supabase SQL Editor (or via `psql`) against your project.
-- Safe to re-run: every statement is idempotent.

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  email text not null,
  company text,
  phone text,
  project_type text,
  budget text,
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','qualified','closed')),
  notes text,
  contacted_at timestamptz
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx on public.inquiries (status);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_inquiries_updated_at on public.inquiries;
create trigger trg_inquiries_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

-- Row Level Security is enabled with no policies attached, which denies all
-- access to the anon and authenticated roles by default. The application
-- server talks to this table exclusively with the service_role key, which
-- bypasses RLS. This means even if a browser-side key were ever leaked,
-- inquiries stay unreadable from the client.
alter table public.inquiries enable row level security;
