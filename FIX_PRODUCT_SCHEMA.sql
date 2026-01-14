-- ============================================
-- FIX PRODUCT SCHEMA - Remove title requirement
-- ============================================
-- This fixes the "title cannot be null" error

-- Option 1: Make title nullable (recommended)
ALTER TABLE public.products 
ALTER COLUMN title DROP NOT NULL;

-- Option 2: Set default value for title
ALTER TABLE public.products 
ALTER COLUMN title SET DEFAULT '';

-- Option 3: Add trigger to auto-generate title from name_en or name_mn
CREATE OR REPLACE FUNCTION public.auto_generate_product_title()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If title is null, use name_en or name_mn
  IF NEW.title IS NULL THEN
    NEW.title = COALESCE(NEW.name_en, NEW.name_mn, 'Untitled Product');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_auto_title ON public.products;
CREATE TRIGGER trigger_auto_title
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_product_title();

-- Verify the change
SELECT column_name, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name = 'title';

-- ============================================
-- DONE! Now you can create products without title
-- ============================================
