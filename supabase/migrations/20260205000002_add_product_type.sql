-- Add product_type for shoes / clothes / beauty workflow
alter table public.products
  add column if not exists product_type text not null default 'shoes'
  check (product_type in ('shoes', 'clothes', 'beauty'));
