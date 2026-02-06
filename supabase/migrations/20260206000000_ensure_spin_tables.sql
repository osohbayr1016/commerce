-- Ensure spin_products and spin_history exist (for admin spin management and spin wheel)
-- Safe to run even if 20260122100000_spin_wheel_system.sql was not applied

CREATE TABLE IF NOT EXISTS public.spin_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  display_name TEXT,
  image_url TEXT,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id)
);

CREATE INDEX IF NOT EXISTS idx_spin_products_active ON public.spin_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_spin_products_product ON public.spin_products(product_id);

CREATE TABLE IF NOT EXISTS public.spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spin_product_id UUID NOT NULL REFERENCES public.spin_products(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  amount_paid INTEGER NOT NULL DEFAULT 100000,
  payment_method TEXT DEFAULT 'mnt',
  won_at TIMESTAMPTZ DEFAULT now(),
  added_to_cart BOOLEAN DEFAULT false,
  cart_id UUID,
  spin_session_id TEXT,
  ip_address TEXT,
  user_agent TEXT
);

CREATE INDEX IF NOT EXISTS idx_spin_history_user ON public.spin_history(user_id);
CREATE INDEX IF NOT EXISTS idx_spin_history_won_at ON public.spin_history(won_at DESC);
CREATE INDEX IF NOT EXISTS idx_spin_history_user_date ON public.spin_history(user_id, won_at DESC);

ALTER TABLE public.spin_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage spin products" ON public.spin_products;
CREATE POLICY "Admins can manage spin products"
  ON public.spin_products FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Anyone can view active spin products" ON public.spin_products;
CREATE POLICY "Anyone can view active spin products"
  ON public.spin_products FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Users can view own spin history" ON public.spin_history;
CREATE POLICY "Users can view own spin history"
  ON public.spin_history FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own spin history" ON public.spin_history;
CREATE POLICY "Users can insert own spin history"
  ON public.spin_history FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all spin history" ON public.spin_history;
CREATE POLICY "Admins can view all spin history"
  ON public.spin_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- Trigger for updated_at on spin_products
CREATE OR REPLACE FUNCTION public.update_spin_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_spin_products_updated_at ON public.spin_products;
CREATE TRIGGER trg_spin_products_updated_at
  BEFORE UPDATE ON public.spin_products
  FOR EACH ROW EXECUTE PROCEDURE public.update_spin_products_updated_at();
