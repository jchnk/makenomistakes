-- Make No Mistakes — landing signups
-- Run in Supabase SQL Editor.

create table if not exists public.signups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  track       text not null check (track in (
                'AI-Native Software',
                'Local & On-Device AI',
                'Physical AI & Robotics',
                'Model Training'
              )),
  created_at  timestamptz not null default now(),
  source      text default 'landing',
  user_agent  text
);

-- one row per email (used to detect duplicates -> unique violation 23505)
create unique index if not exists signups_email_unique
  on public.signups (lower(email));

-- Row Level Security: lock the table down.
alter table public.signups enable row level security;

-- No public client access. Inserts happen server-side with the
-- service_role key (Route Handler / Server Action), which bypasses RLS.
-- (Intentionally NO insert/select policy for anon or authenticated.)
