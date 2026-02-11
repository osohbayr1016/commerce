-- ============================================
-- Wishlist table (run in Supabase SQL Editor)
-- ============================================

-- Table: one row per user per product
CREATE TABLE IF NOT EXISTS public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- RLS
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running (optional)
DROP POLICY IF EXISTS "Users can view own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can add to own wishlist" ON public.wishlist;
DROP POLICY IF EXISTS "Users can remove from own wishlist" ON public.wishlist;

-- Policies (authenticated users only)
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON public.wishlist(product_id);

-- Notify Supabase to refresh schema cache
NOTIFY pgrst, 'reload schema';
