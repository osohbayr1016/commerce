-- Ensure products has colors column (required by admin API)
-- If 20260117000002_product_variations was not applied, this adds it.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS colors text[] DEFAULT '{}'::text[];

COMMENT ON COLUMN public.products.colors IS 'Array of available color names for variant UI';
