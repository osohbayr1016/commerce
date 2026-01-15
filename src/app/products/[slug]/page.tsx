import MainNav from "@/components/Header/MainNav";
import ProductImageGallery from "@/components/ProductDetail/ProductImageGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import ProductSection from "@/components/Products/ProductSection";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/data/mockProductDetail";
import { Product } from "@/data/mockProducts";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const uuidMatch = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
  );
  const numericMatch = slug.match(/\d+$/);
  const lookupId = uuidMatch?.[0] || numericMatch?.[0];

  const filter = lookupId
    ? `id.eq.${lookupId},sku.eq.${lookupId},sku.eq.#${lookupId}`
    : `sku.eq.${slug},sku.eq.#${slug}`;

  const { data: dbProduct } = await supabase
    .from("products")
    .select("*")
    .or(filter)
    .single();

  if (!dbProduct) {
    notFound();
  }

  // Convert database product to ProductDetail interface
  const productImages =
    Array.isArray(dbProduct.images) && dbProduct.images.length > 0
      ? dbProduct.images
      : ["image1", "image2", "image3"];

  const product: ProductDetail = {
    id: dbProduct.id,
    slug: slug,
    brand: dbProduct.brand || "",
    nameEn: dbProduct.name_en || dbProduct.title || "",
    nameMn: dbProduct.name_mn || "",
    sku: dbProduct.sku || "",
    category: "Эмэгтэй",
    subcategory: dbProduct.subcategory || "Гутал",
    price: dbProduct.price || 0,
    originalPrice: dbProduct.original_price || dbProduct.price || 0,
    discount: dbProduct.discount || 0,
    savings: (dbProduct.original_price || 0) - (dbProduct.price || 0),
    sizes: dbProduct.sizes || [35, 36, 37, 38, 39, 40],
    description: dbProduct.description,
    images: productImages,
    brandColor: dbProduct.brand_color || "#F5F5F5",
    imageColor: dbProduct.image_color || "#FAFAFA",
    hasFinancing: dbProduct.has_financing || false,
  };

  let relatedProducts: Product[] = [];

  try {
    const { data: relatedData } = await supabase
      .from("products")
      .select("*")
      .eq("subcategory", dbProduct.subcategory)
      .neq("id", dbProduct.id)
      .order("created_at", { ascending: false })
      .limit(8);

    if (relatedData) {
      relatedProducts = relatedData.map((item: any) => ({
        id: item.id,
        brand: item.brand || "",
        nameEn: item.name_en || item.title || "",
        nameMn: item.name_mn || "",
        category: item.subcategory?.toLowerCase().includes("цүнх")
          ? "bag"
          : "boots",
        price: item.price || 0,
        originalPrice: item.original_price || item.price || 0,
        discount: item.discount,
        brandColor: item.brand_color || "#F5F5F5",
        imageColor: item.image_color || "#FAFAFA",
      }));
    }
  } catch (error) {
    console.log("Related products fetch failed:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      
      <main className="flex-1 py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <ProductImageGallery
                images={product.images}
                imageColor={product.imageColor}
                productName={product.nameEn}
              />
            </div>
            
            <div>
              <ProductInfo product={product} />
            </div>
          </div>
          
          <div className="max-w-4xl">
            <ProductDescription
              description={product.description}
              nameMn={product.nameMn}
            />
          </div>

          {relatedProducts.length > 0 && (
            <div className="border-t border-gray-200 mt-10 pt-8">
              <ProductSection
                products={relatedProducts}
                title="Төстэй бүтээгдэхүүн"
              />
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
