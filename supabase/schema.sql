-- Jalankan di Supabase SQL Editor setelah membuat project.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.plans (
  id text primary key check (id in ('A','B','C','D')),
  name text not null,
  duration_days integer not null check (duration_days > 0),
  ram_mb integer not null check (ram_mb > 0),
  price_idr integer not null default 0 check (price_idr >= 0),
  features jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null references public.plans(id),
  status text not null default 'pending' check (status in ('pending','active','expired','cancelled','failed')),
  starts_at timestamptz,
  expires_at timestamptz,
  payment_provider text,
  payment_reference text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.bot_instances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  display_name text not null default 'Bot Saya',
  template_key text not null default 'franxx-md',
  runtime_provider text not null default 'mock' check (runtime_provider in ('mock','pterodactyl')),
  runtime_id text,
  status text not null default 'provisioning' check (status in ('provisioning','stopped','starting','running','stopping','error','expired')),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payment_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null,
  provider_event_id text not null,
  payload jsonb not null default '{}'::jsonb,
  processed_at timestamptz,
  created_at timestamptz not null default now(),
  unique(provider, provider_event_id)
);

alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.bot_instances enable row level security;
alter table public.payment_events enable row level security;

create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy "plans_read_active" on public.plans for select to authenticated using (is_active = true);
create policy "subscriptions_read_own" on public.subscriptions for select to authenticated using (auth.uid() = user_id);
create policy "instances_read_own" on public.bot_instances for select to authenticated using (auth.uid() = user_id);
create policy "instances_update_own_config_only" on public.bot_instances for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- IMPORTANT:
-- Do not add client-side INSERT policies for subscriptions or payment_events.
-- Trusted server-side code must validate payment webhooks and provision instances.
-- For bot_instances, production should replace the broad UPDATE policy with a safe
-- server endpoint that allowlists editable config keys and enforces package features.
-- Never expose SUPABASE_SERVICE_ROLE_KEY in browser/client variables.

-- Permintaan pembayaran manual (GoPay, DANA, QRIS). Jalankan blok ini
-- jika project Supabase sudah memakai schema lama.
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null check (plan_id in ('A','B','C','D')),
  amount_idr integer not null check (amount_idr > 0),
  payment_method text not null check (payment_method in ('gopay','dana','qris')),
  status text not null default 'pending' check (status in ('pending','awaiting_review','paid','rejected','cancelled')),
  reference text not null unique,
  proof_url text,
  verified_by uuid references auth.users(id) on delete set null,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.payment_requests enable row level security;
drop policy if exists "payment_requests_read_own" on public.payment_requests;
create policy "payment_requests_read_own" on public.payment_requests for select to authenticated using (auth.uid() = user_id);
drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests for insert to authenticated with check (auth.uid() = user_id and status = 'pending' and verified_by is null and verified_at is null);
drop policy if exists "payment_requests_no_client_update" on public.payment_requests;
-- Tidak membuat policy UPDATE untuk user. Verifikasi harus dilakukan server/admin.

-- Harga resmi FRANXX JADIBOT (resource/RAM tetap harus ditetapkan terpisah).
insert into public.plans (id, name, duration_days, ram_mb, price_idr, features, is_active) values
  ('A','Premium Basic',7,3072,7500,'["Pengaturan bot dasar","Status dan log dasar","Pengelolaan satu instance"]'::jsonb,true),
  ('B','Premium Full',14,6144,14000,'["Semua fitur Basic","Kontrol konfigurasi lanjutan","Pemantauan instance"]'::jsonb,true),
  ('C','Enterprise',30,8192,21000,'["Fitur paket sebelumnya","Batas resource sesuai paket","Prioritas pengelolaan"]'::jsonb,true),
  ('D','Owner Unlimited',30,12288,30000,'["Semua fitur yang tersedia","Kelola plugin bot","Watermark kustom","Kontrol bot tingkat lanjut"]'::jsonb,true)
on conflict (id) do update set name=excluded.name, duration_days=excluded.duration_days, price_idr=excluded.price_idr, features=excluded.features, is_active=excluded.is_active;

-- Kolom tambahan untuk panel review admin. Aman dijalankan pada schema yang sudah ada.
alter table public.payment_requests add column if not exists rejection_reason text;
create index if not exists payment_requests_status_created_idx on public.payment_requests(status, created_at desc);
create index if not exists subscriptions_user_status_idx on public.subscriptions(user_id, status);
