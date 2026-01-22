-- =====================================================
-- LUCKY SPIN WHEEL SYSTEM
-- =====================================================
-- Description: 100,000 MNT daily spin wheel with random product rewards
-- Features:
--   - Admin manages spin products
--   - Users spin once per day for 100k MNT
--   - 100% random selection
--   - Won product auto-added to cart
-- =====================================================

-- =====================================================
-- 1. SPIN PRODUCTS TABLE
-- =====================================================
-- Products available in the spin wheel
CREATE TABLE IF NOT EXISTS public.spin_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  display_name TEXT, -- Optional custom name for spin wheel
  image_url TEXT, -- Optional custom image
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Ensure no duplicate products in active spin
  UNIQUE(product_id)
);

-- Index for quick active products lookup
CREATE INDEX idx_spin_products_active ON public.spin_products(is_active) WHERE is_active = true;
CREATE INDEX idx_spin_products_product ON public.spin_products(product_id);

-- =====================================================
-- 2. SPIN HISTORY TABLE
-- =====================================================
-- Track all spin attempts and results
CREATE TABLE IF NOT EXISTS public.spin_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spin_product_id UUID NOT NULL REFERENCES public.spin_products(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  amount_paid INTEGER NOT NULL DEFAULT 100000, -- 100k MNT
  payment_method TEXT DEFAULT 'mnt', -- 'mnt' or 'coin'
  won_at TIMESTAMPTZ DEFAULT now(),
  added_to_cart BOOLEAN DEFAULT false,
  cart_id UUID REFERENCES public.carts(id),
  
  -- Metadata
  spin_session_id TEXT, -- For analytics
  ip_address TEXT,
  user_agent TEXT
);

-- Indexes for performance
CREATE INDEX idx_spin_history_user ON public.spin_history(user_id);
CREATE INDEX idx_spin_history_won_at ON public.spin_history(won_at DESC);
CREATE INDEX idx_spin_history_user_date ON public.spin_history(user_id, won_at DESC);

-- =====================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.spin_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spin_history ENABLE ROW LEVEL SECURITY;

-- Spin Products Policies
-- Admin can manage all
CREATE POLICY "Admins can manage spin products"
  ON public.spin_products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Anyone can view active products
CREATE POLICY "Anyone can view active spin products"
  ON public.spin_products
  FOR SELECT
  USING (is_active = true);

-- Spin History Policies
-- Users can view their own history
CREATE POLICY "Users can view own spin history"
  ON public.spin_history
  FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own spin results
CREATE POLICY "Users can insert own spin history"
  ON public.spin_history
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can view all history
CREATE POLICY "Admins can view all spin history"
  ON public.spin_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- 4. FUNCTIONS
-- =====================================================

