import type { ProductType } from "@/types";

export const SHOES_SIZES = [36, 37, 38, 39] as const;
export const CLOTHES_SIZES = [1, 2, 3, 4] as const; // 1=S, 2=M, 3=L, 4=XL
export const CLOTHES_SIZE_LABELS: Record<number, string> = {
  1: "S",
  2: "M",
  3: "L",
  4: "XL",
};

export function getSizeLabel(
  productType: ProductType | undefined,
  size: number,
): string {
  if (productType === "clothes" && size in CLOTHES_SIZE_LABELS) {
    return CLOTHES_SIZE_LABELS[size as keyof typeof CLOTHES_SIZE_LABELS];
  }
  return String(size);
}

export function getSizesForType(type: ProductType): number[] {
  if (type === "shoes") return [...SHOES_SIZES];
  if (type === "clothes") return [...CLOTHES_SIZES];
  return [];
}

export function getDefaultSizeForType(type: ProductType): number {
  if (type === "shoes") return 36;
  if (type === "clothes") return 1;
  return 0;
}
