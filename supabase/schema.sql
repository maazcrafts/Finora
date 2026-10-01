-- Finora PostgreSQL schema
-- Run this in Supabase SQL Editor after creating your project.
-- Firebase Auth remains the identity provider; Supabase trusts Firebase JWTs
-- through the project's Third-party Auth integration.

create table if not exists public.transactions (
  id text primary key,
  user_id text not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(14,2) not null check (amount >= 0),
  category text not null,
  date date not null,
  description text not null,
  notes text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  recurrence jsonb,
  recurrence_id text
);

create index if not exists transactions_user_id_idx on public.transactions(user_id);
create index if not exists transactions_user_date_idx on public.transactions(user_id, date);

create table if not exists public.budgets (
  user_id text primary key,
  budget jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  description text not null,
  type text not null check (type in ('budget', 'insight', 'transaction', 'system')),
  timestamp text not null,
  read boolean not null default false,
  action_url text
);

create index if not exists notifications_user_id_idx on public.notifications(user_id);

create table if not exists public.user_profiles (
  user_id text primary key,
  profile jsonb not null,
  updated_at timestamptz not null default now()
);

-- Every exposed table is protected by Firebase-authenticated JWTs.
alter table public.transactions enable row level security;
alter table public.budgets enable row level security;
alter table public.notifications enable row level security;
alter table public.user_profiles enable row level security;

drop policy if exists "users manage own transactions" on public.transactions;
create policy "users manage own transactions"
on public.transactions
as restrictive
for all
to authenticated
using (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
)
with check (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
);

drop policy if exists "users manage own budgets" on public.budgets;
create policy "users manage own budgets"
on public.budgets
as restrictive
for all
to authenticated
using (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
)
with check (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
);

drop policy if exists "users manage own notifications" on public.notifications;
create policy "users manage own notifications"
on public.notifications
as restrictive
for all
to authenticated
using (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
)
with check (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
);

drop policy if exists "users manage own profile" on public.user_profiles;
create policy "users manage own profile"
on public.user_profiles
as restrictive
for all
to authenticated
using (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
)
with check (
  auth.jwt()->>'iss' = 'https://securetoken.google.com/' || auth.jwt()->>'aud'
  and auth.jwt()->>'sub' = user_id
);

grant select, insert, update, delete on public.transactions to authenticated;
grant select, insert, update, delete on public.budgets to authenticated;
grant select, insert, update, delete on public.notifications to authenticated;
grant select, insert, update, delete on public.user_profiles to authenticated;
