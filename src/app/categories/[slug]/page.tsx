import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductSection from "@/components/Products/ProductSection";
import MainNav from "@/components/Header/MainNav";
import Footer from "@/components/Footer/Footer";
import { Product } from "@/data/mockProducts";
import { Category } from "@/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category: Category | null = null;
  let products: Product[] = [];

  try {
    const supabase = await createClient();
    
    // Fetch category by slug
    const { data: categoryData, error: categoryError } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (categoryError || !categoryData) {
      notFound();
    }

    category = categoryData as Category;

    // Fetch products in this category
    const { data: productsData } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });

    if (productsData) {
      products = productsData.map((p: any) => ({
        id: p.id,
        brand: p.brand || "",
        nameEn: p.name_en || p.title || "",
        nameMn: p.name_mn || "",
        category: (p.subcategory?.toLowerCase().includes("цүнх") ? "bag" : "boots") as "boots" | "bag",
        price: p.price || 0,
        originalPrice: p.original_price || p.price || 0,
        discount: p.discount,
        brandColor: p.brand_color || "#F5F5F5",
        imageColor: p.image_color || "#FAFAFA",
        images: p.images || [],
      }));
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    notFound();
  }

  if (!category) {
    notFound();
  }

  // Category is guaranteed to be non-null after the check above
  const categoryName = category!.name_mn || category!.name_en || category!.name;

  return (
    <div className="min-h-screen flex flex-col">
      <MainNav />
      <main className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-6">
            <a
              href="/categories"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Буцах
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {categoryName}
          </h1>
          {products.length > 0 ? (
            <ProductSection products={products} />
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-600 text-lg">
                Энэ ангилалд бүтээгдэхүүн байхгүй байна
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
