-- ═══ ISTORICUL VOLUNTARILOR – rulează o singură dată în Supabase → SQL Editor (după supabase.sql) ═══
-- Fiecare test dat și fiecare lecție citită până la capăt devin un rând. Voluntarul își scrie doar rândurile lui;
-- administratorii le văd pe toate. Foaia Google le copiază de aici.

create table if not exists public.activity (
  id           bigint generated always as identity primary key,
  user_id      uuid not null default auth.uid() references auth.users on delete cascade,
  email        text,
  name         text,
  lesson_id    text,
  lesson_title text,
  kind         text not null check (kind in ('test', 'read')),
  score        int,
  total        int,
  passed       boolean,
  at           timestamptz not null default now()
);
create index if not exists activity_at on public.activity (at);
alter table public.activity enable row level security;

drop policy if exists "voluntarul își adaugă istoricul" on public.activity;
create policy "voluntarul își adaugă istoricul" on public.activity for insert with check (auth.uid() = user_id);
drop policy if exists "istoricul propriu sau administrator" on public.activity;
create policy "istoricul propriu sau administrator" on public.activity for select using (auth.uid() = user_id or public.is_leader());
drop policy if exists "administratorii șterg istoric" on public.activity;
create policy "administratorii șterg istoric" on public.activity for delete using (public.is_leader());
