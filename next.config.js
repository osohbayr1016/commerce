/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      {
        protocol: "https",
        hostname: "maayaauvuu.com",
      },
    ],
  },

  // Production optimizations
  poweredByHeader: false,
  reactStrictMode: true,

  // Cloudflare Pages compatibility
  trailingSlash: false,

  // Next.js 16: declare turbopack so build does not error when webpack is also set
  turbopack: {},

  // Fix webpack chunk issues with OpenNext (used when building with webpack)
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder",
  },

  // Fix workspace root warning
  outputFileTracingRoot: require("path").join(__dirname),
};

module.exports = nextConfig;
