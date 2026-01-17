/**
 * Rate Limiter for API endpoints
 * 
 * Prevents DDoS attacks, API abuse, brute force, and scraping
 * 
 * Features:
 * - In-memory storage (for development/small scale)
 * - IP-based limiting
 * - Configurable limits per endpoint
 * - Sliding window algorithm
 * - Automatic cleanup of old entries
 * 
 * For production at scale, consider using Redis:
 * - Upstash Redis (serverless-friendly)
 * - Vercel KV
 * - Redis Cloud
 */

interface RateLimitConfig {
  /**
   * Maximum number of requests allowed within the window
   */
  maxRequests: number;
  
  /**
   * Time window in seconds
   */
  windowSeconds: number;
  
  /**
   * Custom message when rate limit is exceeded
   */
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store for rate limiting
// Note: This resets on server restart and doesn't work across multiple instances
// For production, use Redis or similar distributed cache
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Get client IP address from request
 */
function getClientIp(request: Request): string {
  // Check various headers that might contain the IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  // Fallback to a default value
  return 'unknown';
}

/**
 * Create a unique key for rate limiting
 */
function getRateLimitKey(identifier: string, endpoint: string): string {
  return `ratelimit:${endpoint}:${identifier}`;
}

/**
 * Check if request exceeds rate limit
 * 
 * @param request - Next.js Request object
 * @param config - Rate limit configuration
 * @param identifier - Optional custom identifier (defaults to IP address)
 * @returns Object with { limited: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): {
  limited: boolean;
  remaining: number;
  resetAt: number;
  retryAfter: number;
} {
  const ip = identifier || getClientIp(request);
  const endpoint = new URL(request.url).pathname;
  const key = getRateLimitKey(ip, endpoint);
  
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  
  const entry = rateLimitStore.get(key);
  
  // No entry exists, create new one
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    
    return {
      limited: false,
      remaining: config.maxRequests - 1,
      resetAt: now + windowMs,
      retryAfter: 0,
    };
  }
  
  // Entry exists and window hasn't expired
  if (entry.count >= config.maxRequests) {
    return {
      limited: true,
      remaining: 0,
      resetAt: entry.resetAt,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  
  // Increment counter
  entry.count++;
  
  return {
    limited: false,
    remaining: config.maxRequests - entry.count,
    resetAt: entry.resetAt,
    retryAfter: 0,
  };
}

/**
 * Rate limit presets for common use cases
 */
export const RateLimitPresets = {
  /**
   * Strict - For sensitive endpoints (auth, payment)
   * 5 requests per minute
   */
  STRICT: {
    maxRequests: 5,
    windowSeconds: 60,
  },
  
  /**
   * Standard - For normal API endpoints
   * 30 requests per minute
   */
  STANDARD: {
    maxRequests: 30,
    windowSeconds: 60,
  },
  
  /**
   * Generous - For read-heavy endpoints
   * 100 requests per minute
   */
  GENEROUS: {
    maxRequests: 100,
    windowSeconds: 60,
  },
  
  /**
   * Search - For search/autocomplete
   * 60 requests per minute (1 per second)
   */
  SEARCH: {
    maxRequests: 60,
    windowSeconds: 60,
  },
} as const;

/**
 * Middleware helper to apply rate limiting to API routes
 * 
 * @example
 * ```typescript
 * import { rateLimit, RateLimitPresets } from '@/lib/rate-limit';
 * 
 * export async function GET(request: Request) {
 *   const rateLimitResult = rateLimit(request, RateLimitPresets.STANDARD);
 *   if (rateLimitResult) return rateLimitResult;
 *   
 *   // Your endpoint logic here
 * }
 * ```
 */
export function rateLimit(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): Response | null {
  const result = checkRateLimit(request, config, identifier);
  
  if (result.limited) {
    const message = config.message || 'Too many requests. Please try again later.';
    
    return new Response(
      JSON.stringify({
        error: message,
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': config.maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
          'Retry-After': result.retryAfter.toString(),
        },
      }
    );
  }
  
  // Not rate limited, return null
  return null;
}

/**
 * Get rate limit headers to add to successful responses
 */
export function getRateLimitHeaders(
  request: Request,
  config: RateLimitConfig,
  identifier?: string
): Record<string, string> {
  const result = checkRateLimit(request, config, identifier);
  
  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetAt).toISOString(),
  };
}
