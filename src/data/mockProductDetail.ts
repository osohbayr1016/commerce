export type ProductDetailType = "shoes" | "clothes" | "beauty" | "other";

export interface ProductDetail {
  id: string;
  slug: string;
  brand: string;
  nameEn: string;
  nameMn: string;
  nameRu?: string;
  nameZh?: string;
  nameIt?: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  discount: number;
  savings: number;
  sizes: number[];
  colors?: string[];
  productType?: ProductDetailType;
  description?: string;
  descriptionEn?: string;
  descriptionMn?: string;
  descriptionRu?: string;
  descriptionZh?: string;
  descriptionIt?: string;
  images: string[];
  brandColor: string;
  imageColor: string;
  hasFinancing: boolean;
  availabilityStatus?: "order" | "in_stock";
  /** When defined and 0, product is out of stock. */
  stock?: number;
}

export const mockProductDetail: ProductDetail = {
  id: "3",
  slug: "cindy-c-eric-23-0461",
  brand: "CINDY C ERIC",
  nameEn: "WOMEN HEELED KNEE BOOTS",
  nameMn: "Эмэгтэй урт түрийтэй гутал",
  sku: "#23-0461",
  category: "Эмэгтэй",
  subcategory: "Гутал",
  price: 657000,
  originalPrice: 730000,
  discount: 10,
  savings: 73000,
  sizes: [35, 36, 37, 38, 39, 40],
  description:
    "Эмэгтэйчүүдэд зориулсан урт түрийтэй, өндөр түрийтэй гутал. Чимэглэлтэй, загварлаг дизайн.",
  images: ["image1", "image2", "image3", "image4", "image5"],
  brandColor: "#F5F5F5",
  imageColor: "#FAFAFA",
  hasFinancing: true,
};
