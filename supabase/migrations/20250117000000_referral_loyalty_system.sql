-- Referral and Loyalty System

-- Add referral code to profiles if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS referral_code VARCHAR(20) UNIQUE;

-- Generate referral codes for existing users
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS VARCHAR(20) AS $$
DECLARE
  code VARCHAR(20);
  exists_flag BOOLEAN;
BEGIN
  LOOP
    code := 'REF' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8));
    
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_flag;
    
    IF NOT exists_flag THEN
      RETURN code;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Update existing profiles with referral codes
UPDATE public.profiles 
SET referral_code = generate_referral_code() 
WHERE referral_code IS NULL;

-- Trigger to generate referral code on profile creation
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON public.profiles;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Referrals tracking table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending',
  referrer_reward_xp INTEGER DEFAULT 0,
  referred_reward_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(referrer_id, referred_id)
);

-- Promo codes table
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL,
  discount_value NUMERIC(10, 2) NOT NULL,
  min_purchase_amount NUMERIC(10, 2) DEFAULT 0,
  max_discount_amount NUMERIC(10, 2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Promo code usage tracking
CREATE TABLE IF NOT EXISTS public.promo_code_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  promo_code_id UUID NOT NULL REFERENCES public.promo_codes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  discount_amount NUMERIC(10, 2) NOT NULL,
  used_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(promo_code_id, user_id, order_id)
);

-- XP transactions log
CREATE TABLE IF NOT EXISTS public.xp_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  source VARCHAR(50) NOT NULL,
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_code_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" 
  ON public.referrals FOR SELECT 
  TO authenticated 
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

CREATE POLICY "Users can create referrals" 
  ON public.referrals FOR INSERT 
  TO authenticated 
  WITH CHECK (referred_id = auth.uid());

-- RLS Policies for promo codes
CREATE POLICY "Everyone can view active promo codes" 
  ON public.promo_codes FOR SELECT 
  TO public 
  USING (is_active = true AND (valid_until IS NULL OR valid_until > NOW()));

CREATE POLICY "Admins can manage promo codes" 
  ON public.promo_codes FOR ALL 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for promo code usage
CREATE POLICY "Users can view own promo usage" 
  ON public.promo_code_usage FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can create promo usage" 
  ON public.promo_code_usage FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

-- RLS Policies for XP transactions
CREATE POLICY "Users can view own XP transactions" 
  ON public.xp_transactions FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred ON public.referrals(referred_id);
CREATE INDEX IF NOT EXISTS idx_referrals_status ON public.referrals(status);
CREATE INDEX IF NOT EXISTS idx_promo_codes_code ON public.promo_codes(code);
CREATE INDEX IF NOT EXISTS idx_promo_codes_active ON public.promo_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_user ON public.promo_code_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_promo_code_usage_code ON public.promo_code_usage(promo_code_id);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user ON public.xp_transactions(user_id);

-- Function to award XP
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source VARCHAR,
  p_description TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL,
  p_referral_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  UPDATE public.profiles
  SET xp = COALESCE(xp, 0) + p_amount,
      updated_at = NOW()
  WHERE id = p_user_id
  RETURNING xp INTO new_xp;
  
  new_level := FLOOR(new_xp / 1000) + 1;
  
  UPDATE public.profiles
  SET tier_level = new_level
  WHERE id = p_user_id AND tier_level < new_level;
  
  INSERT INTO public.xp_transactions (user_id, amount, source, description, order_id, referral_id)
  VALUES (p_user_id, p_amount, p_source, p_description, p_order_id, p_referral_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to validate and apply promo code
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code VARCHAR,
  p_user_id UUID,
  p_order_amount NUMERIC
)
RETURNS TABLE(
  is_valid BOOLEAN,
  discount_amount NUMERIC,
  message TEXT,
  promo_code_id UUID
) AS $$
DECLARE
  promo RECORD;
  usage_count INTEGER;
  calculated_discount NUMERIC;
BEGIN
  SELECT * INTO promo
  FROM public.promo_codes
  WHERE code = p_code
    AND is_active = true
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until > NOW());
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::NUMERIC, 'Invalid or expired promo code'::TEXT, NULL::UUID;
    RETURN;
  END IF;
  
  IF promo.min_purchase_amount > p_order_amount THEN
    RETURN QUERY SELECT false, 0::NUMERIC, 
      'Minimum purchase amount of ' || promo.min_purchase_amount || ' required'::TEXT, 
      NULL::UUID;
    RETURN;
  END IF;
  
  IF promo.usage_limit IS NOT NULL THEN
    SELECT COUNT(*) INTO usage_count
    FROM public.promo_code_usage
    WHERE promo_code_id = promo.id AND user_id = p_user_id;
    
    IF usage_count >= promo.usage_limit THEN
      RETURN QUERY SELECT false, 0::NUMERIC, 'Promo code usage limit reached'::TEXT, NULL::UUID;
      RETURN;
    END IF;
  END IF;
  
  IF promo.discount_type = 'percentage' THEN
    calculated_discount := (p_order_amount * promo.discount_value / 100);
    IF promo.max_discount_amount IS NOT NULL THEN
      calculated_discount := LEAST(calculated_discount, promo.max_discount_amount);
    END IF;
  ELSE
    calculated_discount := promo.discount_value;
  END IF;
  
  RETURN QUERY SELECT true, calculated_discount, 'Promo code applied successfully'::TEXT, promo.id;
END;
$$ LANGUAGE plpgsql;

-- Insert some default promo codes
INSERT INTO public.promo_codes (code, description, discount_type, discount_value, min_purchase_amount, usage_limit, valid_until)
VALUES 
  ('WELCOME10', 'Welcome 10% discount', 'percentage', 10, 50000, 1, NOW() + INTERVAL '30 days'),
  ('FIRSTBUY', 'First purchase 15% off', 'percentage', 15, 100000, 1, NOW() + INTERVAL '60 days'),
  ('SAVE20', '20% off on orders above 200k', 'percentage', 20, 200000, NULL, NOW() + INTERVAL '90 days')
ON CONFLICT (code) DO NOTHING;
