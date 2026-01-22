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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let browserClient: ReturnType<typeof createBrowserClient> | null = null;

/**
 * Validates environment variables and provides helpful error messages
 */
function validateEnvVars() {
  if (!SUPABASE_URL || SUPABASE_URL.includes('placeholder') || SUPABASE_URL.includes('MISSING')) {
    throw new Error(
      '❌ Supabase configuration missing!\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL is not set.\n\n' +
      'To fix this:\n' +
      '1. Go to Cloudflare Dashboard → Workers & Pages → Your Project\n' +
      '2. Settings → Environment variables\n' +
      '3. Add NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL\n\n' +
      'See DEPLOYMENT.md for detailed instructions.'
    );
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('placeholder') || SUPABASE_ANON_KEY.includes('MISSING')) {
    throw new Error(
      '❌ Supabase configuration missing!\n\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.\n\n' +
      'To fix this:\n' +
      '1. Go to Cloudflare Dashboard → Workers & Pages → Your Project\n' +
      '2. Settings → Environment variables\n' +
      '3. Add NEXT_PUBLIC_SUPABASE_ANON_KEY with your Supabase anon key\n\n' +
      'See DEPLOYMENT.md for detailed instructions.'
    );
  }
}

/**
 * Singleton pattern for browser client to avoid creating multiple instances
 * This helps reduce unnecessary client instantiations
 */
export function createClient() {
  // Validate environment variables in browser
  if (typeof window !== 'undefined') {
    validateEnvVars();
  }
  
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
