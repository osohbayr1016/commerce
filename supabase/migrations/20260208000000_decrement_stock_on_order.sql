-- Decrement product (or variant) stock when an order is placed.
-- Called from POST /api/orders after order_items are inserted.

CREATE OR REPLACE FUNCTION public.decrement_product_stock_on_order(
  p_product_id UUID,
  p_size INTEGER DEFAULT NULL,
  p_quantity INTEGER DEFAULT 1
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_has_variants BOOLEAN;
  v_variant_rows INT;
BEGIN
  IF p_quantity IS NULL OR p_quantity <= 0 THEN
    RETURN;
  END IF;

  -- Check if product has variants
  SELECT EXISTS (
    SELECT 1 FROM product_variants
    WHERE product_id = p_product_id AND is_active = true
    LIMIT 1
  ) INTO v_has_variants;

  IF v_has_variants AND p_size IS NOT NULL THEN
    -- Decrement variant stock (match by product_id and size)
    UPDATE product_variants
    SET stock = GREATEST(0, stock - p_quantity),
        updated_at = NOW()
    WHERE product_id = p_product_id
      AND (size = p_size OR (size IS NULL AND p_size IS NULL))
      AND is_active = true;

    GET DIAGNOSTICS v_variant_rows = ROW_COUNT;

    -- If no variant matched, decrement main product stock instead
    IF v_variant_rows = 0 THEN
      UPDATE products
      SET stock = GREATEST(0, COALESCE(stock, 0) - p_quantity)
      WHERE id = p_product_id;
    END IF;
  ELSE
    -- No variants or no size: decrement main product stock
    UPDATE products
    SET stock = GREATEST(0, COALESCE(stock, 0) - p_quantity)
    WHERE id = p_product_id;
  END IF;
END;
$$;

COMMENT ON FUNCTION public.decrement_product_stock_on_order IS
  'Decrements product or variant stock when an order is placed. Use after inserting order_items.';

GRANT EXECUTE ON FUNCTION public.decrement_product_stock_on_order TO service_role;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock_on_order TO authenticated;
GRANT EXECUTE ON FUNCTION public.decrement_product_stock_on_order TO anon;
