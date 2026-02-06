import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { ensureR2PublicUrl } from '@/lib/cloudflare/r2-client';

type HeroBannerRow = { id: string; image_url: string; title: string | null; link: string | null; [k: string]: unknown };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('hero_banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching public hero banners:', error);
      return NextResponse.json([]);
    }

    let normalized: HeroBannerRow[] = (data || []).map((row: { image_url?: string; [k: string]: unknown }) => ({
      ...row,
      id: String(row.id),
      image_url: row.image_url ? ensureR2PublicUrl(row.image_url) : (row.image_url ?? ''),
      title: row.title != null ? String(row.title) : null,
      link: row.link != null ? String(row.link) : null,
    })) as HeroBannerRow[];
    if (normalized.length === 0) {
      const fallback = process.env.NEXT_PUBLIC_HERO_FALLBACK_IMAGE_URL?.trim();
      if (fallback) normalized = [{ id: 'fallback', image_url: fallback, title: null, link: null }];
    }
    const res = NextResponse.json(normalized);
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res;
  } catch (e: any) {
    console.error('Unexpected error in GET /api/hero:', e);
    const fallback = process.env.NEXT_PUBLIC_HERO_FALLBACK_IMAGE_URL?.trim();
    const body: HeroBannerRow[] = fallback ? [{ id: 'fallback', image_url: fallback, title: null, link: null }] : [];
    return NextResponse.json(body);
  }
}
