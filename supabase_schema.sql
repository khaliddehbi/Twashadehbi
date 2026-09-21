-- ==============================================================================
-- TWASHA DEHBI - Supabase PostgreSQL Database Setup Script
-- Copiez et collez ce script dans le "SQL Editor" de votre tableau de bord Supabase
-- ==============================================================================

-- 1. Création de la table des commandes
create table if not exists public.orders (
  id text primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text not null,
  customer_phone text not null,
  city text not null,
  address text not null,
  neighborhood text,
  notes text,
  items jsonb not null default '[]'::jsonb,
  subtotal numeric not null default 0,
  delivery_fee numeric default 0,
  discount numeric default 0,
  total numeric not null,
  payment_method text default 'cod',
  status text default 'pending_confirmation',
  status_label text default 'En attente de confirmation par WhatsApp / Téléphone',
  carrier text default 'Amana / Cathedis Express',
  timeline jsonb default '[]'::jsonb
);

-- 2. Activer la sécurité Row Level Security (RLS)
alter table public.orders enable row level security;

-- 3. Politique pour permettre aux clients de passer des commandes (INSERT anonyme)
create policy "Allow public insert to orders"
on public.orders
for insert
to anon, authenticated
with check (true);

-- 4. Politique pour permettre la lecture des commandes (SELECT anonyme / admin)
create policy "Allow public read orders"
on public.orders
for select
to anon, authenticated
using (true);

-- 5. Politique pour permettre la mise à jour des statuts (UPDATE pour le backoffice)
create policy "Allow public update orders"
on public.orders
for update
to anon, authenticated
using (true);

-- 6. Activer le Temps Réel (Supabase Realtime) pour notifier le backoffice instantanément
alter publication supabase_realtime add table public.orders;
