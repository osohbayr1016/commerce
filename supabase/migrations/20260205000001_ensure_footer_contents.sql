-- Ensure footer_contents table exists (fix "table not found in schema cache")
create table if not exists public.footer_contents (
  id serial primary key,
  section text not null,
  key text not null,
  value text,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(section, key)
);

alter table public.footer_contents enable row level security;

drop policy if exists "Footer: read" on public.footer_contents;
create policy "Footer: read" on public.footer_contents for select to public using (is_active = true);

drop policy if exists "Footer: admin all" on public.footer_contents;
create policy "Footer: admin all" on public.footer_contents for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop trigger if exists footer_contents_updated_at on public.footer_contents;
create trigger footer_contents_updated_at before update on public.footer_contents
  for each row execute procedure public.handle_updated_at();

insert into public.footer_contents (section, key, value, display_order) values
  ('company', 'title', 'E-Commerce', 1),
  ('company', 'description', 'Онлайн худалдааг хөгжүүлэгч платформ', 2),
  ('social', 'facebook_url', '#', 1),
  ('social', 'instagram_url', '#', 2),
  ('help_menu', 'about_text', 'Бидний тухай', 1),
  ('help_menu', 'about_url', '#', 1),
  ('help_menu', 'contact_text', 'Холбоо барих', 2),
  ('help_menu', 'contact_url', '#', 2),
  ('help_menu', 'faq_text', 'Түгээмэл асуултууд', 3),
  ('help_menu', 'faq_url', '#', 3),
  ('contact', 'address', 'Somewhere', 1),
  ('contact', 'phone', '99119911', 2),
  ('contact', 'email', 'test@gmail.com', 3),
  ('bottom_links', 'copyright', 'Developed by Twissu', 1),
  ('bottom_links', 'home_text', 'Нүүр', 2),
  ('bottom_links', 'home_url', '/', 2),
  ('bottom_links', 'categories_text', 'Ангилал', 3),
  ('bottom_links', 'categories_url', '#', 3),
  ('bottom_links', 'sale_text', 'Хямдрал', 4),
  ('bottom_links', 'sale_url', '#', 4),
  ('bottom_links', 'profile_text', 'Профайл', 5),
  ('bottom_links', 'profile_url', '/profile', 5)
on conflict (section, key) do nothing;
