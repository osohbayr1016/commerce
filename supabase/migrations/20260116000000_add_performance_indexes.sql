-- Add performance indexes for common queries
-- This migration adds indexes to improve query performance

-- Products table indexes
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand) WHERE brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_discount ON public.products(discount DESC) WHERE discount IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock) WHERE stock > 0;
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id) WHERE category_id IS NOT NULL;

-- Orders table indexes
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- Product reviews indexes (if not already created)
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating_desc ON public.product_reviews(rating DESC);

-- Order items indexes
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON public.order_items(product_id);

-- Composite indexes for common filter combinations
CREATE INDEX IF NOT EXISTS idx_products_category_price ON public.products(category_id, price) WHERE category_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_brand_price ON public.products(brand, price) WHERE brand IS NOT NULL;

-- Full-text search index for product names
CREATE INDEX IF NOT EXISTS idx_products_name_en_trgm ON public.products USING gin(name_en gin_trgm_ops) WHERE name_en IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_name_mn_trgm ON public.products USING gin(name_mn gin_trgm_ops) WHERE name_mn IS NOT NULL;

-- Enable pg_trgm extension for better text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Verification
SELECT 'Performance indexes created successfully!' as status;
