import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
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
  // Apply strict rate limiting - 5 requests per minute for order creation
  const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
  if (rateLimitResponse) return rateLimitResponse;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Allow guest checkout - user can be null
  // if (!user) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  const payload = (await request.json()) as OrderPayload;

  if (!payload.items || payload.items.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const totalAmount = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  // Check if user is logged in
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
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("coin_balance")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    if (profile.coin_balance < coinsUsed) {
      return NextResponse.json(
        { error: "Хангалтгүй монет үлдэгдэл" },
        { status: 400 },
      );
    }

    // Deduct coins using the function (negative amount for spending)
    const { error: coinError } = await supabase.rpc("update_coin_balance", {
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

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: isGuest ? null : user.id,
      total_amount: totalAmount,
      status: "pending",
      earned_xp: 0,
      full_name: payload.customer.fullName,
      phone: payload.customer.phone,
      email: payload.customer.email,
      address: payload.customer.address,
      city: payload.customer.city || null,
      district: payload.customer.district || null,
      zip: payload.customer.zip || null,
      note: payload.customer.note || null,
    })
    .select("id")
    .single();

  if (orderError || !order) {
    console.error("Order creation DB error:", orderError); // Log the specific error

    // If order creation failed after deducting coins, refund them
    if (payload.paymentMethod === "coins" && payload.coinPayment && !isGuest) {
      await supabase.rpc("update_coin_balance", {
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
    await supabase
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
    product_id: item.id,
    quantity: item.quantity,
    price_at_purchase: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsPayload);

  if (itemsError) {
    return NextResponse.json({ error: "Order items failed" }, { status: 500 });
  }

  // Award referral discount to referrer if applicable
  if (!isGuest && user) {
    try {
      const { data: referralResult, error: referralError } = await supabase.rpc(
        "award_referral_discount",
        {
          p_buyer_user_id: user.id,
          p_order_id: order.id,
          p_purchase_amount: totalAmount,
        },
      );

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
}
