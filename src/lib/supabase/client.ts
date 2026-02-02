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
    console.error(
      '❌ Supabase configuration missing!\n\n' +
      'NEXT_PUBLIC_SUPABASE_URL is not set.\n\n' +
      'To fix this:\n' +
      '1. Go to Cloudflare Dashboard → Workers & Pages → Your Project\n' +
      '2. Settings → Environment variables\n' +
      '3. Add NEXT_PUBLIC_SUPABASE_URL with your Supabase project URL\n\n' +
      'See DEPLOYMENT.md for detailed instructions.'
    );
    return false;
  }
  
  if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('placeholder') || SUPABASE_ANON_KEY.includes('MISSING')) {
    console.error(
      '❌ Supabase configuration missing!\n\n' +
      'NEXT_PUBLIC_SUPABASE_ANON_KEY is not set.\n\n' +
      'To fix this:\n' +
      '1. Go to Cloudflare Dashboard → Workers & Pages → Your Project\n' +
      '2. Settings → Environment variables\n' +
      '3. Add NEXT_PUBLIC_SUPABASE_ANON_KEY with your Supabase anon key\n\n' +
      'See DEPLOYMENT.md for detailed instructions.'
    );
    return false;
  }
  return true;
}

/**
 * Singleton pattern for browser client to avoid creating multiple instances
 * This helps reduce unnecessary client instantiations
 */
export function createClient() {
  // Validate environment variables in browser
  const isValid = typeof window === 'undefined' || validateEnvVars();
  
  // Use placeholder values if env vars are missing to prevent crashes
  const url = SUPABASE_URL && !SUPABASE_URL.includes('placeholder') && !SUPABASE_URL.includes('MISSING')
    ? SUPABASE_URL
    : 'https://placeholder.supabase.co';
  
  const key = SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes('placeholder') && !SUPABASE_ANON_KEY.includes('MISSING')
    ? SUPABASE_ANON_KEY
    : 'placeholder-key';
  
  if (typeof window === 'undefined') {
    // Server-side: always create new client
    return createBrowserClient(url, key);
  }

  // Browser-side: reuse existing client instance
  if (!browserClient) {
    browserClient = createBrowserClient(url, key);
  }

  return browserClient;
}
