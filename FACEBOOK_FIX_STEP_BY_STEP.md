# Facebook Login Fix - Step by Step Guide

## The Problem

Facebook is blocking your callback URL because the domain `commerce.osohoo691016.workers.dev` is not registered in your Facebook app settings.

## Solution: Follow These Steps EXACTLY

### Step 1: Open Facebook App Settings

1. Go to: **https://developers.facebook.com/apps/**
2. Find and click on your app: **App ID 1616127352734289**
3. In the left sidebar, click **Settings** → **Basic**

### Step 2: Add App Domain

1. Scroll down to find the **"App Domains"** field
2. Click in the text box
3. Type EXACTLY this (NO https://, NO trailing slash):
   ```
   commerce.osohoo691016.workers.dev
   ```
4. Press Enter or click outside the box

### Step 3: Add Valid OAuth Redirect URI

1. Scroll down to find **"Valid OAuth Redirect URIs"** section
2. Click the **"Add URI"** button (or click in the text field)
3. Type EXACTLY this (WITH https://):
   ```
   https://commerce.osohoo691016.workers.dev/auth/callback
   ```
4. Press Enter or click "Add"

### Step 4: Add Site URL (Important!)

1. Scroll up to find **"Site URL"** field
2. Click in the text box
3. Type EXACTLY this:
   ```
   https://commerce.osohoo691016.workers.dev
   ```
4. Make sure there's NO trailing slash

### Step 5: Save All Changes

1. Scroll to the bottom of the page
2. Click the blue **"Save Changes"** button
3. Wait for the confirmation message

### Step 6: Wait and Test

1. **Wait 3-5 minutes** for Facebook to update their settings
2. Clear your browser cache or use incognito mode
3. Try logging in with Facebook again

## Complete List of URLs to Add

### App Domains (add this):

```
commerce.osohoo691016.workers.dev
```

### Valid OAuth Redirect URIs (add ALL of these):

```
https://ejdwrepyuznanwujidai.supabase.co/auth/v1/callback
https://commerce.osohoo691016.workers.dev/auth/callback
http://localhost:3000/auth/callback
```

### Site URL (add this):

```
https://commerce.osohoo691016.workers.dev
```

## Common Mistakes to Avoid

❌ **DON'T** add `https://` to App Domains
✅ **DO** add `https://` to Valid OAuth Redirect URIs

❌ **DON'T** add trailing slashes (`/`)
✅ **DO** use exact URLs as shown above

❌ **DON'T** forget to click "Save Changes"
✅ **DO** wait a few minutes after saving

## Still Not Working?

If it's still not working after following all steps:

1. **Double-check** you're editing the correct app (ID: 1616127352734289)
2. **Verify** all URLs are added exactly as shown (copy-paste them)
3. **Wait longer** - sometimes Facebook takes 10-15 minutes to update
4. **Check app mode** - Make sure your app is in "Live" mode or add yourself as a test user
5. **Clear browser cache** completely or use a different browser

## Verify Your Settings

After saving, your Facebook App Settings should show:

- **App Domains**: `commerce.osohoo691016.workers.dev`
- **Site URL**: `https://commerce.osohoo691016.workers.dev`
- **Valid OAuth Redirect URIs**: Should include all 3 URLs listed above
