import MainNav from "@/components/Header/MainNav";
import ProductImageGallery from "@/components/ProductDetail/ProductImageGallery";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import ProductSection from "@/components/Products/ProductSection";
import ProductRecommendations from "@/components/Products/ProductRecommendations";
import ReviewList from "@/components/Reviews/ReviewList";
import Breadcrumb from "@/components/ProductDetail/Breadcrumb";
import CompareButton from "@/components/ProductDetail/CompareButton";
import BackButton from "@/components/ui/BackButton";
import Footer from "@/components/Footer/Footer";
import ProductDetailErrorBoundary from "@/components/ProductDetail/ProductDetailErrorBoundary";
import { createClient } from "@/lib/supabase/server";
import { ProductDetail } from "@/data/mockProductDetail";
import { Product } from "@/data/mockProducts";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

export const revalidate = 300;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();

  const uuidMatch = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  );
  const numericMatch = slug.match(/\d+$/);
  const lookupId = uuidMatch?.[0] || numericMatch?.[0];

  const filter = lookupId
    ? `id.eq.${lookupId},sku.eq.${lookupId},sku.eq.#${lookupId}`
    : `sku.eq.${slug},sku.eq.#${slug}`;

  const { data: dbProduct } = await supabase
    .from("products")
    .select("title, name_en, description_en, images")
    .or(filter)
    .single();

  if (!dbProduct) {
    return {
      title: "Product Not Found",
    };
  }

  const title = dbProduct.name_en || dbProduct.title || "Luxury Product";
  const desc = dbProduct.description_en || "Experience premium quality with our carefully curated collection.";
  const image = Array.isArray(dbProduct.images) && dbProduct.images.length > 0 
    ? dbProduct.images[0] 
    : undefined;

  return {
    title: `${title} | Your Luxury Brand`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: image ? [image] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: desc,
      images: image ? [image] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const uuidMatch = slug.match(
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
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
    nameRu: dbProduct.name_ru || "",
    nameZh: dbProduct.name_zh || "",
    nameIt: dbProduct.name_it || "",
    sku: dbProduct.sku || "",
    category: "Эмэгтэй",
    subcategory: dbProduct.subcategory || "Гутал",
    price: dbProduct.price || 0,
    originalPrice: dbProduct.original_price || dbProduct.price || 0,
    discount: dbProduct.discount || 0,
    savings: (dbProduct.original_price || 0) - (dbProduct.price || 0),
    sizes: dbProduct.sizes ?? [36, 37, 38, 39],
    colors: Array.isArray(dbProduct.colors) ? dbProduct.colors : [],
    productType:
      (dbProduct.product_type as ProductDetail["productType"]) || "shoes",
    description: dbProduct.description,
    descriptionEn: dbProduct.description_en || "",
    descriptionMn: dbProduct.description_mn || "",
    descriptionRu: dbProduct.description_ru || "",
    descriptionZh: dbProduct.description_zh || "",
    descriptionIt: dbProduct.description_it || "",
    images: productImages,
    brandColor: dbProduct.brand_color || "#F5F5F5",
    imageColor: dbProduct.image_color || "#FAFAFA",
    hasFinancing: dbProduct.has_financing || false,
    availabilityStatus:
      dbProduct.availability_status === "order" ||
      dbProduct.availability_status === "in_stock"
        ? dbProduct.availability_status
        : undefined,
    stock: typeof dbProduct.stock === "number" ? dbProduct.stock : undefined,
  };

  const [relatedProductsResult, reviewStatsResult] = await Promise.all([
    supabase
      .from("products")
      .select(
        "id, brand, name_en, name_mn, name_ru, name_zh, name_it, title, subcategory, price, original_price, discount, brand_color, image_color, images",
      )
      .eq("subcategory", dbProduct.subcategory)
      .neq("id", dbProduct.id)
      .order("created_at", { ascending: false })
      .limit(8),
    supabase
      .from("product_reviews")
      .select("rating")
      .eq("product_id", dbProduct.id),
  ]);

  let relatedProducts: Product[] = [];
  let averageRating = 0;
  let totalReviews = 0;

  if (relatedProductsResult.data) {
    relatedProducts = relatedProductsResult.data.map((item: any) => ({
      id: item.id,
      brand: item.brand || "",
      nameEn: item.name_en || item.title || "",
      nameMn: item.name_mn || "",
      nameRu: item.name_ru || "",
      nameZh: item.name_zh || "",
      nameIt: item.name_it || "",
      category: item.subcategory?.toLowerCase().includes("цүнх")
        ? "bag"
        : "boots",
      price: item.price || 0,
      originalPrice: item.original_price || item.price || 0,
      discount: item.discount,
      stock: 0,
      sizes: [],
      brandColor: item.brand_color || "#F5F5F5",
      imageColor: item.image_color || "#FAFAFA",
      images:
        Array.isArray(item.images) && item.images.length > 0 ? item.images : [],
    }));
  }

  if (reviewStatsResult.data && reviewStatsResult.data.length > 0) {
    totalReviews = reviewStatsResult.data.length;
    averageRating =
      reviewStatsResult.data.reduce(
        (sum: number, r: any) => sum + r.rating,
        0,
      ) / totalReviews;
  } else if (
    dbProduct.default_rating != null &&
    dbProduct.default_rating >= 1 &&
    dbProduct.default_rating <= 5
  ) {
    averageRating = Number(dbProduct.default_rating);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainNav />

      <main className="flex-1 py-8 md:py-12">
        <ProductDetailErrorBoundary>
          <Breadcrumb
          items={[
            { labelKey: "nav.home", href: "/" },
            ...(category
              ? [
                  {
                    category,
                    href: `/categories/${category.path ?? category.slug}`,
                  },
                ]
              : []),
            { product },
          ]}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <BackButton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <ProductImageGallery
                images={product.images}
                imageColor={product.imageColor}
                productName={product.nameEn || product.nameMn || "Product"}
              />
            </div>

            <div className="space-y-4">
              <ProductInfo product={product} />
              <CompareButton product={product} />
            </div>
          </div>

          <div className="max-w-4xl">
            <ProductDescription product={product} />
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
        </ProductDetailErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
