

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;


export function pageview(url: string): void {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
}


export function event({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}): void {
  if (typeof window !== "undefined" && window.gtag && GA_MEASUREMENT_ID) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}


export function trackPurchase(orderId: string, amount: number): void {
  event({
    action: "purchase",
    category: "ecommerce",
    label: orderId,
    value: amount,
  });
}

export function trackAddToCart(productId: string, productName: string): void {
  event({
    action: "add_to_cart",
    category: "ecommerce",
    label: `${productId}: ${productName}`,
  });
}

export function trackProductView(productId: string, productName: string): void {
  event({
    action: "view_item",
    category: "ecommerce",
    label: `${productId}: ${productName}`,
  });
}
