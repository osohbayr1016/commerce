# Facebook Authentication Setup Guide

## Step 1: Enable Facebook in Supabase Dashboard

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ejdwrepyuznanwujidai`
3. Navigate to: **Authentication** → **Providers**
4. Find **Facebook** in the list and click on it
5. **Enable** the Facebook provider
6. Enter your credentials:
   - **App ID**: `1616127352734289`
   - **App Secret**: `8003a1b6e1dd211ddd766e1b9d367fd1`
7. **Save** the configuration

## Step 2: Configure Facebook App Settings

### A. Add App Domain

1. Go to Facebook Developers: https://developers.facebook.com/apps/1616127352734289/
2. Go to **Settings** → **Basic**
3. Scroll down to **App Domains** section
4. Add your production domain (without https://):
   ```
   commerce.osohoo691016.workers.dev
   ```
5. **Save Changes**

### B. Add Valid OAuth Redirect URIs

1. Still in **Settings** → **Basic**
2. Scroll to **Valid OAuth Redirect URIs** section
3. Click **Add URI**
4. Add these URLs (one at a time):
   ```
   https://ejdwrepyuznanwujidai.supabase.co/auth/v1/callback
   ```
   ```
   https://commerce.osohoo691016.workers.dev/auth/callback
   ```
5. For local development, also add:
   ```
   http://localhost:3000/auth/callback
   ```
6. **Save Changes**

### C. Verify Site URL

1. In the same **Settings** → **Basic** page
2. Find **Site URL** field
3. Add your production URL:
   ```
   https://commerce.osohoo691016.workers.dev
   ```
4. **Save Changes**

## Step 3: Verify Configuration

The callback URL in your code is: `${window.location.origin}/auth/callback`

This will resolve to:

- **Development**: `http://localhost:3000/auth/callback`
- **Production**: `https://your-domain.com/auth/callback`

Supabase will handle the OAuth flow and redirect to your callback URL after authentication.

## Troubleshooting

### Error: "Can't load URL - The domain of this URL isn't included in the app's domains"

**This is the error you're currently seeing!**

- **Solution**:
  1. Go to Facebook App Settings: https://developers.facebook.com/apps/1616127352734289/settings/basic/
  2. Scroll to **App Domains** section
  3. Add: `commerce.osohoo691016.workers.dev` (without https://)
  4. Scroll to **Valid OAuth Redirect URIs** section
  5. Add: `https://commerce.osohoo691016.workers.dev/auth/callback`
  6. **Save Changes**
  7. Wait 2-3 minutes for Facebook to update the settings
  8. Try logging in again

### Error: "Unsupported provider: provider is not enabled"

- **Solution**: Make sure Facebook is enabled in Supabase Dashboard → Authentication → Providers → Facebook

### Error: "Invalid OAuth redirect URI"

- **Solution**: Add all callback URLs to Facebook App Settings → Valid OAuth Redirect URIs:
  - `https://ejdwrepyuznanwujidai.supabase.co/auth/v1/callback`
  - `https://commerce.osohoo691016.workers.dev/auth/callback`
  - `http://localhost:3000/auth/callback` (for development)

### Error: "App Not Setup"

- **Solution**: Make sure your Facebook App is in "Live" mode or add test users in Facebook App Dashboard

## Testing

1. After configuration, try clicking the "Facebook-ээр нэвтрэх" button
2. You should be redirected to Facebook login
3. After login, you'll be redirected back to your app
4. The user should be automatically logged in
