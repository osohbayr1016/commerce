import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'И-мэйл болон код шаардлагатай' }, { status: 400 });
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
      return NextResponse.json({ error: 'Код олдсонгүй эсвэл буруу байна' }, { status: 400 });
    }

    // Check expiration
    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Кодны хугацаа дууссан байна' }, { status: 400 });
    }

    // Check code match
    if (data.code !== code) {
      return NextResponse.json({ error: 'Код буруу байна' }, { status: 400 });
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from('verification_codes')
      .update({ verified: true })
      .eq('email', email);

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json({ error: 'Баталгаажуулахад алдаа гарлаа' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'И-мэйл амжилттай баталгаажлаа' });
  } catch (error) {
    console.error('OTP Verify Error:', error);
    return NextResponse.json({ error: 'Дотоод алдаа гарлаа' }, { status: 500 });
  }
}
