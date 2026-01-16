# Cloudflare Images Setup Guide

## Quick Fix for 500 Error

If you're getting a 500 error when uploading images, it's most likely because the environment variables are not set in your Cloudflare Workers deployment.

## Step 1: Set Environment Variables in Cloudflare Dashboard

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → Your Worker (`commerce`)
3. Click on **Settings** tab
4. Scroll down to **Variables and Secrets**
5. Add the following:

### Add CLOUDFLARE_ACCOUNT_ID (as Variable)
- **Variable name**: `CLOUDFLARE_ACCOUNT_ID`
- **Value**: `aabe952df5d4e4b780339bf3b4217ed7`
- **Type**: Plain text (Variable)

### Add CLOUDFLARE_IMAGES_API_TOKEN (as Encrypted Secret)
- **Variable name**: `CLOUDFLARE_IMAGES_API_TOKEN`
- **Value**: `fjTb88kb0MnohEK59yvrG_eisJ5n_joGp_HPa47u`
- **Type**: Encrypted (Secret) - Click "Encrypt" button

## Step 2: Save and Redeploy

After adding the variables:
1. Click **Save** 
2. The worker will automatically redeploy
3. Wait for deployment to complete

## Step 3: Test

Try uploading an image again. The error should be resolved.

## Alternative: Using Wrangler CLI

If you prefer using CLI:

```bash
# Set the account ID (variable)
npx wrangler secret put CLOUDFLARE_ACCOUNT_ID
# When prompted, enter: aabe952df5d4e4b780339bf3b4217ed7

# Set the API token (encrypted secret)
npx wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN
# When prompted, enter: fjTb88kb0MnohEK59yvrG_eisJ5n_joGp_HPa47u
```

## Verify Environment Variables

After setting the variables, you can verify they're working by checking the error message. If the variables are missing, you'll see a clear error message indicating which variables are missing.

## Troubleshooting

### Still getting 500 error?

1. **Check Cloudflare Dashboard**: Make sure both variables are set correctly
2. **Check Variable Names**: They must be exactly:
   - `CLOUDFLARE_ACCOUNT_ID`
   - `CLOUDFLARE_IMAGES_API_TOKEN`
3. **Check API Token Permissions**: The token must have `Account` → `Cloudflare Images` → `Edit` permission
4. **Redeploy**: After adding variables, wait for automatic redeployment or manually trigger it
5. **Check Logs**: In Cloudflare Dashboard → Workers → Your Worker → Logs, check for error messages

### Error Messages to Look For

- "Missing required environment variables" → Variables not set in dashboard
- "Cloudflare Images API error" → API token might be invalid or lack permissions
- "Failed to connect to Cloudflare Images API" → Network or API endpoint issue
