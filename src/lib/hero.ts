import { createClient } from "@/lib/supabase/server";
import { ensureR2PublicUrl } from "@/lib/cloudflare/r2-client";

export interface HeroBanner {
  id: string;
  image_url: string;
  title: string | null;
  link: string | null;
  [key: string]: unknown;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_banners")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("[hero] Error fetching banners:", error.message);
      return [];
    }

    const rows = data ?? [];
    const banners = rows.map((row: { image_url?: string; [k: string]: unknown }) => ({
      ...row,
      id: String(row.id),
      image_url: row.image_url ? ensureR2PublicUrl(String(row.image_url)) : "",
      title: row.title != null ? String(row.title) : null,
      link: row.link != null ? String(row.link) : null,
    }));

    if (banners.length === 0) {
      const fallbackUrl = process.env.NEXT_PUBLIC_HERO_FALLBACK_IMAGE_URL?.trim();
      if (fallbackUrl) {
        return [
          {
            id: "fallback",
            image_url: fallbackUrl,
            title: null,
            link: null,
          } as HeroBanner,
        ];
      }
    }
    return banners;
  } catch (e) {
    console.error("[hero] Unexpected error:", e);
    const fallbackUrl = process.env.NEXT_PUBLIC_HERO_FALLBACK_IMAGE_URL?.trim();
    if (fallbackUrl) {
      return [
        { id: "fallback", image_url: fallbackUrl, title: null, link: null } as HeroBanner,
      ];
    }
    return [];
  }
}
