-- Add name_ru, name_zh, name_it to categories
alter table public.categories
  add column if not exists name_ru text,
  add column if not exists name_zh text,
  add column if not exists name_it text;

-- Add name_ru, name_zh, name_it to products
alter table public.products
  add column if not exists name_ru text,
  add column if not exists name_zh text,
  add column if not exists name_it text;

-- Add description per language to products
alter table public.products
  add column if not exists description_en text,
  add column if not exists description_mn text,
  add column if not exists description_ru text,
  add column if not exists description_zh text,
  add column if not exists description_it text;

-- Backfill: copy existing description to description_mn and description_en
update public.products
set
  description_mn = coalesce(description_mn, description),
  description_en = coalesce(description_en, description)
where description is not null and description != '';