-- Function: Check if user can spin today
CREATE OR REPLACE FUNCTION can_user_spin_today(p_user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_last_spin TIMESTAMPTZ;
  v_active_products_count INTEGER;
  v_user_coin_balance INTEGER;
  v_can_spin BOOLEAN := false;
  v_reason TEXT := '';
  v_next_spin_at TIMESTAMPTZ;
BEGIN
  -- Check if there are active products
  SELECT COUNT(*) INTO v_active_products_count
  FROM public.spin_products
  WHERE is_active = true;
  
  IF v_active_products_count = 0 THEN
    RETURN jsonb_build_object(
      'can_spin', false,
      'reason', 'Одоогоор spin бүтээгдэхүүн алга байна',
      'last_spin_at', NULL,
      'next_spin_at', NULL,
      'active_products_count', 0
    );
  END IF;
  
  -- Get user's coin balance
  SELECT coin_balance INTO v_user_coin_balance
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Check if user has enough balance (100k MNT = 100 coins)
  IF v_user_coin_balance < 100 THEN
    RETURN jsonb_build_object(
      'can_spin', false,
      'reason', 'Хангалтгүй данс (100 coin шаардлагатай)',
      'required_coins', 100,
      'current_balance', v_user_coin_balance,
      'active_products_count', v_active_products_count
    );
  END IF;
  
  -- Check last spin time (today in user's timezone - assuming UTC+8 for Mongolia)
  SELECT MAX(won_at) INTO v_last_spin
  FROM public.spin_history
  WHERE user_id = p_user_id
    AND won_at > CURRENT_DATE AT TIME ZONE 'Asia/Ulaanbaatar';
  
  IF v_last_spin IS NOT NULL THEN
    -- Already spun today
    v_next_spin_at := (CURRENT_DATE AT TIME ZONE 'Asia/Ulaanbaatar') + INTERVAL '1 day';
    
    RETURN jsonb_build_object(
      'can_spin', false,
      'reason', 'Та өнөөдөр аль хэдийн spin эргүүлсэн байна',
      'last_spin_at', v_last_spin,
      'next_spin_at', v_next_spin_at,
      'active_products_count', v_active_products_count
    );
  END IF;
  
  -- User can spin!
  RETURN jsonb_build_object(
    'can_spin', true,
    'reason', 'Spin эргүүлэх боломжтой',
    'last_spin_at', v_last_spin,
    'next_spin_at', NULL,
    'active_products_count', v_active_products_count,
    'cost_coins', 100
  );
END;
$$;

-- Function: Perform spin and select random product
CREATE OR REPLACE FUNCTION perform_spin(
  p_user_id UUID,
  p_session_id TEXT DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_eligibility jsonb;
  v_can_spin BOOLEAN;
  v_selected_spin_product RECORD;
  v_spin_history_id UUID;
  v_cart_id UUID;
  v_new_balance INTEGER;
BEGIN
  -- 1. Check eligibility
  v_eligibility := can_user_spin_today(p_user_id);
  v_can_spin := (v_eligibility->>'can_spin')::BOOLEAN;
  
  IF NOT v_can_spin THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', v_eligibility->>'reason',
      'eligibility', v_eligibility
    );
  END IF;
  
  -- 2. Deduct coins (100 coins = 100,000 MNT)
  UPDATE public.profiles
  SET coin_balance = coin_balance - 100,
      updated_at = now()
  WHERE id = p_user_id
  RETURNING coin_balance INTO v_new_balance;
  
  IF v_new_balance IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Coin хасах үед алдаа гарлаа'
    );
  END IF;
  
  -- 3. Select random product (100% random, equal probability)
  SELECT sp.*, p.name as product_name, p.price as product_price, p.image_url as product_image
  INTO v_selected_spin_product
  FROM public.spin_products sp
  JOIN public.products p ON sp.product_id = p.id
  WHERE sp.is_active = true
  ORDER BY RANDOM()
  LIMIT 1;
  
  IF v_selected_spin_product IS NULL THEN
    -- Rollback coin deduction
    UPDATE public.profiles
    SET coin_balance = coin_balance + 100
    WHERE id = p_user_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Идэвхтэй бүтээгдэхүүн олдсонгүй'
    );
  END IF;
  
  -- 4. Get or create user's cart
  SELECT id INTO v_cart_id
  FROM public.carts
  WHERE user_id = p_user_id
  LIMIT 1;
  
  IF v_cart_id IS NULL THEN
    INSERT INTO public.carts (user_id)
    VALUES (p_user_id)
    RETURNING id INTO v_cart_id;
  END IF;
  
  -- 5. Add product to cart (or increment quantity if exists)
  INSERT INTO public.cart_items (cart_id, product_id, quantity)
  VALUES (v_cart_id, v_selected_spin_product.product_id, 1)
  ON CONFLICT (cart_id, product_id)
  DO UPDATE SET quantity = cart_items.quantity + 1;
  
  -- 6. Record spin history
  INSERT INTO public.spin_history (
    user_id,
    spin_product_id,
    product_id,
    amount_paid,
    payment_method,
    added_to_cart,
    cart_id,
    spin_session_id,
    ip_address,
    user_agent
  )
  VALUES (
    p_user_id,
    v_selected_spin_product.id,
    v_selected_spin_product.product_id,
    100000,
    'coin',
    true,
    v_cart_id,
    p_session_id,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_spin_history_id;
  
  -- 7. Return success with product details
  RETURN jsonb_build_object(
    'success', true,
    'spin_history_id', v_spin_history_id,
    'won_product', jsonb_build_object(
      'id', v_selected_spin_product.product_id,
      'name', COALESCE(v_selected_spin_product.display_name, v_selected_spin_product.product_name),
      'price', v_selected_spin_product.product_price,
      'image_url', COALESCE(v_selected_spin_product.image_url, v_selected_spin_product.product_image)
    ),
    'new_coin_balance', v_new_balance,
    'added_to_cart', true,
    'cart_id', v_cart_id
  );
END;
$$;

-- Function: Get spin statistics (for admin)
CREATE OR REPLACE FUNCTION get_spin_statistics(
  p_days INTEGER DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_spins INTEGER;
  v_total_revenue INTEGER;
  v_unique_users INTEGER;
  v_avg_spins_per_user NUMERIC;
  v_most_won_products jsonb;
BEGIN
  -- Total spins in period
  SELECT COUNT(*) INTO v_total_spins
  FROM public.spin_history
  WHERE won_at >= NOW() - (p_days || ' days')::INTERVAL;
  
  -- Total revenue
  SELECT COALESCE(SUM(amount_paid), 0) INTO v_total_revenue
  FROM public.spin_history
  WHERE won_at >= NOW() - (p_days || ' days')::INTERVAL;
  
  -- Unique users
  SELECT COUNT(DISTINCT user_id) INTO v_unique_users
  FROM public.spin_history
  WHERE won_at >= NOW() - (p_days || ' days')::INTERVAL;
  
  -- Average spins per user
  IF v_unique_users > 0 THEN
    v_avg_spins_per_user := v_total_spins::NUMERIC / v_unique_users;
  ELSE
    v_avg_spins_per_user := 0;
  END IF;
  
  -- Most won products (top 10)
  SELECT jsonb_agg(product_stats ORDER BY win_count DESC)
  INTO v_most_won_products
  FROM (
    SELECT 
      p.id,
      p.name,
      p.image_url,
      COUNT(*) as win_count,
      ROUND((COUNT(*)::NUMERIC / NULLIF(v_total_spins, 0)) * 100, 2) as win_percentage
    FROM public.spin_history sh
    JOIN public.products p ON sh.product_id = p.id
    WHERE sh.won_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY p.id, p.name, p.image_url
    ORDER BY win_count DESC
    LIMIT 10
  ) product_stats;
  
  RETURN jsonb_build_object(
    'period_days', p_days,
    'total_spins', v_total_spins,
    'total_revenue_mnt', v_total_revenue,
    'unique_users', v_unique_users,
    'avg_spins_per_user', v_avg_spins_per_user,
    'most_won_products', COALESCE(v_most_won_products, '[]'::jsonb)
  );
END;
$$;

-- =====================================================
-- 5. GRANT PERMISSIONS
-- =====================================================

GRANT SELECT, INSERT ON public.spin_products TO authenticated;
GRANT SELECT, INSERT ON public.spin_history TO authenticated;
GRANT EXECUTE ON FUNCTION can_user_spin_today TO authenticated;
GRANT EXECUTE ON FUNCTION perform_spin TO authenticated;
GRANT EXECUTE ON FUNCTION get_spin_statistics TO authenticated;

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_spin_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_spin_products_updated_at
  BEFORE UPDATE ON public.spin_products
  FOR EACH ROW
  EXECUTE FUNCTION update_spin_products_updated_at();

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Create API routes for spin management
-- 2. Create admin UI for managing spin products
-- 3. Create user UI for spin wheel
-- 4. Test spin functionality
-- =====================================================
