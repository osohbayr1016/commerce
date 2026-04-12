import { z } from "zod";

export const ProductSchema = z.object({
  name_en: z.string().min(1, "English name is required"),
  name_mn: z.string().optional(),
  name_ru: z.string().optional(),
  name_zh: z.string().optional(),
  name_it: z.string().optional(),

  brand: z.string().min(1, "Brand is required"),
  sku: z.string().min(1, "SKU is required"),
  
  price: z.coerce.number().min(0, "Price must be >= 0"),
  original_price: z.coerce.number().min(0, "Original price must be >= 0"),
  discount: z.coerce.number().min(0).max(100).optional(),
  stock: z.coerce.number().min(0).optional(),

  description_en: z.string().optional(),
  description_mn: z.string().optional(),
  description_ru: z.string().optional(),
  description_zh: z.string().optional(),
  description_it: z.string().optional(),

  brand_color: z.string().optional(),
  image_color: z.string().optional(),
  subcategory: z.string().optional(),
  category_id: z.string().optional(),
  has_financing: z.boolean().optional(),
  availability_status: z.string().optional(),
  default_rating: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;
