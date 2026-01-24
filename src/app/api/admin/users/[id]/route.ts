import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'Хэрэглэгчийн ID шаардлагатай' }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const { role } = body;

    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json({ error: 'role нь user эсвэл admin байх ёстой' }, { status: 400 });
    }

    if (id === user.id && role === 'user') {
      return NextResponse.json(
        { error: 'Өөрийн админ эрхийг хасах боломжгүй' },
        { status: 400 }
      );
    }

    const { data: updated, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', id)
      .select('id, full_name, email, phone_number, role, updated_at')
      .single();

    if (error) {
      console.error('Error updating user role:', error);
      return NextResponse.json({ error: 'Эрх шинэчлэхэд алдаа гарлаа' }, { status: 500 });
    }

    return NextResponse.json(updated);
  } catch (e) {
    console.error('Error in PATCH /api/admin/users/[id]:', e);
    return NextResponse.json({ error: 'Алдаа гарлаа' }, { status: 500 });
  }
}
