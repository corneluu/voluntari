-- ═══ PANOUL DE ADMINISTRARE – rulează o singură dată în Supabase → SQL Editor ═══
-- (după supabase.sql). Conținutul cursului, istoricul salvărilor, fotografiile și lista de administratori.
-- Administratorii sunt emailurile din tabelul leaders (aceiași cu coordonatorii).

-- 1. Conținutul cursului: un singur rând ('main') cu tot cursul în JSON. Oricine îl poate citi, doar administratorii îl pot scrie.
create table if not exists public.site_content (
  id         text primary key,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);
alter table public.site_content enable row level security;
drop policy if exists "oricine citește conținutul" on public.site_content;
create policy "oricine citește conținutul" on public.site_content for select using (true);
drop policy if exists "adminii adaugă conținut" on public.site_content;
create policy "adminii adaugă conținut" on public.site_content for insert with check (public.is_leader());
drop policy if exists "adminii modifică conținutul" on public.site_content;
create policy "adminii modifică conținutul" on public.site_content for update using (public.is_leader()) with check (public.is_leader());

-- 2. Istoricul: o copie la fiecare salvare, ca să poți reveni la o versiune veche.
create table if not exists public.site_content_history (
  id       bigint generated always as identity primary key,
  data     jsonb not null,
  saved_at timestamptz not null default now(),
  saved_by text
);
alter table public.site_content_history enable row level security;
drop policy if exists "adminii văd istoricul" on public.site_content_history;
create policy "adminii văd istoricul" on public.site_content_history for select using (public.is_leader());
drop policy if exists "adminii salvează în istoric" on public.site_content_history;
create policy "adminii salvează în istoric" on public.site_content_history for insert with check (public.is_leader());

-- 3. Lista de administratori: doar administratorii o pot vedea și schimba.
drop policy if exists "adminii văd lista" on public.leaders;
create policy "adminii văd lista" on public.leaders for select using (public.is_leader());
drop policy if exists "adminii adaugă admini" on public.leaders;
create policy "adminii adaugă admini" on public.leaders for insert with check (public.is_leader());
drop policy if exists "adminii șterg admini" on public.leaders;
create policy "adminii șterg admini" on public.leaders for delete using (public.is_leader());

-- 4. Fotografiile: un spațiu public „photos”; doar administratorii încarcă sau șterg.
insert into storage.buckets (id, name, public) values ('photos', 'photos', true) on conflict (id) do nothing;
drop policy if exists "oricine vede fotografiile" on storage.objects;
create policy "oricine vede fotografiile" on storage.objects for select using (bucket_id = 'photos');
drop policy if exists "adminii încarcă fotografii" on storage.objects;
create policy "adminii încarcă fotografii" on storage.objects for insert with check (bucket_id = 'photos' and public.is_leader());
drop policy if exists "adminii schimbă fotografii" on storage.objects;
create policy "adminii schimbă fotografii" on storage.objects for update using (bucket_id = 'photos' and public.is_leader());
drop policy if exists "adminii șterg fotografii" on storage.objects;
create policy "adminii șterg fotografii" on storage.objects for delete using (bucket_id = 'photos' and public.is_leader());
