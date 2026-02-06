# Production Deployment Checklist

Your application is ready for production! Here are the steps to ensure a smooth deployment.

## 1. Environment Variables

Ensure the following variables are set in your Cloudflare Pages / Vercel dashboard:

### Core

- `NEXT_PUBLIC_SITE_URL`: `https://maayaauvuu.com` (CRITICAL for SEO and Auth redirects)

### Database (Supabase)

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key

### Storage (Cloudflare R2)

- `CLOUDFLARE_ACCOUNT_ID`: Your Cloudflare Account ID
- `R2_ACCESS_KEY_ID`: Your R2 Access Key ID
- `R2_SECRET_ACCESS_KEY`: Your R2 Secret Access Key
- `R2_BUCKET_NAME`: `commerce` (or your bucket name)
- `R2_PUBLIC_URL`: (Optional) Custom domain for images e.g. `https://img.maayaauvuu.com`

## 2. Database Migrations

Make sure all migrations are applied to your production Supabase database.
You can copy the SQL from the files in `supabase/migrations/` and run them in the Supabase SQL Editor.

Key migrations to check:

- `20260202000000_hero_banners.sql` (For the new banner system)

## 3. Auth Configuration

In Supabase Dashboard -> Authentication -> URL Configuration:

- **Site URL**: `https://maayaauvuu.com`
- **Redirect URLs**: Add `https://maayaauvuu.com/auth/callback`

## 4. Admin Access

To make yourself an admin:

1. Sign up on the production site.
2. Go to Supabase Table Editor -> `profiles`.
3. Find your user and change the `role` column from `user` to `admin`.

## 5. SEO Verification

- `robots.txt` and `sitemap.xml` are automatically generated.
- Verify them at `https://maayaauvuu.com/robots.txt` and `https://maayaauvuu.com/sitemap.xml` after deployment.
