-- Product Variations Support
-- Adds color and material variants to products

-- Add variant columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS colors TEXT[], -- Array of available colors
ADD COLUMN IF NOT EXISTS materials TEXT[], -- Array of available materials
ADD COLUMN IF NOT EXISTS default_color TEXT, -- Default selected color
ADD COLUMN IF NOT EXISTS default_material TEXT; -- Default selected material

-- Create product_variants table for stock tracking per variant
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color TEXT,
  material TEXT,
  size INTEGER,
  sku TEXT UNIQUE,
  stock INTEGER NOT NULL DEFAULT 0,
  price_adjustment NUMERIC DEFAULT 0, -- Additional cost for this variant
  images TEXT[], -- Variant-specific images
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure unique combinations
  UNIQUE(product_id, color, material, size)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_product_variants_active ON product_variants(is_active);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Product variants are viewable by everyone" 
  ON product_variants FOR SELECT 
  USING (true);

CREATE POLICY "Product variants are manageable by admins" 
  ON product_variants FOR ALL 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- Function to get available stock for a variant
CREATE OR REPLACE FUNCTION get_variant_stock(
  p_product_id UUID,
  p_color TEXT DEFAULT NULL,
  p_material TEXT DEFAULT NULL,
  p_size INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
  variant_stock INTEGER;
BEGIN
  -- If no variants exist, return product stock
  IF NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = p_product_id) THEN
    RETURN (SELECT stock FROM products WHERE id = p_product_id);
  END IF;
  
  -- Get variant stock
  SELECT stock INTO variant_stock
  FROM product_variants
  WHERE product_id = p_product_id
    AND (color = p_color OR (color IS NULL AND p_color IS NULL))
    AND (material = p_material OR (material IS NULL AND p_material IS NULL))
    AND (size = p_size OR (size IS NULL AND p_size IS NULL))
    AND is_active = true
  LIMIT 1;
  
  RETURN COALESCE(variant_stock, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get total stock for a product (all variants)
CREATE OR REPLACE FUNCTION get_product_total_stock(p_product_id UUID)
RETURNS INTEGER AS $$
DECLARE
  total_stock INTEGER;
BEGIN
  -- If no variants, return product stock
  IF NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = p_product_id) THEN
    RETURN (SELECT stock FROM products WHERE id = p_product_id);
  END IF;
  
  -- Sum all variant stocks
  SELECT COALESCE(SUM(stock), 0) INTO total_stock
  FROM product_variants
  WHERE product_id = p_product_id
    AND is_active = true;
  
  RETURN total_stock;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_variant_stock TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_product_total_stock TO authenticated, anon;

-- Add comment
COMMENT ON TABLE product_variants IS 'Stores product variations (color, material, size combinations) with individual stock levels';
