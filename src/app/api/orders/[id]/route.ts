import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const adminClient = createAdminClient();
    const { id } = await context.params;

    const { data: order, error } = await adminClient
      .from("orders")
      .select("id, payment_method, payment_status")
      .eq("id", id)
      .single();

    if (error || !order) {
      return NextResponse.json(
        { error: "Захиалга олдсонгүй" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        id: order.id,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json(
      { error: "Захиалга уншихад алдаа гарлаа", details: message },
      { status: 500 },
    );
  }
}

