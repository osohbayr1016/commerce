# Deployment Guide

## Environment Variables Setup

Your backend connection issues are caused by missing environment variables in Cloudflare. Follow these steps to fix:

### 1. Get Your Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to: **Settings** → **API**
4. Copy these two values:
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
   - **anon public key** (under "Project API keys")

### 2. Add Environment Variables to Cloudflare

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to: **Workers & Pages** → Select your deployed project
3. Click on **Settings** tab → **Environment variables**
4. Add these REQUIRED variables for **Production**:

   | Variable Name | Value | Example |
   |--------------|-------|---------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://xxxxx.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key | `eyJhbGciOiJIUzI1...` |
   | `NEXT_PUBLIC_SITE_URL` | Your deployed site URL | `https://your-site.pages.dev` |

5. Click **Save** after adding each variable

### 3. Redeploy Your Application

After adding the environment variables, trigger a new deployment:

```bash
npm run deploy
```

Or push a commit to trigger automatic deployment if you have CI/CD set up.

### 4. Verify the Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Visit your deployed site
3. Try logging in - it should work now
4. Check if products are loading

## Local Development Setup

For local development, create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Troubleshooting

### Products Not Showing
- Verify Supabase credentials are correct
- Check Supabase database has products data
- Check browser console for API errors

### Login Not Working
- Ensure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set correctly
- Verify Supabase Authentication is enabled in Supabase Dashboard
- Check that email provider is enabled in Supabase: **Authentication** → **Providers** → **Email**

### Images Not Loading
- If using Cloudflare Images, add optional variables:
  - `CLOUDFLARE_ACCOUNT_ID`
  - `CLOUDFLARE_IMAGES_API_TOKEN`
- Check `R2_PUBLIC_URL` in `wrangler.toml` is correct

## Important Notes

- Never commit `.env.local` to git
- Environment variables in Cloudflare are case-sensitive
- After changing environment variables, always redeploy
- Use "Encrypted" option for sensitive values in Cloudflare Dashboard
