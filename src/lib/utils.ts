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
  return new Intl.NumberFormat('mn-MN').format(price);
}
