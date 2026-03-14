import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { apiError } from '@/lib/api-errors';
import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const rateLimitResponse = rateLimit(request, RateLimitPresets.STRICT);
    if (rateLimitResponse) return rateLimitResponse;

    const { email, code } = await request.json();

    if (!email || !code) {
      return apiError('И-мэйл болон код шаардлагатай', 400);
    }

    // Use standard client with Anon Key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get OTP from database
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return apiError('Код олдсонгүй эсвэл буруу байна', 400);
    }

    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
      return apiError('Кодны хугацаа дууссан байна', 400);
    }

    // Check code match
    if (data.code !== code) {
      return apiError('Код буруу байна', 400);
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('email', email);

    if (updateError) {
      console.error('Database update error:', updateError);
      return apiError('Баталгаажуулахад алдаа гарлаа', 500);
    }

    return NextResponse.json({ success: true, message: 'И-мэйл амжилттай баталгаажлаа' });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return apiError('Дотоод алдаа гарлаа', 500);
  }
}
