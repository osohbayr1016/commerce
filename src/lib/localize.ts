export const LANGUAGES = ["en", "mn", "ru", "zh", "it"] as const;
export type SupportedLanguage = (typeof LANGUAGES)[number];

export interface LocalizedNameObject {
  name_en?: string | null;
  name_mn?: string | null;
  name_ru?: string | null;
  name_zh?: string | null;
  name_it?: string | null;
}

export interface LocalizedDescriptionObject {
  description_en?: string | null;
  description_mn?: string | null;
  description_ru?: string | null;
  description_zh?: string | null;
  description_it?: string | null;
}

const LANG_KEYS: Record<SupportedLanguage, keyof LocalizedNameObject> = {
  en: "name_en",
  mn: "name_mn",
  ru: "name_ru",
  zh: "name_zh",
  it: "name_it",
};

const DESC_KEYS: Record<SupportedLanguage, keyof LocalizedDescriptionObject> = {
  en: "description_en",
  mn: "description_mn",
  ru: "description_ru",
  zh: "description_zh",
  it: "description_it",
};

export function getLocalizedName(
  obj: LocalizedNameObject | null | undefined,
  lang: string,
  fallback = ""
): string {
  if (!obj) return fallback;
  const key = LANG_KEYS[lang as SupportedLanguage];
  const val = key ? obj[key] : null;
  if (val && String(val).trim()) return String(val).trim();
  const en = obj.name_en?.trim();
  if (en) return en;
  const mn = obj.name_mn?.trim();
  if (mn) return mn;
  for (const k of LANGUAGES) {
    const v = obj[LANG_KEYS[k]]?.trim();
    if (v) return v;
  }
  return fallback;
}

export interface ProductNameLike {
  nameEn?: string | null;
  nameMn?: string | null;
  nameRu?: string | null;
  nameZh?: string | null;
  nameIt?: string | null;
}

export function getLocalizedNameFromProduct(
  obj: ProductNameLike | null | undefined,
  lang: string,
  fallback = ""
): string {
  if (!obj) return fallback;
  const map: Record<SupportedLanguage, string | undefined> = {
    en: obj.nameEn?.trim(),
    mn: obj.nameMn?.trim(),
    ru: obj.nameRu?.trim(),
    zh: obj.nameZh?.trim(),
    it: obj.nameIt?.trim(),
  };
  const val = map[lang as SupportedLanguage];
  if (val) return val;
  if (obj.nameEn?.trim()) return obj.nameEn.trim();
  if (obj.nameMn?.trim()) return obj.nameMn.trim();
  for (const k of LANGUAGES) {
    const v = map[k];
    if (v) return v;
  }
  return fallback;
}

export function getLocalizedDescription(
  obj: LocalizedDescriptionObject | null | undefined,
  lang: string,
  fallback = ""
): string {
  if (!obj) return fallback;
  const key = DESC_KEYS[lang as SupportedLanguage];
  const val = key ? obj[key] : null;
  if (val && String(val).trim()) return String(val).trim();
  const en = obj.description_en?.trim();
  if (en) return en;
  const mn = obj.description_mn?.trim();
  if (mn) return mn;
  for (const k of LANGUAGES) {
    const v = obj[DESC_KEYS[k]]?.trim();
    if (v) return v;
  }
  return fallback;
}
