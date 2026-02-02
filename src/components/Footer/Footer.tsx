import { createClient } from "@/lib/supabase/server";

export const revalidate = 300;

async function getFooterContents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("footer_contents")
    .select("*")
    .eq("is_active", true)
    .order("section", { ascending: true })
    .order("display_order", { ascending: true });

  const contents: Record<string, Record<string, string>> = {};
  data?.forEach((item) => {
    if (!contents[item.section]) {
      contents[item.section] = {};
    }
    contents[item.section][item.key] = item.value;
  });

  return contents;
}

export default async function Footer() {
  const contents = await getFooterContents();

  const company = contents.company || {};
  const social = contents.social || {};
  const helpMenu = contents.help_menu || {};
  const contact = contents.contact || {};
  const bottomLinks = contents.bottom_links || {};

  const helpMenuItems = [
    {
      text: helpMenu.about_text || "Бидний тухай",
      url: helpMenu.about_url || "#",
    },
    {
      text: helpMenu.contact_text || "Холбоо барих",
      url: helpMenu.contact_url || "#",
    },
    {
      text: helpMenu.faq_text || "Түгээмэл асуултууд",
      url: helpMenu.faq_url || "#",
    },
  ];

  const bottomNavItems = [
    {
      text: bottomLinks.home_text || "Нүүр",
      url: bottomLinks.home_url || "/",
    },
    {
      text: bottomLinks.categories_text || "Ангилал",
      url: bottomLinks.categories_url || "#",
    },
    {
      text: bottomLinks.sale_text || "Хямдрал",
      url: bottomLinks.sale_url || "#",
    },
    {
      text: bottomLinks.profile_text || "Профайл",
      url: bottomLinks.profile_url || "/profile",
    },
  ];

  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
              {company.title || "E-Commerce"}
            </h3>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {company.description || "Онлайн худалдааг хөгжүүлэгч платформ"}
            </p>
            <div className="mt-6 flex items-center gap-4 text-gray-500">
              <a
                href={social.facebook_url || "#"}
                className="hover:text-gray-900"
                aria-label="facebook"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={social.instagram_url || "#"}
                className="hover:text-gray-900"
                aria-label="instagram"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-5">
              Туслах цэс
            </h3>
            <ul className="space-y-3">
              {helpMenuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.url}
                    className="text-gray-700 hover:text-gray-900 text-base"
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
              Холбоо барих
            </h3>
            {contact.address && (
              <p className="text-base text-gray-700 mb-4 leading-relaxed">
                {contact.address}
              </p>
            )}
            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="text-gray-700 hover:text-gray-900 block mb-2 text-base"
              >
                Утас: {contact.phone}
              </a>
            )}
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="text-gray-700 hover:text-gray-900 block text-base"
              >
                И-мэйл: {contact.email}
              </a>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-500">
          <p>{bottomLinks.copyright || "Developed by Twissu"}</p>
          <div className="flex items-center gap-4 text-gray-500">
            {bottomNavItems.map((item, index) => (
              <a key={index} href={item.url} className="hover:text-gray-900">
                {item.text}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
