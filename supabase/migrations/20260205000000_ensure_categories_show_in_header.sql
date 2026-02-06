-- Ensure show_in_header exists on categories (fix schema cache error)
alter table public.categories
  add column if not exists show_in_header boolean default false;
