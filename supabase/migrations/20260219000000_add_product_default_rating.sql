-- Add default rating (1-5) for products, set by admin when creating product
alter table public.products
  add column if not exists default_rating numeric(2,1)
  check (default_rating is null or (default_rating >= 1 and default_rating <= 5));

comment on column public.products.default_rating is 'Admin-set rating 1-5, shown when no user reviews exist';
