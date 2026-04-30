"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Product, Category, ProductVariant, getErrorMessage } from "@/types";
import type { ProductType } from "@/types";
import { getDefaultSizeForType } from "@/lib/product-types";
import ImageUploader from "@/components/admin/ImageUploader";
import ProductFormStockSection from "./ProductFormStockSection";
import ProductFormNameSection from "./ProductFormNameSection";
import ProductFormDescriptionSection from "./ProductFormDescriptionSection";
import { getLocalizedName } from "@/lib/localize";

import { z } from "zod";
import { ProductSchema } from "./ProductFormSchema";

function buildInitialSizeStocks(
  _productType: ProductType,
  sizeOnlyVariants?: ProductVariant[],
): Record<number, number> {
  const noColor = sizeOnlyVariants?.filter(
    (v) => v.color == null || v.color === "",
  );
  if (noColor?.length) {
    const out: Record<number, number> = {};
    noColor.forEach((v) => {
      if (v.size != null) out[v.size] = v.stock ?? 0;
    });
    return out;
  }
  return {};
}

export default function ProductForm({
  product,
  productVariants,
}: {
  product?: Product;
  productVariants?: ProductVariant[];
}) {
  const productType = (product?.product_type as ProductType) || "shoes";
  const p = product as Record<string, unknown> | undefined;
  const [formData, setFormData] = useState({
    name_en: product?.name_en || "",
    name_mn: product?.name_mn || "",
    name_ru: product?.name_ru || "",
    name_zh: product?.name_zh || "",
    name_it: product?.name_it || "",
    brand: product?.brand || "",
    sku: product?.sku || "",
    price: product?.price || 0,
    original_price: product?.original_price || 0,
    discount: product?.discount || 0,
    stock: product?.stock || 0,
    description_en: (p?.description_en as string) || (p?.description as string) || "",
    description_mn: (p?.description_mn as string) || (p?.description as string) || "",
    description_ru: (p?.description_ru as string) || "",
    description_zh: (p?.description_zh as string) || "",
    description_it: (p?.description_it as string) || "",
    subcategory: product?.subcategory || "",
    category_id: product?.category_id?.toString() ?? "",
    brand_color: product?.brand_color || "#F5F5F5",
    image_color: product?.image_color || "#FAFAFA",
    has_financing: product?.has_financing || false,
    availability_status: product?.availability_status ?? "",
    default_rating: product?.default_rating ?? "",
  });
  const [type, setType] = useState<ProductType>(productType);
  const [sizeStocks, setSizeStocks] = useState<Record<number, number>>(() =>
    buildInitialSizeStocks(productType, productVariants),
  );

  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [colors, setColors] = useState<string[]>(product?.colors || []);
  const [colorInput, setColorInput] = useState("");
  const [colorSizeStocks, setColorSizeStocks] = useState<
    Record<string, Record<number, number>>
  >(() => {
    const withColor = productVariants?.filter(
      (v) => v.color != null && v.color !== "",
    );
    if (!withColor?.length) return {};
    const byColor: Record<string, Record<number, number>> = {};
    for (const v of withColor) {
      const color = v.color!;
      if (!byColor[color]) byColor[color] = {};
      if (v.size != null) byColor[color][v.size] = v.stock ?? 0;
    }
    return byColor;
  });
  const router = useRouter();
  const supabase = createClient();
  const prevTypeRef = useRef(type);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
  }, []);

  useEffect(() => {
    if (prevTypeRef.current !== type) {
      prevTypeRef.current = type;
      setSizeStocks({});
    }
  }, [type]);

  function handleAddSize() {
    const nextSize =
      Object.keys(sizeStocks).length === 0
        ? getDefaultSizeForType(type)
        : Math.max(0, ...Object.keys(sizeStocks).map(Number), 0) + 1;
    setSizeStocks((prev) => ({ ...prev, [nextSize]: 0 }));
  }

  function handleRemoveSize(size: number) {
    setSizeStocks((prev) => {
      const next = { ...prev };
      delete next[size];
      return next;
    });
  }

  async function fetchCategories() {
    const { data } = await supabase
      .from("categories")
      .select("id, name, name_en, name_mn, name_ru, name_zh, name_it, slug, parent_id, display_order")
      .order("display_order", { ascending: true });
    if (data) setCategories(data);
  }

  async function fetchBrands() {
    const res = await fetch("/api/admin/brands");
    const data = await res.json().catch(() => []);
    if (Array.isArray(data)) setBrands(data);
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Zod Phase: Strict Schema Validation
      ProductSchema.parse(formData);
      
      const isNoSize = type === "beauty" || type === "other";
      const sizesArray = isNoSize
        ? []
        : Object.keys(sizeStocks)
            .map(Number)
            .filter((n) => !isNaN(n) && n >= 0)
            .sort((a, b) => a - b);
      const stock = isNoSize ? parseInt(formData.stock.toString(), 10) : 0;

      const title =
        formData.name_en ||
        formData.name_mn ||
        formData.name_ru ||
        formData.name_zh ||
        formData.name_it ||
        "Untitled Product";
      const productData = {
        title,
        name_en: formData.name_en,
        name_mn: formData.name_mn,
        name_ru: formData.name_ru || null,
        name_zh: formData.name_zh || null,
        name_it: formData.name_it || null,
        brand: formData.brand,
        sku: formData.sku,
        price: parseInt(formData.price.toString(), 10),
        original_price: parseInt(formData.original_price.toString(), 10),
        discount: parseInt(formData.discount.toString(), 10),
        stock,
        sizes: sizesArray,
        product_type: type,
        description_en: formData.description_en || null,
        description_mn: formData.description_mn || null,
        description_ru: formData.description_ru || null,
        description_zh: formData.description_zh || null,
        description_it: formData.description_it || null,
        subcategory: (() => {
          if (!formData.category_id || !categories.length)
            return formData.subcategory;
          const c = categories.find(
            (x) => x.id === parseInt(formData.category_id, 10),
          );
          return c
            ? getLocalizedName(c, "mn") || c.name || formData.subcategory
            : formData.subcategory;
        })(),
        category_id: formData.category_id
          ? parseInt(formData.category_id.toString(), 10)
          : null,
        brand_color: formData.brand_color,
        image_color: formData.image_color,
        has_financing: formData.has_financing,
        availability_status: formData.availability_status || null,
        default_rating:
          formData.default_rating !== ""
            ? parseFloat(String(formData.default_rating))
            : null,
        images,
        colors: colors.length > 0 ? colors : undefined,
        ...(colors.length > 0
          ? { colorSizeStocks }
          : isNoSize
            ? {}
            : { sizeStocks }),
      };

      if (product?.id) {
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Update failed");
        setMessage("Бүтээгдэхүүн амжилттай шинэчлэгдлээ!");
      } else {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Create failed");
        setMessage("Бүтээгдэхүүн амжилттай нэмэгдлээ!");
      }

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 1500);
    } catch (e: any) {
      if (e instanceof z.ZodError) {
        const errorMessages = e.issues.map((err: z.ZodIssue) => `${err.path.join(".")}: ${err.message}`).join(", ");
        setMessage(`Алдаа: ${errorMessages}`);
      } else {
        setMessage(
          `Алдаа: ${e instanceof Error ? e.message : getErrorMessage(e)}`,
        );
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Зураг</h2>
        <ImageUploader images={images} onImagesChange={setImages} />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Үндсэн мэдээлэл</h2>

        <ProductFormNameSection
          values={formData}
          onChange={(name, value) =>
            setFormData((p) => ({ ...p, [name]: value }))
          }
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Брэнд *
            </label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Барааны Код *
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Бэлэн байдал
            </label>
            <select
              name="availability_status"
              value={formData.availability_status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Сонгоно уу</option>
              <option value="order">Захиалгаар ирэх</option>
              <option value="in_stock">бэлэн байгаа</option>
            </select>
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Үнэлгээ (1-5)
            </label>
            <select
              name="default_rating"
              value={formData.default_rating}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Сонгоно уу</option>
              <option value="1">1 од</option>
              <option value="2">2 од</option>
              <option value="3">3 од</option>
              <option value="4">4 од</option>
              <option value="5">5 од</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Тайлбар
          </label>
          <ProductFormDescriptionSection
            values={formData}
            onChange={(name, value) =>
              setFormData((p) => ({ ...p, [name]: value }))
            }
          />
        </div>

        <div>
          <label className="block text-base font-semibold text-black mb-2">
            Өнгө
          </label>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="color"
              value={colorInput || "#000000"}
              onChange={(e) => setColorInput(e.target.value)}
              className="w-14 h-14 p-1 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <button
              type="button"
              onClick={() => {
                const v = colorInput.trim();
                if (v && !colors.includes(v)) {
                  setColors((c) => [...c, v]);
                  setColorSizeStocks((prev) => ({
                    ...prev,
                    [v]:
                      productType === "other"
                        ? { 0: 0 }
                        : ({} as Record<number, number>),
                  }));
                  setColorInput("");
                }
              }}
              className="px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 whitespace-nowrap"
            >
              Нэмэх
            </button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-lg text-sm"
                >
                  {c}
                  <button
                    type="button"
                    onClick={() => {
                      setColors((arr) => arr.filter((x) => x !== c));
                      setColorSizeStocks((prev) => {
                        const next = { ...prev };
                        delete next[c];
                        return next;
                      });
                    }}
                    className="text-gray-500 hover:text-red-600 ml-0.5"
                    aria-label={`${c} устгах`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <h2 className="text-xl font-bold text-black mb-4">Үнийн мэдээлэл</h2>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Үнэ *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Анхны үнэ *
            </label>
            <input
              type="number"
              name="original_price"
              value={formData.original_price}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Хөнгөлөлт (%)
            </label>
            <input
              type="number"
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              min="0"
              max="100"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>
      </div>

      <ProductFormStockSection
        productType={type}
        setProductType={setType}
        sizeStocks={sizeStocks}
        setSizeStocks={setSizeStocks}
        onAddSize={handleAddSize}
        onRemoveSize={handleRemoveSize}
        stock={formData.stock}
        onStockChange={(v) => setFormData((p) => ({ ...p, stock: v }))}
        categoryId={formData.category_id}
        onCategoryChange={(v) => setFormData((p) => ({ ...p, category_id: v }))}
        subcategory={formData.subcategory}
        onSubcategoryChange={(v) =>
          setFormData((p) => ({ ...p, subcategory: v }))
        }
        hasFinancing={formData.has_financing}
        onHasFinancingChange={(v) =>
          setFormData((p) => ({ ...p, has_financing: v }))
        }
        categories={categories}
        colors={colors}
        colorSizeStocks={colorSizeStocks}
        setColorSizeStocks={setColorSizeStocks}
      />

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("амжилттай")
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className={`px-6 py-3 rounded-lg text-base font-medium transition-colors ${
            loading
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-900 text-white hover:bg-gray-800"
          }`}
        >
          {loading ? "Хадгалж байна..." : product?.id ? "Шинэчлэх" : "Нэмэх"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Цуцлах
        </button>
      </div>
    </form>
  );
}
