import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maayaauvuu.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/auth/callback", "/debug-auth"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
