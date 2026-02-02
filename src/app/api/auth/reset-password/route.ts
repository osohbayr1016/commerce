import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: 'Мэдээлэл дутуу байна' }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Verify the code again and check if it was marked as verified
    const { data, error } = await supabase
      .from('verification_codes')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Баталгаажуулах код буруу эсвэл олдсонгүй' }, { status: 400 });
    }

    if (!data.verified) {
      return NextResponse.json({ error: 'И-мэйл баталгаажаагүй байна' }, { status: 400 });
    }

    if (new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Кодны хугацаа дууссан байна' }, { status: 400 });
    }

    // Get User ID by Email (Admin only)
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
    // listUsers might be slow if many users, but listUsers() is paginated.
    // Better way: use admin.updateUserById but we need ID.
    // Or just admin.updateUserAttributes?? No, that's for logged in user.
    // Admin API has updateUserById.
    
    // We can filter listUsers?
    // supabase.auth.admin.listUsers() doesn't support filtering by email in JS client easily unless we use getUserByEmail (not available in all versions) or listUsers with page perpage.
    // Actually, supabase-js admin client usually doesn't expose "getUserByEmail".
    // Wait, createClient (service role) allows: supabase.from('auth.users')... NO, can't access auth schema directly easily.
    
    // Standard way:
    // We can use supabase.auth.admin.inviteUserByEmail? No.
    // Let's try to find the user via RPC or just iterate? Iterating is bad.
    // Wait, the supabase-js library usually has `admin.getUserByEmail`? No?
    // Let's check docs or available methods.
    
    // Actually, `supabase.auth.admin.updateUserById(uid, attributes)` is the way.
    // How to get UID from Email securely?
    // We can use the Profiles table if we sync users there!
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email) // Assuming we have email in profiles (we added it recently!)
      .single();

    if (!profile) {
       // Fallback or error
       return NextResponse.json({ error: 'Хэрэглэгч олдсонгүй' }, { status: 404 });
    }

    // Update Password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      profile.id,
      { password: password }
    );

    if (updateError) {
      console.error('Password update error:', updateError);
      return NextResponse.json({ error: 'Нууц үг шинэчлэхэд алдаа гарлаа' }, { status: 500 });
    }

    // Delete the used code
    await supabase.from('verification_codes').delete().eq('email', email);

    return NextResponse.json({ success: true, message: 'Нууц үг амжилттай шинэчлэгдлээ' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Дотоод алдаа гарлаа' }, { status: 500 });
  }
}
