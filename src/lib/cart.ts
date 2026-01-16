import { CartItem } from "@/contexts/CartContext";

export async function syncCartToServer(items: CartItem[]): Promise<void> {
  try {
    for (const item of items) {
      await addItemToServerCart(item.id, item.quantity, item.size);
    }
  } catch (error) {
  }
}

export async function fetchCartFromServer(): Promise<CartItem[]> {
  try {
    const response = await fetch("/api/cart");
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    return [];
  }
}

export async function addItemToServerCart(
  productId: string,
  quantity: number,
  size?: number
): Promise<boolean> {
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        size: size || null,
      }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function updateItemInServerCart(
  productId: string,
  quantity: number,
  size?: number
): Promise<boolean> {
  try {
    const response = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: productId,
        quantity,
        size: size || null,
      }),
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

export async function removeItemFromServerCart(
  productId: string,
  size?: number
): Promise<boolean> {
  try {
    const url = new URL("/api/cart", window.location.origin);
    url.searchParams.set("product_id", productId);
    if (size) {
      url.searchParams.set("size", size.toString());
    }

    const response = await fetch(url.toString(), {
      method: "DELETE",
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}
