import MainNav from "@/components/Header/MainNav";
import ProductImageGallery from "@/components/ProductDetail/ProductImageGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import ProductSection from "@/components/Products/ProductSection";
import ProductRecommendations from "@/components/Products/ProductRecommendations";
import ReviewList from "@/components/Reviews/ReviewList";
import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import CompareButton from "@/components/ProductDetail/CompareButton";
import Footer from "@/components/Footer/Footer";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/data/mockProductDetail";
import { Product } from "@/data/mockProducts";
import { notFound } from "next/navigation";

export const revalidate = 300;

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
    .select("*, categories(*)")
    .or(filter)
    .single();

  if (!dbProduct) {
    notFound();
  }

  const category = dbProduct.categories as any;

  
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
  let averageRating = 0;
  let totalReviews = 0;

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
  }

  
  try {
    const { data: reviewStats } = await supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", dbProduct.id);

    if (reviewStats && reviewStats.length > 0) {
      totalReviews = reviewStats.length;
      averageRating =
        reviewStats.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    }
  } catch (error) {
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />
      
      <main className="flex-1 py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: "Нүүр", href: "/" },
            ...(category
              ? [{ label: category.name_mn || category.name_en || category.name || "Ангилал", href: `/categories/${category.slug}` }]
              : []),
            { label: product.nameEn || product.nameMn || "Бүтээгдэхүүн" },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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

          <div className="max-w-4xl mt-12 border-t border-gray-200 pt-8">
            <ReviewList
              productId={product.id}
              averageRating={averageRating}
              totalReviews={totalReviews}
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

          <ProductRecommendations productId={product.id} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
