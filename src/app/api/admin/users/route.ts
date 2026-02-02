import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Нэвтэрч орно уу' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Зөвхөн админ хандах эрхтэй' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const q = (searchParams.get('q') || '').trim();
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Use admin client to bypass RLS and fetch all users
    const adminClient = createAdminClient();
    
    const baseCols = 'id, full_name, role, created_at, phone_number, promo_code, is_top6, total_referrals';
    let query = adminClient
      .from('profiles')
      .select(baseCols, { count: 'exact' })
      .order('created_at', { ascending: false });

    if (q.length >= 2) {
      query = query.or(
        `full_name.ilike.%${q}%,phone_number.ilike.%${q}%,promo_code.ilike.%${q}%`
      );
    }

    const { data: rows, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error('Error listing users:', error);
      // Fallback: try with basic columns only
      const fallback = adminClient
        .from('profiles')
        .select('id, full_name, role, created_at', { count: 'exact' })
        .order('created_at', { ascending: false });
      const fbQuery = q.length >= 2 ? fallback.or(`full_name.ilike.%${q}%`) : fallback;
      const { data: fb, error: fbErr, count: fbCount } = await fbQuery.range(offset, offset + limit - 1);
      if (fbErr) {
        console.error('Error in fallback query:', fbErr);
        return NextResponse.json({ error: 'Хэрэглэгч татах үед алдаа гарлаа' }, { status: 500 });
      }
      return enrichAndRespond(fb || [], fbCount ?? 0, limit, offset, adminClient);
    }

    return enrichAndRespond(rows || [], count ?? 0, limit, offset, adminClient);
  } catch (e) {
    console.error('Error in GET /api/admin/users:', e);
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}

async function enrichAndRespond(
  rows: Record<string, unknown>[],
  total: number,
  limit: number,
  offset: number,
  admin: ReturnType<typeof createAdminClient>
) {
  try {
    const enriched = await Promise.all(
      rows.map(async (r) => {
        const id = r.id as string;
        try {
          const { data: authUser } = await admin.auth.admin.getUserById(id);
          const u = authUser?.user;
          const email = u?.email ?? null;
          const authPhone = u?.phone ?? null;
          const meta = (u as { user_metadata?: { phone_number?: string; phone?: string } })?.user_metadata;
          const metaPhone = meta?.phone_number ?? meta?.phone ?? null;
          const profilePhone = (r as { phone_number?: string }).phone_number ?? null;
          const phone = profilePhone || authPhone || metaPhone || null;
          return {
            ...r,
            email,
            phone_number: phone,
          };
        } catch (err) {
          // If we can't get auth user, return profile data only
          return {
            ...r,
            email: null,
            phone_number: (r as { phone_number?: string }).phone_number ?? null,
          };
        }
      })
    );

    return NextResponse.json({
      users: enriched,
      total,
      limit,
      offset,
    });
  } catch (e) {
    // Fallback: return rows without enrichment
    const users = rows.map((r) => ({
      ...r,
      email: null,
      phone_number: (r as { phone_number?: string }).phone_number ?? null,
    }));
    return NextResponse.json({ users, total, limit, offset });
  }
}
