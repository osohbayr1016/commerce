import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkQpayPayment } from "@/lib/qpay";

interface ConfirmBody {
  orderId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as ConfirmBody;
    const orderId = body.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "orderId шаардлагатай" },
        { status: 400 },
      );
    }

    const adminClient = createAdminClient();

    const { data: order, error: orderError } = await adminClient
      .from("orders")
      .select("id, payment_status, qpay_invoice_id")
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: "Захиалга олдсонгүй" },
        { status: 404 },
      );
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ status: "paid" }, { status: 200 });
    }

    if (!order.qpay_invoice_id) {
      return NextResponse.json(
        { error: "Энэ захиалга QPay нэхэмжлэлгүй байна" },
        { status: 400 },
      );
    }

    const result = await checkQpayPayment(order.qpay_invoice_id);
    const row = result.rows?.[0];
    const status = row?.payment_status || "UNKNOWN";

    if (status === "PAID") {
      await adminClient
        .from("orders")
        .update({
          payment_status: "paid",
          qpay_payment_id: row?.payment_id ?? null,
          payment_confirmed_at: new Date().toISOString(),
        })
        .eq("id", orderId);

      return NextResponse.json({ status: "paid" }, { status: 200 });
    }

    return NextResponse.json({ status: "pending" }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("QPay confirm API error:", err);
    return NextResponse.json(
      {
        error: "QPay төлбөр баталгаажуулахад алдаа гарлаа",
        details: message,
      },
      { status: 502 },
    );
  }
}

