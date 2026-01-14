import { createClient } from "@/lib/supabase/client";

/**
 * Track product view for analytics and recently viewed products
 * @param productId - UUID of the product
 * @param userId - UUID of the user (optional for guests)
 */
export async function trackProductView(
  productId: string,
  userId?: string
): Promise<void> {
  const supabase = createClient();

  try {
    // Get or create session ID for guests
    let sessionId = null;
    if (!userId) {
      sessionId = localStorage.getItem("session_id");
      if (!sessionId) {
        sessionId = `guest_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 9)}`;
        localStorage.setItem("session_id", sessionId);
      }
    }

    await supabase.from("product_views").insert([
      {
        product_id: productId,
        user_id: userId || null,
        session_id: sessionId,
        viewed_at: new Date().toISOString(),
      },
    ]);
  } catch (error) {
    // Silently fail - tracking shouldn't break the app
    console.debug("Failed to track product view:", error);
  }
}

/**
 * Add product to wishlist
 * @param productId - UUID of the product
 * @param userId - UUID of the user
 */
export async function addToWishlist(
  productId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase.from("wishlist").insert([
      {
        product_id: productId,
        user_id: userId,
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        // Already in wishlist
        return { success: true };
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Remove product from wishlist
 * @param productId - UUID of the product
 * @param userId - UUID of the user
 */
export async function removeFromWishlist(
  productId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient();

  try {
    const { error } = await supabase
      .from("wishlist")
      .delete()
      .eq("product_id", productId)
      .eq("user_id", userId);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check if product is in user's wishlist
 * @param productId - UUID of the product
 * @param userId - UUID of the user
 */
export async function isInWishlist(
  productId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("wishlist")
      .select("id")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 is "not found" error
      throw error;
    }

    return !!data;
  } catch (error) {
    console.debug("Failed to check wishlist:", error);
    return false;
  }
}
