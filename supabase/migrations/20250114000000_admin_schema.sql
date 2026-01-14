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
  ('site_name', 'E-Commerce'),
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
