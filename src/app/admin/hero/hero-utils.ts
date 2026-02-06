export interface Banner {
  id: string;
  image_url: string;
  title: string | null;
  link: string | null;
  sort_order: number;
  is_active: boolean;
}

export const isTableMissingError = (message: string) =>
  message.includes("hero_banners") &&
  (message.includes("does not exist") || message.includes("Could not find the table"));

export function normalizeBanners(data: unknown): Banner[] {
  if (!Array.isArray(data)) return [];
  return data
    .filter(
      (b): b is Record<string, unknown> =>
        b != null &&
        typeof b === "object" &&
        typeof (b as { id?: unknown }).id === "string" &&
        typeof (b as { image_url?: unknown }).image_url === "string"
    )
    .map((b: Record<string, unknown>) => ({
      id: String(b.id),
      image_url: String(b.image_url || ""),
      title: b.title != null ? String(b.title) : null,
      link: b.link != null ? String(b.link) : null,
      sort_order: Number(b.sort_order) || 0,
      is_active: (b as { is_active?: boolean }).is_active !== false,
    }));
}
