-- =====================================================
-- REFERRAL/PYRAMID SYSTEM DATABASE MIGRATION
-- =====================================================

-- 1. Update profiles table with referral fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_top6 BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS promo_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS accumulated_discount_percent INTEGER NOT NULL DEFAULT 0 CHECK (accumulated_discount_percent >= 0),
ADD COLUMN IF NOT EXISTS total_referrals INTEGER NOT NULL DEFAULT 0;

-- Create indexes for promo code lookups and Top 6 queries
CREATE INDEX IF NOT EXISTS idx_profiles_promo_code ON public.profiles(promo_code) WHERE promo_code IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_is_top6 ON public.profiles(is_top6) WHERE is_top6 = true;

-- 2. Create referrals table to track direct referral relationships
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  promo_code_used TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, referrer_id),
  CHECK (user_id != referrer_id)  -- Prevent self-referral
);

CREATE INDEX idx_referrals_user ON public.referrals(user_id);
CREATE INDEX idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX idx_referrals_promo_code ON public.referrals(promo_code_used);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view their own referrals" 
  ON public.referrals 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR referrer_id = auth.uid() OR public.is_admin());

CREATE POLICY "System can insert referrals" 
  ON public.referrals 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- 3. Create discount_events table to track when and why discounts are earned
CREATE TABLE IF NOT EXISTS public.discount_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  earned_from_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  purchase_order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_percent INTEGER NOT NULL DEFAULT 2,
  purchase_amount_mnt INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_discount_events_user ON public.discount_events(user_id);
CREATE INDEX idx_discount_events_created ON public.discount_events(created_at DESC);
CREATE INDEX idx_discount_events_earned_from ON public.discount_events(earned_from_user_id);

-- Enable RLS
ALTER TABLE public.discount_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for discount_events
CREATE POLICY "Users can view their own discount events" 
  ON public.discount_events 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "System can insert discount events" 
  ON public.discount_events 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- 4. Function to calculate user's total purchases in last 30 days
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

-- 5. Function to award referral discount (2% per qualified purchase)
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
  -- Get buyer's 30-day total purchases
  v_buyer_30day_total := public.get_user_purchases_last_30_days(p_buyer_user_id);
  
  -- Check if buyer has spent 5M+ MNT in last 30 days
  IF v_buyer_30day_total >= 5000000 THEN
    -- Find referrer
    SELECT referrer_id, promo_code_used 
    INTO v_referrer_id, v_referrer_promo_code
    FROM public.referrals
    WHERE user_id = p_buyer_user_id
    LIMIT 1;
    
    IF v_referrer_id IS NOT NULL THEN
      -- Award 2% discount to referrer
      UPDATE public.profiles
      SET 
        accumulated_discount_percent = accumulated_discount_percent + 2,
        total_referrals = (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = v_referrer_id)
      WHERE id = v_referrer_id;
      
      -- Record discount event
      INSERT INTO public.discount_events (
        user_id, 
        earned_from_user_id, 
        purchase_order_id, 
        purchase_amount_mnt,
        discount_percent
      )
      VALUES (
        v_referrer_id, 
        p_buyer_user_id, 
        p_order_id, 
        p_purchase_amount,
        2
      );
      
      v_discount_awarded := true;
    END IF;
  END IF;
  
  -- Return result
  RETURN jsonb_build_object(
    'discount_awarded', v_discount_awarded,
    'buyer_30day_total', v_buyer_30day_total,
    'referrer_id', v_referrer_id
  );
END;
$$;

-- 6. Function to check if promo code is available
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

-- 7. Function to get referral stats for a user
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
  -- Get profile data
  SELECT 
    total_referrals,
    accumulated_discount_percent
  INTO 
    v_referral_count,
    v_discount_percent
  FROM public.profiles
  WHERE id = p_user_id;
  
  -- Get 30-day purchases
  v_purchases_30d := public.get_user_purchases_last_30_days(p_user_id);
  
  -- Check if user can use discount (30M+ in 30 days)
  v_can_use_discount := v_purchases_30d >= 30000000;
  
  -- Get total discount value earned
  SELECT COALESCE(SUM(discount_percent), 0)
  INTO v_total_discount_earned
  FROM public.discount_events
  WHERE user_id = p_user_id;
  
  -- Build response
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

-- 8. Update referral count trigger
CREATE OR REPLACE FUNCTION public.update_referral_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET total_referrals = (
    SELECT COUNT(*) 
    FROM public.referrals 
    WHERE referrer_id = NEW.referrer_id
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

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT ON public.referrals TO authenticated;
GRANT SELECT ON public.discount_events TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_purchases_last_30_days TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_promo_code_available TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_referral_stats TO authenticated;
