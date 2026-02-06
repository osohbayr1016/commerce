import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../ProductForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: sizeOnlyVariants } = await supabase
    .from("product_variants")
    .select("id, product_id, color, material, size, stock")
    .eq("product_id", id)
    .is("color", null)
    .is("material", null);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">
          Бүтээгдэхүүн засах
        </h1>
        <p className="text-base text-gray-600">
          {product.name_en || product.title}
        </p>
      </div>

      <ProductForm
        product={product}
        productVariants={sizeOnlyVariants ?? undefined}
      />
    </div>
  );
}
