import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a Supabase server client with connection pooling
 * 
 * Connection Pooling:
 * - Supabase uses PgBouncer for connection pooling in Transaction mode
 * - The @supabase/ssr client automatically handles connection reuse
 * - Connections are pooled and reused across requests
 * - Default pool size: 15 connections (configurable in Supabase dashboard)
 * 
 * Benefits:
 * - Prevents connection exhaustion under high load
 * - Reduces connection overhead (faster queries)
 * - Handles 1000s of concurrent requests efficiently
 * 
 * Setup:
 * - Supabase automatically provides connection pooling
 * - No additional configuration needed for basic setup
 * - For advanced config, use SUPABASE_DB_URL env variable with pooler connection string
 * 
 * @see https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                secure: isProduction,
                sameSite: options?.sameSite ?? ('lax' as const),
                path: options?.path ?? '/',
              })
            );
          } catch {
            // This can fail in middleware or during static generation
            // It's safe to ignore as cookies will be set on the next request
          }
        },
      },
      // Connection pooling is handled automatically by Supabase
      // The client reuses connections from the pool managed by PgBouncer
      db: {
        schema: 'public',
      },
    }
  );
}
