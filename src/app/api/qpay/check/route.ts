import { NextResponse } from "next/server";
import { checkQpayPayment } from "@/lib/qpay";
import { apiError } from "@/lib/api-errors";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

interface CheckBody {
  invoiceId?: string;
  objectId?: string;
}

export async function POST(request: Request) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const body = (await request.json().catch(() => ({}))) as CheckBody;
    const objectId = body.invoiceId || body.objectId;

    if (!objectId || typeof objectId !== "string") {
      return apiError("objectId (invoiceId) шаардлагатай", 400);
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
    return apiError("QPay төлбөр шалгахад алдаа гарлаа", 502);
  }
}

