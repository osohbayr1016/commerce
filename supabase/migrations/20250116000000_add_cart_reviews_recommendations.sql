-- ============================================
-- Cart Items, Reviews, and Recommendations
-- ============================================

-- Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  size INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- Enable RLS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Cart Items policies
CREATE POLICY "Users can view own cart" 
  ON public.cart_items FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to own cart" 
  ON public.cart_items FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cart" 
  ON public.cart_items FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove from own cart" 
  ON public.cart_items FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Indexes for cart_items
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_product ON public.cart_items(product_id);

-- Product Reviews Table
CREATE TABLE IF NOT EXISTS public.product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

-- Enable RLS
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Product Reviews policies
CREATE POLICY "Anyone can view reviews" 
  ON public.product_reviews FOR SELECT 
  TO public 
  USING (true);

CREATE POLICY "Users can add own review" 
  ON public.product_reviews FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own review" 
  ON public.product_reviews FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own review" 
  ON public.product_reviews FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Indexes for product_reviews
CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON public.product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user ON public.product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON public.product_reviews(rating);

-- Add trigger to update updated_at on cart_items
CREATE OR REPLACE FUNCTION public.handle_cart_items_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS cart_items_updated_at ON public.cart_items;
CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE PROCEDURE public.handle_cart_items_updated_at();

-- Add trigger to update updated_at on product_reviews
CREATE OR REPLACE FUNCTION public.handle_product_reviews_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS product_reviews_updated_at ON public.product_reviews;
CREATE TRIGGER product_reviews_updated_at BEFORE UPDATE ON public.product_reviews
  FOR EACH ROW EXECUTE PROCEDURE public.handle_product_reviews_updated_at();

-- Add indexes for filtering performance
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand) WHERE brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_products_stock ON public.products(stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_discount ON public.products(discount) WHERE discount > 0;

-- Function to check if user purchased a product (for review validation)
CREATE OR REPLACE FUNCTION public.has_user_purchased_product(
  p_user_id UUID,
  p_product_id UUID
) RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.user_id = p_user_id
      AND oi.product_id = p_product_id
      AND o.status IN ('confirmed', 'delivered')
  );
$$;

-- Function to get product average rating
CREATE OR REPLACE FUNCTION public.get_product_avg_rating(
  p_product_id UUID
) RETURNS NUMERIC
LANGUAGE sql STABLE
AS $$
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
  FROM public.product_reviews
  WHERE product_id = p_product_id;
$$;

-- Function to get product review count
CREATE OR REPLACE FUNCTION public.get_product_review_count(
  p_product_id UUID
) RETURNS INTEGER
LANGUAGE sql STABLE
AS $$
  SELECT COUNT(*)
  FROM public.product_reviews
  WHERE product_id = p_product_id;
$$;
