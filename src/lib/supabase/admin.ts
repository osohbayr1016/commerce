import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase admin client (service role).
 * Use ONLY in API routes. Never expose to client.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) throw new Error('Supabase admin config missing');
  return createClient(url, key, { auth: { persistSession: false } });
}
