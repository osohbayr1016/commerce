-- Ensure product_variants table exists (in case 20260117000002 was not applied).
-- Required by admin products API and decrement_product_stock_on_order.

CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  color text,
  material text,
  size integer,
  sku text UNIQUE,
  stock integer NOT NULL DEFAULT 0,
  price_adjustment numeric DEFAULT 0,
  images text[],
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(product_id, color, material, size)
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON public.product_variants(sku) WHERE sku IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON public.product_variants(is_active) WHERE is_active = true;

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Product variants are viewable by everyone" ON public.product_variants;
CREATE POLICY "Product variants are viewable by everyone"
  ON public.product_variants FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Product variants are manageable by admins" ON public.product_variants;
CREATE POLICY "Product variants are manageable by admins"
  ON public.product_variants FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

COMMENT ON TABLE public.product_variants IS 'Stores product variations (color, material, size) with per-variant stock';
