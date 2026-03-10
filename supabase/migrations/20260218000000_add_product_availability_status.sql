-- Add availability status to products (Захиалгаар ирэх / бэлэн байгаа)
alter table public.products
  add column if not exists availability_status text
  check (availability_status is null or availability_status in ('order', 'in_stock'));

comment on column public.products.availability_status is 'order = Захиалгаар ирэх, in_stock = бэлэн байгаа';
