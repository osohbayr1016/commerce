/** Default footer content when footer_contents table is missing or empty */

export type FooterContentsMap = Record<string, Record<string, string>>;

export const DEFAULT_FOOTER_MAP: FooterContentsMap = {
  company: { title: "E-Commerce", description: "Онлайн худалдааг хөгжүүлэгч платформ" },
  social: { facebook_url: "#", instagram_url: "#" },
  help_menu: {
    about_text: "Бидний тухай",
    about_url: "#",
    contact_text: "Холбоо барих",
    contact_url: "#",
    faq_text: "Түгээмэл асуултууд",
    faq_url: "#",
  },
  contact: { address: "Somewhere", phone: "99119911", email: "test@gmail.com" },
  bottom_links: {
    copyright: "Developed by Twissu",
    home_text: "Нүүр",
    home_url: "/",
    categories_text: "Ангилал",
    categories_url: "#",
    sale_text: "Хямдрал",
    sale_url: "#",
    profile_text: "Профайл",
    profile_url: "/profile",
  },
};

export interface FooterContentRow {
  id: number;
  section: string;
  key: string;
  value: string;
  display_order: number;
  is_active: boolean;
}

/** Default rows for admin page (fake ids for display only) */
export function getDefaultFooterRows(): FooterContentRow[] {
  const rows: FooterContentRow[] = [];
  let id = 1;
  const entries: Array<[string, string, number]> = [
    ["company", "title", 1],
    ["company", "description", 2],
    ["social", "facebook_url", 1],
    ["social", "instagram_url", 2],
    ["help_menu", "about_text", 1],
    ["help_menu", "about_url", 1],
    ["help_menu", "contact_text", 2],
    ["help_menu", "contact_url", 2],
    ["help_menu", "faq_text", 3],
    ["help_menu", "faq_url", 3],
    ["contact", "address", 1],
    ["contact", "phone", 2],
    ["contact", "email", 3],
    ["bottom_links", "copyright", 1],
    ["bottom_links", "home_text", 2],
    ["bottom_links", "home_url", 2],
    ["bottom_links", "categories_text", 3],
    ["bottom_links", "categories_url", 3],
    ["bottom_links", "sale_text", 4],
    ["bottom_links", "sale_url", 4],
    ["bottom_links", "profile_text", 5],
    ["bottom_links", "profile_url", 5],
  ];
  for (const [section, key, display_order] of entries) {
    const value = (DEFAULT_FOOTER_MAP[section] as Record<string, string>)?.[key] ?? "";
    rows.push({
      id: id++,
      section,
      key,
      value,
      display_order,
      is_active: true,
    });
  }
  return rows;
}
