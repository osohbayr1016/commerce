-- List users for admin: email from auth.users (profiles.email may not exist)
-- Uses id, full_name, role, created_at, phone_number from profiles + email from auth.users
CREATE OR REPLACE FUNCTION public.get_admin_users(
  p_limit int DEFAULT 20,
  p_offset int DEFAULT 0,
  p_query text DEFAULT ''
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  res jsonb;
  total_count bigint;
  q_escaped text;
BEGIN
  q_escaped := coalesce(trim(p_query), '');
  IF length(q_escaped) > 200 THEN q_escaped := left(q_escaped, 200); END IF;
  q_escaped := replace(replace(q_escaped, '%', '\%'), '_', '\_');

  SELECT COUNT(*) INTO total_count
  FROM public.profiles p
  LEFT JOIN auth.users u ON u.id = p.id
  WHERE (q_escaped = ''
    OR p.full_name ILIKE '%' || q_escaped || '%'
    OR (u.email IS NOT NULL AND u.email ILIKE '%' || q_escaped || '%')
    OR (p.phone_number IS NOT NULL AND p.phone_number ILIKE '%' || q_escaped || '%'));

  SELECT jsonb_build_object(
    'users', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', r.id,
        'full_name', r.full_name,
        'email', r.email,
        'phone_number', r.phone_number,
        'role', r.role,
        'created_at', r.created_at,
        'promo_code', NULL::text,
        'is_top6', NULL::boolean,
        'total_referrals', NULL::integer
      ))
      FROM (
        SELECT p.id, p.full_name, p.role, p.created_at, u.email, p.phone_number
        FROM public.profiles p
        LEFT JOIN auth.users u ON u.id = p.id
        WHERE (q_escaped = ''
          OR p.full_name ILIKE '%' || q_escaped || '%'
          OR (u.email IS NOT NULL AND u.email ILIKE '%' || q_escaped || '%')
          OR (p.phone_number IS NOT NULL AND p.phone_number ILIKE '%' || q_escaped || '%'))
        ORDER BY p.created_at DESC NULLS LAST
        LIMIT GREATEST(0, LEAST(p_limit, 100)) OFFSET GREATEST(0, p_offset)
      ) r
    ), '[]'::jsonb),
    'total', total_count
  ) INTO res;

  RETURN res;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_admin_users(int, int, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_admin_users(int, int, text) TO service_role;
