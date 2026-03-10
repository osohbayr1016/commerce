import { NextResponse } from "next/server";
import { checkQpayPayment } from "@/lib/qpay";

interface CheckBody {
  invoiceId?: string;
  objectId?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as CheckBody;
    const objectId = body.invoiceId || body.objectId;

    if (!objectId || typeof objectId !== "string") {
      return NextResponse.json(
        { error: "objectId (invoiceId) шаардлагатай" },
        { status: 400 },
      );
    }

    const result = await checkQpayPayment(objectId);

    const row = result.rows?.[0];
    const status = row?.payment_status || "UNKNOWN";

    return NextResponse.json(
      {
        status,
        paidAmount: Number(result.paid_amount || row?.payment_amount || 0),
      },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("QPay payment check API error:", err);
    return NextResponse.json(
      {
        error: "QPay төлбөр шалгахад алдаа гарлаа",
        details: message,
      },
      { status: 502 },
    );
  }
}

