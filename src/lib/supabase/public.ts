import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Creates a public, server-side Supabase client using the anonymous key.
 * This client does NOT read cookies and does NOT depend on Next.js headers.
 * It is safe to use in Server Components during static generation (SSG)
 * and won't force the route into Dynamic Server mode.
 */
export function createPublicClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase configuration missing.');
  }

  return createSupabaseClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
}
