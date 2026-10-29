-- Interview Hub: tabla de progreso por usuario.
-- Ejecuta este script en Supabase → SQL Editor → New query.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

-- Cada usuario solo puede leer y escribir su propia fila
create policy "Leer mi progreso" on public.user_data
  for select using ((select auth.uid()) = user_id);

create policy "Crear mi progreso" on public.user_data
  for insert with check ((select auth.uid()) = user_id);

create policy "Actualizar mi progreso" on public.user_data
  for update using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
