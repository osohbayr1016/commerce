import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOTP } from '@/lib/mail';
import { apiError } from '@/lib/api-errors';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const { email } = await request.json();

    if (!email) {
      return apiError('И-мэйл хаяг шаардлагатай', 400);
    }

    // Use standard client with Anon Key (requires RLS to be open for public insert)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // Store OTP in database
    const { error: dbError } = await supabase
      .from('verification_codes')
      .upsert(
        { 
          email, 
          code: otp, 
          expires_at: expiresAt.toISOString(),
          created_at: new Date().toISOString(),
          verified: false
        },
        { onConflict: 'email' }
      );

    if (dbError) {
      console.error('Database error in OTP Send:', dbError);
      return apiError(
        'Өгөгдлийн сантай холбогдоход алдаа гарлаа. Та дахин оролдоно уу.',
        500,
        'DATABASE_ERROR'
      );
    }

    // Send email
    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      return apiError('И-мэйл илгээхэд алдаа гарлаа', 500);
    }

    return NextResponse.json({ success: true, message: 'Баталгаажуулах код илгээгдлээ' });
  } catch (error: any) {
    console.error('OTP Send Critical Error:', error);
    return apiError('Дотоод алдаа гарлаа', 500);
  }
}
