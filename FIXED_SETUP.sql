-- ==============================================================================
-- FIXED DATABASE SETUP - Correct Order
-- ==============================================================================
-- Copy ALL of this code and run it ONCE in Supabase SQL Editor
-- ==============================================================================

-- Enable extensions
create extension if not exists pgcrypto;

-- ==============================================================================
-- STEP 1: Create base tables FIRST (before functions)
-- ==============================================================================

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  xp integer not null default 0,
  tier_level integer not null default 1,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

-- Tiers table
create table if not exists public.tiers (
  id serial primary key,
  name text not null,
  min_xp integer not null,
  discount_percent integer not null check (discount_percent >= 0 and discount_percent <= 100)
);

-- Categories table
create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  name_en text,
  name_mn text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id integer references public.categories(id) on delete set null,
  title text not null,
  description text,
  price integer not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  images text[] not null default '{}'::text[],
  brand text,
  name_en text,
  name_mn text,
  sku text unique,
  original_price integer,
  discount integer default 0 check (discount >= 0 and discount <= 100),
  sizes integer[] default array[]::integer[],
  brand_color text default '#F5F5F5',
  image_color text default '#FAFAFA',
  subcategory text,
  has_financing boolean default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete restrict,
  total_amount integer not null check (total_amount >= 0),
  status text not null default 'pending',
  earned_xp integer not null default 0 check (earned_xp >= 0),
  created_at timestamptz not null default now()
);

-- Order items table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  size integer,
  price_at_purchase integer not null check (price_at_purchase >= 0),
  created_at timestamptz not null default now()
);

-- Site settings table
create table if not exists public.site_settings (
  id serial primary key,
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

-- ==============================================================================
-- STEP 2: Create functions AFTER tables exist
-- ==============================================================================

-- Admin check function
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- Updated at trigger function
create or replace function public.handle_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- New user trigger function
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''), new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- ==============================================================================
-- STEP 3: Enable Row Level Security on all tables
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.tiers enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.site_settings enable row level security;

-- ==============================================================================
-- STEP 4: Create policies (now that is_admin() function exists)
-- ==============================================================================

-- Profiles policies
drop policy if exists "Profiles: read own" on public.profiles;
create policy "Profiles: read own" on public.profiles for select to authenticated using (id = auth.uid());
drop policy if exists "Profiles: update own" on public.profiles;
create policy "Profiles: update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Tiers policies
drop policy if exists "Tiers: read" on public.tiers;
create policy "Tiers: read" on public.tiers for select to public using (true);
drop policy if exists "Tiers: admin write" on public.tiers;
create policy "Tiers: admin write" on public.tiers for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Categories policies
drop policy if exists "Categories: read" on public.categories;
create policy "Categories: read" on public.categories for select to public using (true);
drop policy if exists "Categories: admin write" on public.categories;
create policy "Categories: admin write" on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Products policies
drop policy if exists "Products: read" on public.products;
create policy "Products: read" on public.products for select to public using (true);
drop policy if exists "Products: admin insert" on public.products;
create policy "Products: admin insert" on public.products for insert to authenticated with check (public.is_admin());
drop policy if exists "Products: admin update" on public.products;
create policy "Products: admin update" on public.products for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Products: admin delete" on public.products;
create policy "Products: admin delete" on public.products for delete to authenticated using (public.is_admin());

-- Orders policies
drop policy if exists "Orders: read own" on public.orders;
create policy "Orders: read own" on public.orders for select to authenticated using (user_id = auth.uid() or public.is_admin());
drop policy if exists "Orders: create own" on public.orders;
create policy "Orders: create own" on public.orders for insert to authenticated with check (user_id = auth.uid());
drop policy if exists "Orders: admin update" on public.orders;
create policy "Orders: admin update" on public.orders for update to authenticated using (public.is_admin()) with check (public.is_admin());

-- Order items policies
drop policy if exists "OrderItems: read" on public.order_items;
create policy "OrderItems: read" on public.order_items for select to authenticated 
  using (exists (
    select 1 from public.orders o 
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
drop policy if exists "OrderItems: admin write" on public.order_items;
create policy "OrderItems: admin write" on public.order_items for all to authenticated 
  using (public.is_admin()) with check (public.is_admin());

-- Site settings policies
drop policy if exists "Settings: read" on public.site_settings;
create policy "Settings: read" on public.site_settings for select to public using (true);
drop policy if exists "Settings: admin write" on public.site_settings;
create policy "Settings: admin write" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ==============================================================================
-- STEP 5: Create triggers
-- ==============================================================================

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products for each row execute procedure public.handle_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings for each row execute procedure public.handle_updated_at();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- STEP 6: Insert default data
-- ==============================================================================

insert into public.site_settings (key, value) values
  ('site_name', 'shoez.mn'),
  ('site_description', 'Women''s shoes and bags')
on conflict (key) do nothing;

-- ==============================================================================
-- ✅ DATABASE SETUP COMPLETE!
-- ==============================================================================
-- Tables created: profiles, tiers, categories, products, orders, order_items, site_settings
-- Functions created: is_admin(), handle_updated_at(), handle_new_user()
-- Policies: All RLS policies configured
-- 
-- Next steps:
-- 1. Go to http://localhost:3000/admin/seed
-- 2. Click "Шинэ өгөгдөл нэмэх" to add sample products
-- 3. Start using the admin dashboard!
-- ==============================================================================
