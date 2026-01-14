# Database Setup - Fix "Table not found" Error

## Error: "Could not find the table 'public.products' in the schema cache"

This means your Supabase database tables haven't been created yet. Follow these steps:

## Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Run Migration 1 (Base Schema)

Copy ALL the code below and paste into the SQL Editor, then click **Run**:

```sql
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
```

### Step 3: Run Migration 2 (Admin Features)

Create another **"New Query"**, paste this code, and click **Run**:

```sql
-- Add site_settings table for dynamic configuration
create table if not exists public.site_settings (
  id serial primary key,
  key text not null unique,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
create policy "Settings: read" on public.site_settings for select to public using (true);
create policy "Settings: admin write" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Insert default site settings
insert into public.site_settings (key, value) values
  ('site_name', 'shoez.mn'),
  ('site_description', 'Women''s shoes and bags')
on conflict (key) do nothing;

-- Extend products table with e-commerce specific fields
alter table public.products 
  add column if not exists brand text,
  add column if not exists name_en text,
  add column if not exists name_mn text,
  add column if not exists sku text unique,
  add column if not exists original_price integer,
  add column if not exists discount integer default 0 check (discount >= 0 and discount <= 100),
  add column if not exists sizes integer[] default array[]::integer[],
  add column if not exists brand_color text default '#F5F5F5',
  add column if not exists image_color text default '#FAFAFA',
  add column if not exists subcategory text,
  add column if not exists has_financing boolean default false,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

-- Add trigger to update updated_at on products
create or replace function public.handle_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on public.products;
create trigger products_updated_at before update on public.products
  for each row execute procedure public.handle_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
  for each row execute procedure public.handle_updated_at();

-- Add order_items table to track individual products in orders
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  size integer,
  price_at_purchase integer not null check (price_at_purchase >= 0),
  created_at timestamptz not null default now()
);

alter table public.order_items enable row level security;
create policy "OrderItems: read" on public.order_items for select to authenticated 
  using (exists (
    select 1 from public.orders o 
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));
create policy "OrderItems: admin write" on public.order_items for all to authenticated 
  using (public.is_admin()) with check (public.is_admin());

-- Update categories table to add more fields
alter table public.categories
  add column if not exists name_en text,
  add column if not exists name_mn text,
  add column if not exists display_order integer default 0,
  add column if not exists is_active boolean default true,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

drop trigger if exists categories_updated_at on public.categories;
create trigger categories_updated_at before update on public.categories
  for each row execute procedure public.handle_updated_at();
```

### Step 4: Verify Tables Created

1. In Supabase, click **"Table Editor"**
2. You should see these tables:
   - ✓ products
   - ✓ categories
   - ✓ site_settings
   - ✓ orders
   - ✓ order_items
   - ✓ profiles

### Step 5: Add Sample Data (Optional)

Go to http://localhost:3000/admin/seed and click "Шинэ өгөгдөл нэмэх" to add sample products.

## Troubleshooting

### If migrations fail:

**Error: "relation already exists"**
- This is OK, it means some tables are already created
- Continue with the next migration

**Error: "permission denied"**
- Make sure you're using the SQL Editor in Supabase Dashboard
- Not the Query Editor

### If still getting "table not found":

1. Check `.env.local` file exists with:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_actual_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_key
   ```

2. Restart your dev server:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

3. Check the Table Editor in Supabase to confirm tables exist

## Success!

After running both migrations, you should be able to:
- ✅ Create new products
- ✅ Create new categories
- ✅ Change website settings
- ✅ View orders

The error "Could not find the table 'public.products'" will be gone!
