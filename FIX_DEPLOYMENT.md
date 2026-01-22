# 🚀 Quick Fix: Deployment Issues

## Problem
Your website is deployed but:
- ❌ No products showing
- ❌ Login not working (FAILED status)
- ❌ Backend not connecting

## Root Cause
**Missing Supabase environment variables in Cloudflare deployment**

## Solution: 3 Steps to Fix

### Step 1: Get Supabase Credentials

1. Go to https://app.supabase.com/
2. Select your project
3. Click **Settings** → **API** (in left sidebar)
4. Copy these 2 values:
   - **Project URL** - looks like: `https://abcdefghijk.supabase.co`
   - **anon public** key (under "Project API keys") - long string starting with `eyJ...`

### Step 2: Add to Cloudflare

1. Go to https://dash.cloudflare.com/
2. Click **Workers & Pages** (left sidebar)
3. Find and click your deployed project (probably named "commerce")
4. Click **Settings** tab
5. Click **Environment variables** (left sidebar under Settings)
6. Click **Add variables** button
7. Add these 3 variables for **Production**:

   **Variable 1:**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: Your Supabase Project URL from Step 1
   - Click **Add variable**

   **Variable 2:**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: Your Supabase anon key from Step 1
   - Type: Choose **Encrypt** (recommended)
   - Click **Add variable**

   **Variable 3:**
   - Name: `NEXT_PUBLIC_SITE_URL`
   - Value: Your deployed site URL (e.g., `https://commerce.pages.dev`)
   - Click **Add variable**

8. Click **Save** at the bottom

### Step 3: Redeploy

Option A - Deploy from terminal:
```bash
cd /Users/twissu/Desktop/Personal/e-commerce/my-ecommerce
npm run deploy
```

Option B - Trigger from Cloudflare Dashboard:
1. In Cloudflare Dashboard → Your Project → **Deployments** tab
2. Click **Create deployment**
3. Choose your production branch
4. Click **Save and Deploy**

## ✅ Verify It Works

1. Wait 2-3 minutes for deployment to complete
2. Open your deployed website
3. Check:
   - Products should load on homepage
   - Login should work
   - No console errors

## Still Having Issues?

### Check Environment Variables
In Cloudflare Dashboard → Your Project → Settings → Environment variables:
- Verify all 3 variables are listed under **Production**
- Make sure names are EXACTLY as shown (case-sensitive)
- No extra spaces in values

### Check Supabase
In Supabase Dashboard:
1. **Authentication** → **Providers** → Make sure **Email** is enabled
2. **Table Editor** → Check you have products in the database
3. **Settings** → **API** → Verify Project URL is correct

### Common Mistakes
- ❌ Added variables to "Preview" instead of "Production"
- ❌ Typo in variable names (they're case-sensitive!)
- ❌ Forgot to redeploy after adding variables
- ❌ Using old/wrong Supabase credentials

## Need More Help?

See `DEPLOYMENT.md` for detailed troubleshooting guide.
