-- Search users for admin (Top 6, etc.): by full_name, promo_code, or auth.users.email
-- Avoids relying on profiles.email which may not exist in all environments
CREATE OR REPLACE FUNCTION public.search_users_for_admin(p_query text DEFAULT '')
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  q_escaped text;
  res jsonb;
BEGIN
  q_escaped := coalesce(trim(p_query), '');
  IF length(q_escaped) < 2 THEN
    RETURN jsonb_build_object('users', '[]'::jsonb, 'total', 0);
  END IF;
  q_escaped := replace(replace(q_escaped, '%', '\%'), '_', '\_');

  SELECT jsonb_build_object(
    'users', COALESCE((
      SELECT jsonb_agg(to_jsonb(r))
      FROM (
        SELECT
          p.id,
          p.full_name,
          p.promo_code,
          p.total_referrals,
          p.is_top6,
          u.email
        FROM public.profiles p
        LEFT JOIN auth.users u ON u.id = p.id
        WHERE p.is_top6 = false
          AND (
            p.full_name ILIKE '%' || q_escaped || '%'
            OR p.promo_code ILIKE '%' || q_escaped || '%'
            OR (u.email IS NOT NULL AND u.email ILIKE '%' || q_escaped || '%')
          )
        ORDER BY p.created_at DESC NULLS LAST
        LIMIT 20
      ) r
    ), '[]'::jsonb),
    'total', (SELECT COUNT(*)::int
      FROM public.profiles p
      LEFT JOIN auth.users u ON u.id = p.id
      WHERE p.is_top6 = false
        AND (
          p.full_name ILIKE '%' || q_escaped || '%'
          OR p.promo_code ILIKE '%' || q_escaped || '%'
          OR (u.email IS NOT NULL AND u.email ILIKE '%' || q_escaped || '%')
        ))
  ) INTO res;

  RETURN res;
END;
$$;

GRANT EXECUTE ON FUNCTION public.search_users_for_admin(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.search_users_for_admin(text) TO service_role;
