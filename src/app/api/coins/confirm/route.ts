import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { checkQpayPayment } from "@/lib/qpay";
import { apiError } from "@/lib/api-errors";
import { rateLimit, RateLimitPresets } from "@/lib/rate-limit";

const COIN_PRICE_MNT = 1000;

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return apiError("Нэвтэрч орно уу", 401);
    }

    const body = await request.json();
    const { invoiceId, coinAmount } = body;

    if (!invoiceId || !coinAmount) {
      return apiError("Мэдээлэл дутуу байна", 400);
    }

    const adminClient = createAdminClient();

    // Check if this invoice is already processed
    const { data: existingTx } = await adminClient
      .from("coin_transactions")
      .select("id")
      .eq("order_id", invoiceId)
      .single();

    if (existingTx) {
      return NextResponse.json({ status: "already_paid" }, { status: 200 });
    }

    // Check payment status from Qpay
    const result = await checkQpayPayment(invoiceId);
    const row = result.rows?.[0];
    const status = row?.payment_status || "UNKNOWN";

    if (status === "PAID") {
      const totalPrice = coinAmount * COIN_PRICE_MNT;
      
      // Update coin balance
      const { error: updateError } = await adminClient.rpc("update_coin_balance", {
        p_user_id: user.id,
        p_amount: coinAmount,
        p_transaction_type: "purchase",
        p_description: `Qpay-ээр худалдан авсан: ${coinAmount} монет (₮${totalPrice.toLocaleString()})`,
      });

      if (updateError) {
        console.error("Error updating coin balance:", updateError);
        return apiError("Монет нэмэхэд алдаа гарлаа", 500);
      }

      // Mark the transaction with the invoice ID to prevent double claiming
      await adminClient
        .from("coin_transactions")
        .update({ order_id: invoiceId })
        .eq("user_id", user.id)
        .eq("transaction_type", "purchase")
        .is("order_id", null)
        .order("created_at", { ascending: false })
        .limit(1);

      return NextResponse.json({ status: "paid" }, { status: 200 });
    }

    return NextResponse.json({ status: "pending" }, { status: 200 });

  } catch (error) {
    console.error("Error in coin confirm:", error);
    return apiError("Алдаа гарлаа. Дахин оролдоно уу.", 500);
  }
}
