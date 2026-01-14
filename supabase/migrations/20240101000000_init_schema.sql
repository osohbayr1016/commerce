create extension if not exists pgcrypto;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  xp integer not null default 0,
  tier_level integer not null default 1,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "Profiles: read own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "Profiles: update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

create table if not exists public.tiers (
  id serial primary key, name text not null, min_xp integer not null,
  discount_percent integer not null check (discount_percent >= 0 and discount_percent <= 100)
);
alter table public.tiers enable row level security;
create policy "Tiers: read" on public.tiers for select to public using (true);
create policy "Tiers: admin write" on public.tiers for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.categories (
  id serial primary key, name text not null, slug text not null unique
);
alter table public.categories enable row level security;
create policy "Categories: read" on public.categories for select to public using (true);
create policy "Categories: admin write" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id integer references public.categories(id) on delete set null,
  title text not null, description text,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}'::text[]
);
alter table public.products enable row level security;
create policy "Products: read" on public.products for select to public using (true);
create policy "Products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
create policy "Products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Products: admin delete" on public.products for delete to authenticated using (public.is_admin());

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'pending',
  earned_xp integer not null default 0 check (earned_xp >= 0),
  created_at timestamptz not null default now()
);
alter table public.orders enable row level security;
create policy "Orders: read own" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy "Orders: create own" on public.orders for insert to authenticated with check (user_id = auth.uid());
create policy "Orders: admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
