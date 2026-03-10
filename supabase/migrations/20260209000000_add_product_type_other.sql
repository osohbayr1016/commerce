-- Ensure product_type column exists (in case add_product_type migration was not run)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'shoes';

-- Drop existing check constraint if any (name may vary by Postgres version)
ALTER TABLE public.products
  DROP CONSTRAINT IF EXISTS products_product_type_check;

-- Allow "other" (бусад) in product_type
ALTER TABLE public.products
  ADD CONSTRAINT products_product_type_check
  CHECK (product_type IN ('shoes', 'clothes', 'beauty', 'other'));
