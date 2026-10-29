-- ═══ BAZA DE DATE – rulează o singură dată în Supabase → SQL Editor ═══
-- Fiecare voluntar își vede și își scrie doar rândul lui. Coordonatorii (tabelul leaders) văd tot.

create table if not exists public.results (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  name    text,
  email   text,
  scores  jsonb not null default '{}',
  updated timestamptz not null default now()
);
alter table public.results enable row level security;

-- Coordonatorii, după email. Nu e citibil din site; se verifică doar prin funcția de mai jos.
create table if not exists public.leaders (email text primary key);
alter table public.leaders enable row level security;

create or replace function public.is_leader() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from leaders where lower(email) = lower(auth.jwt() ->> 'email'));
$$;

create policy "citește propriul rând sau coordonator" on public.results
  for select using (auth.uid() = user_id or public.is_leader());
create policy "adaugă propriul rând" on public.results
  for insert with check (auth.uid() = user_id);
create policy "modifică propriul rând" on public.results
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "coordonatorul poate șterge" on public.results
  for delete using (public.is_leader());

-- Pune aici emailul tău (cel cu care te conectezi pe site):
insert into public.leaders (email) values ('EMAILUL_TAU@gmail.com') on conflict do nothing;
