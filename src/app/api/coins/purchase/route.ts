import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiError } from '@/lib/api-errors';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
import { createQpayInvoice } from '@/lib/qpay';

const COIN_PRICE_MNT = 1000; // 1 coin = 1000 MNT

export async function POST(request: NextRequest) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return apiError('Нэвтэрч орно уу', 401);
    }

    const body = await request.json();
    const { coinAmount } = body;

    // Validate coin amount
    if (!coinAmount || coinAmount < 1 || !Number.isInteger(coinAmount)) {
      return apiError('Зөв тооны монет сонгоно уу', 400);
    }

    const totalPrice = coinAmount * COIN_PRICE_MNT;

    // In a real application, you would integrate with a payment gateway here
    // For now, we'll simulate a successful payment -> Changed to QPAY implementation
    
    try {
      // QPay senderInvoiceNo max length is 32 chars
      const shortId = `CN${Date.now().toString(36).toUpperCase()}`;
      const qpayInvoice = await createQpayInvoice({
        amount: totalPrice,
        senderInvoiceNo: shortId,
        description: `Монет авах: ${coinAmount} ширхэг`,
        callbackUrl: `${process.env.NEXT_PUBLIC_SITE_URL || "https://maayaauvuu.com"}/api/coins/qpay-callback`,
      });

      return NextResponse.json({
        success: true,
        qpay: qpayInvoice,
        coinAmount,
        totalPrice,
      });
    } catch (qpayError) {
      const msg = qpayError instanceof Error ? qpayError.message : String(qpayError);
      console.error("QPay invoice error:", msg);
      return apiError(`QPay нэхэмжлэл үүсгэхэд алдаа гарлаа: ${msg}`, 502);
    }

  } catch (error) {
    console.error('Error in coin purchase:', error);
    return apiError('Алдаа гарлаа. Дахин оролдоно уу.', 500);
  }
}
