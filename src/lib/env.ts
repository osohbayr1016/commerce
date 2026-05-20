function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];

  // Allow build to proceed with placeholder values
  if (!value) {
    if (fallback) {
      console.warn(
        `⚠️  Environment variable ${key} is not set. Using fallback value.`
      );
      return fallback;
    }

    // Only throw in browser runtime, not during build
    if (typeof window !== "undefined") {
      throw new Error(
        `Missing environment variable: ${key}\n\n` +
          `Please set this in your Cloudflare Dashboard:\n` +
          `Workers & Pages → Your Project → Settings → Environment variables`
      );
    }

    // Return placeholder for build time
    console.warn(
      `⚠️  Environment variable ${key} is not set. Build will continue but runtime will fail.`
    );
    return `MISSING_${key}`;
  }

  return value;
}

export const env = {
  get supabase() {
    return {
      get url() {
        return getEnvVar(
          "NEXT_PUBLIC_SUPABASE_URL",
          "https://placeholder.supabase.co"
        );
      },
      get anonKey() {
        return getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY", "placeholder-key");
      },
    };
  },
  get site() {
    return {
      get url() {
        return process.env.NEXT_PUBLIC_SITE_URL || "https://maayaauvuu.com";
      },
    };
  },
  get qpay() {
    return {
      get baseUrl() {
        return (
          process.env.QPAY_BASE_URL ||
          "https://merchant-sandbox.qpay.mn/v2"
        );
      },
      get clientId() {
        return getEnvVar("QPAY_CLIENT_ID");
      },
      get clientSecret() {
        return getEnvVar("QPAY_CLIENT_SECRET");
      },
      get invoiceCode() {
        return getEnvVar("QPAY_INVOICE_CODE");
      },
    };
  },
} as const;
