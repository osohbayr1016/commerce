# Enable R2 Public Access for Image Display

## Problem
Images are uploaded successfully but not displaying on the website because the R2 bucket is private.

## Solution: Enable Public Access

### Step 1: Enable Public Access in R2 Dashboard

1. Go to **Cloudflare Dashboard**: https://dash.cloudflare.com
2. Click on **R2** in the left sidebar
3. Click on your bucket: **commerce**
4. Click on the **Settings** tab
5. Scroll to **Public Access** section
6. Click **Allow Access** (or **Connect Domain**)
7. Copy the public URL that appears (it will look like: `https://pub-aabe952df5d4e4b780339bf3b4217ed7.r2.dev`)

### Step 2: Configure the Public URL

The public URL is already added to your `.env.local` file:

```env
R2_PUBLIC_URL=https://pub-aabe952df5d4e4b780339bf3b4217ed7.r2.dev/commerce
```

**Important**: Verify this URL matches what you see in the Cloudflare dashboard!

### Step 3: Set Environment Variable in Cloudflare Workers

1. Go to **Cloudflare Dashboard** → **Workers & Pages**
2. Click on your worker: **commerce**
3. Go to **Settings** → **Variables and Secrets**
4. Add a new variable:
   - **Name**: `R2_PUBLIC_URL`
   - **Value**: `https://pub-aabe952df5d4e4b780339bf3b4217ed7.r2.dev/commerce`
5. Click **Save**

### Step 4: Rebuild and Redeploy

```bash
npm run deploy
```

### Step 5: Test

1. Go to your deployed site: https://commerce.osohoo691016.workers.dev
2. Navigate to Admin → Products → New Product
3. Upload an image
4. The image should now display correctly!

## Alternative: Custom Domain (Optional)

If you want to use a custom domain for images instead of the R2.dev subdomain:

1. In R2 bucket settings, click **Custom Domains**
2. Add your custom domain (e.g., `images.yourdomain.com`)
3. Update `R2_PUBLIC_URL` to use your custom domain
4. Redeploy

## Troubleshooting

### Images still not showing?

1. **Check R2 public access is enabled**:
   - Go to R2 bucket → Settings → Public Access
   - Should show "Public access enabled"

2. **Verify the public URL**:
   - Open the URL in your browser: `https://pub-aabe952df5d4e4b780339bf3b4217ed7.r2.dev/commerce/products/test.jpg`
   - Should show 404 for non-existent files (not 403 Forbidden)
   - If you see 403, public access is not enabled

3. **Check environment variable**:
   - In Cloudflare Workers dashboard → Settings → Variables
   - Make sure `R2_PUBLIC_URL` is set

4. **Clear cache**:
   - After enabling public access, wait 30-60 seconds for changes to propagate
   - Hard refresh your browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

## Security Note

Enabling public access means anyone with the URL can view your images. This is normal for e-commerce product images. If you need private images:

1. Keep public access disabled
2. Use the proxy route `/api/images/r2/...` which requires authentication
3. Note: This only works on localhost, not on deployed Cloudflare Workers
