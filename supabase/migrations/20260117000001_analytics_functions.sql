-- Analytics Functions for Admin Dashboard

-- Get top selling products
CREATE OR REPLACE FUNCTION get_top_products(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
  product_id UUID,
  product_name TEXT,
  total_sales BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    oi.product_id,
    COALESCE(p.name_en, p.title, p.name_mn) as product_name,
    SUM(oi.quantity) as total_sales,
    SUM(oi.price_at_purchase * oi.quantity) as total_revenue
  FROM order_items oi
  LEFT JOIN products p ON p.id = oi.product_id
  GROUP BY oi.product_id, p.name_en, p.title, p.name_mn
  ORDER BY total_revenue DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get daily sales data
CREATE OR REPLACE FUNCTION get_daily_sales(days INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  orders BIGINT,
  revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(o.created_at) as date,
    COUNT(o.id) as orders,
    COALESCE(SUM(o.total_amount), 0) as revenue
  FROM orders o
  WHERE o.created_at >= NOW() - (days || ' days')::INTERVAL
  GROUP BY DATE(o.created_at)
  ORDER BY date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get category performance
CREATE OR REPLACE FUNCTION get_category_performance()
RETURNS TABLE (
  category_name TEXT,
  total_sales BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.name as category_name,
    COUNT(oi.id) as total_sales,
    COALESCE(SUM(oi.price_at_purchase * oi.quantity), 0) as total_revenue
  FROM categories c
  LEFT JOIN products p ON p.category_id = c.id
  LEFT JOIN order_items oi ON oi.product_id = p.id
  WHERE c.is_active = true
  GROUP BY c.name
  ORDER BY total_revenue DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_top_products TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_sales TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_performance TO authenticated;
