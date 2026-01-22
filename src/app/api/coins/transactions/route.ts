import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Нэвтэрч орно уу' },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch transactions
    const { data: transactions, error: transactionsError, count } = await supabase
      .from('coin_transactions')
      .select('*', { count: 'exact' })
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (transactionsError) {
      console.error('Error fetching transactions:', transactionsError);
      return NextResponse.json(
        { error: 'Түүх татахад алдаа гарлаа' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      transactions: transactions || [],
      total: count || 0,
      limit,
      offset,
    });

  } catch (error) {
    console.error('Error in transactions fetch:', error);
    return NextResponse.json(
      { error: 'Алдаа гарлаа. Дахин оролдоно уу.' },
      { status: 500 }
    );
  }
}
