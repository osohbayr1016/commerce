-- Add show_in_header field to categories for navigation display
alter table public.categories
  add column if not exists show_in_header boolean default false;

-- Update existing categories to show in header if they have low display_order
update public.categories
set show_in_header = true
where display_order < 5 and is_active = true;
