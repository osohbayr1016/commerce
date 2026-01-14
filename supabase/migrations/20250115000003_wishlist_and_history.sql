-- ============================================
-- Wishlist and Recently Viewed Products
-- ============================================

-- Table for wishlist/saved products
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Table for recently viewed products
CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" 
  ON public.wishlist FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can add to own wishlist" 
  ON public.wishlist FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove from own wishlist" 
  ON public.wishlist FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Product views policies
CREATE POLICY "Users can view own history" 
  ON public.product_views FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Anyone can record views" 
  ON public.product_views FOR INSERT 
  TO public 
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON public.wishlist(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_user ON public.product_views(user_id);
CREATE INDEX IF NOT EXISTS idx_product_views_product ON public.product_views(product_id);
CREATE INDEX IF NOT EXISTS idx_product_views_session ON public.product_views(session_id);
CREATE INDEX IF NOT EXISTS idx_product_views_viewed_at ON public.product_views(viewed_at DESC);

-- Function to cleanup old views (keep last 50 per user)
CREATE OR REPLACE FUNCTION public.cleanup_old_views()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM public.product_views
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id FROM public.product_views
    WHERE user_id = NEW.user_id
    ORDER BY viewed_at DESC
    LIMIT 50
  );
  RETURN NEW;
END;
$$;

-- Trigger to auto-cleanup
DROP TRIGGER IF EXISTS trigger_cleanup_views ON public.product_views;
CREATE TRIGGER trigger_cleanup_views
  AFTER INSERT ON public.product_views
  FOR EACH ROW
  EXECUTE FUNCTION public.cleanup_old_views();

-- ============================================
-- Verification
-- ============================================
SELECT 'Wishlist and Product Views tables created!' as status;
