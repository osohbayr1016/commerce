// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // During build or if env vars missing, return mock client
  if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined') {
      // Server-side during build - return mock
      return createBrowserClient(
        'https://placeholder.supabase.co',
        'placeholder-key'
      );
    }
    // Client-side - this is a real error
    console.error('Missing Supabase environment variables');
    return createBrowserClient(
      'https://placeholder.supabase.co',
      'placeholder-key'
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
