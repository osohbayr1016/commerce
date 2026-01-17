import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase browser client
 * 
 * Note: Connection pooling is handled by Supabase's backend
 * Browser clients connect through Supabase's REST API and Realtime,
 * which use connection pooling on the server side automatically.
 * 
 * @see https://supabase.com/docs/reference/javascript/initializing
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Singleton pattern for browser client to avoid creating multiple instances
 * This helps reduce unnecessary client instantiations
 */
export function createClient() {
  if (typeof window === 'undefined') {
    // Server-side: always create new client
    return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  // Browser-side: reuse existing client instance
  if (!browserClient) {
    browserClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  return browserClient;
}
