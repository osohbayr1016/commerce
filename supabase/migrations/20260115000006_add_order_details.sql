ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS district TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS zip TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS note TEXT;

CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_purchase INTEGER NOT NULL CHECK (price_at_purchase >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order items: read own"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid())
    OR public.is_admin()
  );

CREATE POLICY "Order items: create own"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
