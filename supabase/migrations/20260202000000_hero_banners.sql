create table if not exists public.hero_banners (
    id uuid not null default gen_random_uuid(),
    image_url text not null,
    title text,
    description text,
    link text,
    sort_order integer default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    constraint hero_banners_pkey primary key (id)
);

-- Enable RLS
alter table public.hero_banners enable row level security;

-- Policies
create policy "Allow public read access"
    on public.hero_banners for select
    using (true);

create policy "Allow admin full access"
    on public.hero_banners for all
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Trigger to set updated_at (no extension required)
create or replace function public.hero_banners_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;
drop trigger if exists handle_updated_at on public.hero_banners;
create trigger handle_updated_at before update on public.hero_banners
    for each row execute procedure public.hero_banners_updated_at();
