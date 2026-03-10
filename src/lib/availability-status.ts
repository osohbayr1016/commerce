export type AvailabilityStatus = "order" | "in_stock";

export const AVAILABILITY_STATUS_OPTIONS: Record<
  AvailabilityStatus,
  { en: string; mn: string; ru: string; zh: string; it: string }
> = {
  order: {
    en: "To be ordered",
    mn: "Захиалгаар ирэх",
    ru: "Под заказ",
    zh: "可订购",
    it: "Su ordinazione",
  },
  in_stock: {
    en: "In stock",
    mn: "бэлэн байгаа",
    ru: "В наличии",
    zh: "有货",
    it: "Disponibile",
  },
};

const LANG_KEYS = ["en", "mn", "ru", "zh", "it"] as const;

export function getAvailabilityStatusLabel(
  status: AvailabilityStatus | null | undefined,
  lang: string
): string {
  if (!status || !(status in AVAILABILITY_STATUS_OPTIONS)) return "";
  const opts = AVAILABILITY_STATUS_OPTIONS[status as AvailabilityStatus];
  const key = LANG_KEYS.find((k) => k === lang) ?? "en";
  return opts[key] ?? opts.en;
}
