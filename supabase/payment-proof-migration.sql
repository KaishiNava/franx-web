-- Jalankan di Supabase SQL Editor untuk mengaktifkan pesanan + upload bukti.
-- Aman dijalankan berulang kali untuk tabel/kolom/bucket ini.
create extension if not exists pgcrypto;

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
  rejection_reason text,
  created_at timestamptz not null default now()
);

alter table public.payment_requests add column if not exists proof_url text;
alter table public.payment_requests add column if not exists rejection_reason text;
alter table public.payment_requests add column if not exists verified_by uuid references auth.users(id) on delete set null;
alter table public.payment_requests add column if not exists verified_at timestamptz;
alter table public.payment_requests enable row level security;

drop policy if exists "payment_requests_read_own" on public.payment_requests;
create policy "payment_requests_read_own" on public.payment_requests
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own" on public.payment_requests
  for insert to authenticated with check (auth.uid() = user_id and status = 'pending' and verified_by is null and verified_at is null);
drop policy if exists "payment_requests_no_client_update" on public.payment_requests;
-- Tidak ada policy UPDATE untuk user biasa. Update bukti/review hanya melalui API server.

create index if not exists payment_requests_status_created_idx
  on public.payment_requests(status, created_at desc);
create index if not exists subscriptions_user_status_idx
  on public.subscriptions(user_id, status);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('payment-proofs', 'payment-proofs', false, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = false, file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg','image/png','image/webp'];
