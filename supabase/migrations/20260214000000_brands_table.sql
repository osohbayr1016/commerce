CREATE TABLE IF NOT EXISTS public.brands (
  id serial primary key,
  name text not null unique,
  display_order integer default 0,
  created_at timestamptz default now()
);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brands: read" ON public.brands FOR SELECT TO public USING (true);

CREATE POLICY "Brands: admin write" ON public.brands FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
