export function generateSlug(name: string, sku?: string): string {
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  if (sku) {
    const skuPart = sku.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
    return `${baseSlug}-${skuPart}`;
  }
  
  return baseSlug;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("mn-MN").format(price);
}

const localeByCurrency: Record<string, string> = {
  MNT: "mn-MN",
  EUR: "de-DE",
  USD: "en-US",
};

export function formatCurrency(
  amount: number,
  currency: "MNT" | "EUR" | "USD" = "MNT",
  locale?: string
): string {
  const loc = locale || localeByCurrency[currency] || "en-US";
  return new Intl.NumberFormat(loc, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
