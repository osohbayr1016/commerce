-- Add coin_balance column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS coin_balance INTEGER NOT NULL DEFAULT 0 CHECK (coin_balance >= 0);

-- Create coin_transactions table to track all coin purchases and usage
CREATE TABLE IF NOT EXISTS public.coin_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'spend', 'refund')),
  description TEXT,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on coin_transactions
ALTER TABLE public.coin_transactions ENABLE ROW LEVEL SECURITY;

-- Policies for coin_transactions
CREATE POLICY "Users can view their own coin transactions" 
  ON public.coin_transactions 
  FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Admins can manage all coin transactions" 
  ON public.coin_transactions 
  FOR ALL 
  TO authenticated 
  USING (public.is_admin()) 
  WITH CHECK (public.is_admin());

-- Create function to update coin balance
CREATE OR REPLACE FUNCTION public.update_coin_balance(
  p_user_id UUID,
  p_amount INTEGER,
  p_transaction_type TEXT,
  p_description TEXT DEFAULT NULL,
  p_order_id UUID DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the user's coin balance
  UPDATE public.profiles
  SET coin_balance = coin_balance + p_amount
  WHERE id = p_user_id;

  -- Record the transaction
  INSERT INTO public.coin_transactions (user_id, amount, transaction_type, description, order_id)
  VALUES (p_user_id, p_amount, p_transaction_type, p_description, p_order_id);
END;
$$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_coin_transactions_user_id ON public.coin_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_coin_transactions_created_at ON public.coin_transactions(created_at DESC);
