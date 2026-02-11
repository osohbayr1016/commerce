import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { CartItem } from "@/contexts/CartContext";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

interface OrderPayload {
  items: CartItem[];
  customer: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
    city?: string;
    district?: string;
    zip?: string;
    note?: string;
  };
  paymentMethod?: string;
  coinPayment?: {
    coinsUsed: number;
    totalInMNT: number;
  };
}

export async function POST(request: Request) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();
    const adminClient = createAdminClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let payload: OrderPayload;
    try {
      payload = (await request.json()) as OrderPayload;
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    if (!payload.items || payload.items.length === 0) {
      return NextResponse.json({ error: "Empty cart" }, { status: 400 });
    }

    const customer = payload.customer;
    if (
      !customer ||
      typeof customer.fullName !== "string" ||
      typeof customer.phone !== "string" ||
      typeof customer.email !== "string" ||
      typeof customer.address !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Missing or invalid customer fields (fullName, phone, email, address)",
        },
        { status: 400 },
      );
    }

    const totalAmount = Math.round(
      payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    );

    const isGuest = !user;

    // Handle coin payment (only for logged-in users)
    if (payload.paymentMethod === "coins" && payload.coinPayment) {
      if (isGuest) {
        return NextResponse.json(
          { error: "Зочин монетоор төлбөр төлөх боломжгүй" },
          { status: 400 },
        );
      }

      const { coinsUsed } = payload.coinPayment;

      // Check if user has enough coins
      const { data: profile, error: profileError } = await adminClient
        .from("profiles")
        .select("coin_balance")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 },
        );
      }

      if (profile.coin_balance < coinsUsed) {
        return NextResponse.json(
          { error: "Хангалтгүй монет үлдэгдэл" },
          { status: 400 },
        );
      }

      // Deduct coins using the function (negative amount for spending)
      const { error: coinError } = await adminClient.rpc("update_coin_balance", {
        p_user_id: user.id,
        p_amount: -coinsUsed,
        p_transaction_type: "spend",
        p_description: `Захиалга #pending - ${coinsUsed} монет ашигласан`,
      });

      if (coinError) {
        console.error("Error deducting coins:", coinError);
        return NextResponse.json(
          { error: "Монет хасахад алдаа гарлаа" },
          { status: 500 },
        );
      }
    }

    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .insert({
        user_id: isGuest ? null : user.id,
        total_amount: totalAmount,
        status: "pending",
        earned_xp: 0,
        full_name: customer.fullName,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city ?? null,
        district: customer.district ?? null,
        zip: customer.zip ?? null,
        note: customer.note ?? null,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order creation DB error:", orderError); // Log the specific error

      // If order creation failed after deducting coins, refund them
      if (
        payload.paymentMethod === "coins" &&
        payload.coinPayment &&
        !isGuest
      ) {
        await adminClient.rpc("update_coin_balance", {
          p_user_id: user.id,
          p_amount: payload.coinPayment.coinsUsed,
          p_transaction_type: "refund",
          p_description: "Захиалга үүсгэхэд алдаа гарсан тул буцаасан",
        });
      }
      return NextResponse.json(
        {
          error: "Order create failed",
          details: orderError?.message || "Unknown error",
        },
        { status: 500 },
      );
    }

    // Update transaction with order_id if paid with coins
    if (payload.paymentMethod === "coins" && payload.coinPayment && !isGuest) {
      await adminClient
        .from("coin_transactions")
        .update({ order_id: order.id })
        .eq("user_id", user.id)
        .eq("transaction_type", "spend")
        .is("order_id", null)
        .order("created_at", { ascending: false })
        .limit(1);
    }

    const itemsPayload = payload.items.map((item) => ({
      order_id: order.id,
      product_id: String(item.id),
      quantity: Math.max(1, Math.floor(Number(item.quantity))),
      price_at_purchase: Math.max(0, Math.round(Number(item.price))),
      size: item.size ?? null,
    }));

    const { error: itemsError } = await adminClient
      .from("order_items")
      .insert(itemsPayload);

    if (itemsError) {
      console.error("Order items insert error:", itemsError);
      return NextResponse.json(
        {
          error: "Order items failed",
          details: itemsError.message,
        },
        { status: 500 },
      );
    }

    // Decrement product (or variant) stock for each order line
    for (const item of itemsPayload) {
      const { error: rpcError } = await adminClient.rpc(
        "decrement_product_stock_on_order",
        {
          p_product_id: item.product_id,
          p_size: item.size ?? null,
          p_quantity: item.quantity,
        },
      );

      if (rpcError) {
        console.error(
          "Stock decrement RPC error for product",
          item.product_id,
          rpcError.message,
        );
        // Fallback: decrement products.stock directly (e.g. when migration not run)
        try {
          const { data: product } = await adminClient
            .from("products")
            .select("stock")
            .eq("id", item.product_id)
            .single();
          if (product && typeof product.stock === "number") {
            const newStock = Math.max(0, product.stock - item.quantity);
            await adminClient
              .from("products")
              .update({ stock: newStock })
              .eq("id", item.product_id);
          }
        } catch (fallbackErr) {
          console.error(
            "Stock decrement fallback error for product",
            item.product_id,
            fallbackErr,
          );
        }
      }
    }

    // Award referral discount to referrer if applicable
    if (!isGuest && user) {
      try {
        const { data: referralResult, error: referralError } =
          await adminClient.rpc("award_referral_discount", {
            p_buyer_user_id: user.id,
            p_order_id: order.id,
            p_purchase_amount: totalAmount,
          });

        if (referralError) {
          console.error("Error awarding referral discount:", referralError);
          // Don't fail the order if referral award fails
        } else if (referralResult?.discount_awarded) {
          console.log("Referral discount awarded:", referralResult);
          // TODO: Trigger realtime notification via Durable Object
          // This will be implemented in the WebSocket section
        }
      } catch (referralErr) {
        console.error("Exception in referral award:", referralErr);
        // Don't fail the order
      }
    }

    return NextResponse.json({ orderId: order.id }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("POST /api/orders error:", err);
    return NextResponse.json(
      { error: "Order creation failed", details: message },
      { status: 500 },
    );
  }
}
