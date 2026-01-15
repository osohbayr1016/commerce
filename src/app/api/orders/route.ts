import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CartItem } from "@/contexts/CartContext";

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
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = (await request.json()) as OrderPayload;

  if (!payload.items || payload.items.length === 0) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }

  const totalAmount = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
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
    return NextResponse.json({ error: "Order create failed" }, { status: 500 });
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

  return NextResponse.json({ orderId: order.id }, { status: 200 });
}
