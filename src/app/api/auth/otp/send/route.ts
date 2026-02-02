import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendOTP } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'И-мэйл хаяг шаардлагатай' }, { status: 400 });
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
      return NextResponse.json({ 
        error: 'Өгөгдлийн сантай холбогдоход алдаа гарлаа. Та дахин оролдоно уу.',
        details: dbError.message 
      }, { status: 500 });
    }

    // Send email
    const emailSent = await sendOTP(email, otp);

    if (!emailSent) {
      return NextResponse.json({ error: 'И-мэйл илгээхэд алдаа гарлаа' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Баталгаажуулах код илгээгдлээ' });
  } catch (error: any) {
    console.error('OTP Send Critical Error:', error);
    return NextResponse.json({ 
      error: 'Дотоод алдаа гарлаа', 
      details: error.message 
    }, { status: 500 });
  }
}
