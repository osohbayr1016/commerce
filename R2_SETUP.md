# Cloudflare R2 Image Upload Setup

## Overview

Image uploads now use Cloudflare R2 (object storage) instead of Cloudflare Images API. This avoids authentication issues and provides more control.

## Required Environment Variables

Add these to your `.env.local` for local development and Cloudflare Workers dashboard for production:

### Required Variables

1. **CLOUDFLARE_ACCOUNT_ID**
   - Your Cloudflare Account ID
   - Found in Cloudflare Dashboard → Right sidebar

2. **R2_ACCESS_KEY_ID**
   - R2 API Token Access Key ID
   - Create at: Cloudflare Dashboard → R2 → Manage R2 API Tokens

3. **R2_SECRET_ACCESS_KEY**
   - R2 API Token Secret Access Key
   - Create at: Cloudflare Dashboard → R2 → Manage R2 API Tokens

### Optional Variables

4. **R2_BUCKET_NAME** (default: `product-images`)
   - Name of your R2 bucket
   - Create bucket at: Cloudflare Dashboard → R2 → Create bucket

5. **R2_PUBLIC_URL** (optional, recommended)
   - Custom domain URL for public access
   - Example: `https://images.yourdomain.com`
   - Configure in: R2 → Your Bucket → Settings → Custom Domain

## Setup Steps

### 1. Create R2 Bucket

1. Go to Cloudflare Dashboard → R2
2. Click "Create bucket"
3. Name it (e.g., `product-images`)
4. Click "Create bucket"

### 2. Create R2 API Token

1. Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens
2. Click "Create API token"
3. Set permissions:
   - **Object Read & Write** (or at minimum: Object Write)
   - Select your bucket or "All buckets"
4. Click "Create API Token"
5. Copy both:
   - **Access Key ID**
   - **Secret Access Key** (only shown once!)

### 3. Configure Bucket for Public Access

1. Go to your R2 bucket → Settings
2. Enable "Public Access" if you want direct public URLs
3. OR configure a Custom Domain (recommended for production)

### 4. Set Environment Variables

#### Local Development (.env.local)

```env
CLOUDFLARE_ACCOUNT_ID=aabe952df5d4e4b780339bf3b4217ed7
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=product-images
R2_PUBLIC_URL=https://images.yourdomain.com  # Optional: if using custom domain
```

#### Cloudflare Workers (Dashboard)

1. Go to Workers & Pages → Your Worker → Settings → Variables and Secrets
2. Add as **Variables**:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `R2_BUCKET_NAME` (if different from default)
   - `R2_PUBLIC_URL` (if using custom domain)
3. Add as **Encrypted Secrets**:
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`

## How It Works

1. Images are uploaded to R2 bucket in `products/` folder
2. Each file gets a unique name: `products/timestamp-randomstring.ext`
3. Public URLs are generated based on your configuration:
   - Custom domain: `https://images.yourdomain.com/products/...`
   - Or R2 public endpoint: `https://pub-<account-id>.r2.dev/<bucket>/products/...`

## Benefits of R2

- No API token permission issues
- More control over storage
- Cost-effective
- S3-compatible API
- Direct file access
- Can use custom domains

## Troubleshooting

### "Missing R2 environment variables"
- Check all required variables are set
- Verify variable names are correct (case-sensitive)

### "Failed to upload to R2"
- Verify R2 API token has correct permissions
- Check bucket name is correct
- Ensure bucket exists

### Images not displaying
- Check if bucket has public access enabled
- Verify R2_PUBLIC_URL is correct (if using custom domain)
- Check CORS settings if accessing from browser
