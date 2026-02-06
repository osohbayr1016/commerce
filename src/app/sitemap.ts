import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://maayaauvuu.com";

  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .limit(1000);

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, updated_at")
    .limit(100);

  const productUrls =
    products?.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: product.updated_at
        ? new Date(product.updated_at)
        : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) || [];

  const categoryUrls =
    categories?.map((category) => ({
      url: `${baseUrl}/categories/${category.slug}`,
      lastModified: category.updated_at
        ? new Date(category.updated_at)
        : new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
