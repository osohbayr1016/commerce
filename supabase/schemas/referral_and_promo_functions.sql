-- ============================================
-- Referral & promo: tables + functions
-- Run in Supabase SQL Editor if you get
-- "Could not find the function public.get_referral_stats"
-- or "Could not find the function public.is_promo_code_available"
-- ============================================

-- 1. Profile columns for referral/promo
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS promo_code TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS accumulated_discount_percent INTEGER NOT NULL DEFAULT 0 CHECK (accumulated_discount_percent >= 0),
  ADD COLUMN IF NOT EXISTS total_referrals INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_top6 BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_promo_code ON public.profiles(promo_code) WHERE promo_code IS NOT NULL;

-- 2. Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  promo_code_used TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, referrer_id),
  CHECK (user_id != referrer_id)
);

CREATE INDEX IF NOT EXISTS idx_referrals_user ON public.referrals(user_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_promo_code ON public.referrals(promo_code_used);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own referrals" ON public.referrals;
CREATE POLICY "Users can view their own referrals"
  ON public.referrals FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR referrer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "System can insert referrals" ON public.referrals;
CREATE POLICY "System can insert referrals"
  ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 3. Discount events table
CREATE TABLE IF NOT EXISTS public.discount_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  earned_from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  purchase_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_percent INTEGER NOT NULL DEFAULT 2,
  purchase_amount_mnt INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_discount_events_user ON public.discount_events(user_id);
CREATE INDEX IF NOT EXISTS idx_discount_events_created ON public.discount_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_discount_events_earned_from ON public.discount_events(earned_from_user_id);

ALTER TABLE public.discount_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own discount events" ON public.discount_events;
CREATE POLICY "Users can view their own discount events"
  ON public.discount_events FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "System can insert discount events" ON public.discount_events;
CREATE POLICY "System can insert discount events"
  ON public.discount_events FOR INSERT TO authenticated
  WITH CHECK (true);

-- 4. Function: user's total purchases in last 30 days
CREATE OR REPLACE FUNCTION public.get_user_purchases_last_30_days(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  total INTEGER;
BEGIN
  SELECT COALESCE(SUM(total_amount), 0)
  INTO total
  FROM public.orders
  WHERE user_id = p_user_id
    AND created_at >= NOW() - INTERVAL '30 days'
    AND status IN ('confirmed', 'delivered', 'pending');
  RETURN total;
END;
$$;

-- 5. Function: award referral discount (used after order creation)
CREATE OR REPLACE FUNCTION public.award_referral_discount(
  p_buyer_user_id UUID,
  p_order_id UUID,
  p_purchase_amount INTEGER
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer_id UUID;
  v_buyer_30day_total INTEGER;
  v_discount_awarded BOOLEAN := false;
  v_referrer_promo_code TEXT;
BEGIN
  v_buyer_30day_total := public.get_user_purchases_last_30_days(p_buyer_user_id);

  IF v_buyer_30day_total >= 5000000 THEN
    SELECT referrer_id, promo_code_used
    INTO v_referrer_id, v_referrer_promo_code
    FROM public.referrals
    WHERE user_id = p_buyer_user_id
    LIMIT 1;

    IF v_referrer_id IS NOT NULL THEN
      UPDATE public.profiles
      SET
        accumulated_discount_percent = accumulated_discount_percent + 2,
        total_referrals = (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = v_referrer_id)
      WHERE id = v_referrer_id;

      INSERT INTO public.discount_events (
        user_id, earned_from_user_id, purchase_order_id, purchase_amount_mnt, discount_percent
      )
      VALUES (v_referrer_id, p_buyer_user_id, p_order_id, p_purchase_amount, 2);

      v_discount_awarded := true;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'discount_awarded', v_discount_awarded,
    'buyer_30day_total', v_buyer_30day_total,
    'referrer_id', v_referrer_id
  );
END;
$$;

-- 6. Function: check if promo code is available (not taken)
CREATE OR REPLACE FUNCTION public.is_promo_code_available(p_promo_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code_exists BOOLEAN;
BEGIN
  SELECT EXISTS(
    SELECT 1 FROM public.profiles WHERE promo_code = p_promo_code
  ) INTO code_exists;
  RETURN NOT code_exists;
END;
$$;

-- 7. Function: referral stats for a user
CREATE OR REPLACE FUNCTION public.get_referral_stats(p_user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_stats jsonb;
  v_referral_count INTEGER;
  v_discount_percent INTEGER;
  v_purchases_30d INTEGER;
  v_total_discount_earned INTEGER;
  v_can_use_discount BOOLEAN;
BEGIN
  SELECT total_referrals, accumulated_discount_percent
  INTO v_referral_count, v_discount_percent
  FROM public.profiles
  WHERE id = p_user_id;

  v_purchases_30d := public.get_user_purchases_last_30_days(p_user_id);
  v_can_use_discount := v_purchases_30d >= 30000000;

  SELECT COALESCE(SUM(discount_percent), 0)
  INTO v_total_discount_earned
  FROM public.discount_events
  WHERE user_id = p_user_id;

  v_stats := jsonb_build_object(
    'referral_count', COALESCE(v_referral_count, 0),
    'accumulated_discount_percent', COALESCE(v_discount_percent, 0),
    'purchases_30d', v_purchases_30d,
    'can_use_discount', v_can_use_discount,
    'total_discount_earned', v_total_discount_earned,
    'threshold_30m', 30000000,
    'threshold_5m', 5000000
  );
  RETURN v_stats;
END;
$$;

-- 8. Trigger: keep profile.total_referrals in sync
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET total_referrals = (
    SELECT COUNT(*) FROM public.referrals WHERE referrer_id = NEW.referrer_id
  )
  WHERE id = NEW.referrer_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_update_referral_count ON public.referrals;
CREATE TRIGGER trg_update_referral_count
  AFTER INSERT ON public.referrals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_referral_count();

-- 9. Grants
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT SELECT ON public.discount_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_purchases_last_30_days(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_discount(UUID, UUID, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_promo_code_available(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_stats(UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
