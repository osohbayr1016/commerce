import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ensureR2PublicUrl } from '@/lib/cloudflare/r2-client';

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  return profile?.role === 'admin';
}

export async function GET() {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching hero banners:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const normalized = (data || []).map((row: { image_url?: string; [k: string]: unknown }) => ({
      ...row,
      image_url: row.image_url ? ensureR2PublicUrl(row.image_url) : row.image_url,
    }));
    return NextResponse.json(normalized);
  } catch (e: any) {
    console.error('Unexpected error in GET /api/admin/hero:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { image_url, title, link } = body;

    const supabase = await createClient();
    
    // Get max sort_order
    const { data: maxOrder } = await supabase
      .from('hero_banners')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single();
      
    const nextOrder = (maxOrder?.sort_order ?? -1) + 1;

    const { data, error } = await supabase
      .from('hero_banners')
      .insert([{ image_url, title, link, sort_order: nextOrder }])
      .select()
      .single();

    if (error) {
      console.error('Error creating hero banner:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Unexpected error in POST /api/admin/hero:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from('hero_banners')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting hero banner:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error('Unexpected error in DELETE /api/admin/hero:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const isAdmin = await checkAdmin();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hero_banners')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating hero banner:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (e: any) {
    console.error('Unexpected error in PUT /api/admin/hero:', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
