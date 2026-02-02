# Complete Facebook App Setup - Make It Ready to Work

## Current Status: ❌ NOT READY

Your app shows "Currently Ineligible for Submission" because 2 fields are missing:

1. App icon (1024 x 1024)
2. User data deletion

## Step-by-Step Fix

### Step 1: Add App Icon

1. On the Facebook App Settings page, find the **"App icon"** section
2. Click the placeholder box (shows "1024 x 1024")
3. Upload a square image that is exactly **1024 x 1024 pixels**
4. You can use your logo or any square image
5. **Save Changes**

**Quick Tip:** If you don't have a 1024x1024 image:

- Use an online tool to resize your logo
- Or create a simple square image with your brand colors

### Step 2: Add User Data Deletion Instructions

1. Scroll down to the **"User data deletion"** section
2. You have two options:

#### Option A: Add a URL (Recommended)

1. In the **"Data deletion instructions URL"** dropdown, select **"URL"**
2. In the text field below, add:
   ```
   https://commerce.osohoo691016.workers.dev/privacy
   ```
   (Or create a page explaining how users can delete their data)

#### Option B: Add Instructions Directly

1. In the **"Data deletion instructions URL"** dropdown, select **"Instructions"**
2. Add text like:

   ```
   Users can request data deletion by contacting us at osohbayaroyunburen@gmail.com or by logging into their account and using the account deletion feature.
   ```

3. **Save Changes**

### Step 3: Verify All Required Fields

Make sure these are filled:

- ✅ **App ID**: `1616127352734289` (already set)
- ✅ **App Domains**: `commerce.osohoo691016.workers.dev` (already set)
- ✅ **Contact Email**: `osohbayaroyunburen@gmail.com` (already set)
- ✅ **Privacy Policy URL**: `http://commerce.osohoo691016.workers.dev/` (already set)
- ✅ **Terms of Service URL**: `http://commerce.osohoo691016.workers.dev/` (already set)
- ⚠️ **App Icon**: NEEDS TO BE ADDED
- ⚠️ **User Data Deletion**: NEEDS TO BE ADDED

### Step 4: Check Valid OAuth Redirect URIs

Make sure these are added in **"Valid OAuth Redirect URIs"**:

```
https://ejdwrepyuznanwujidai.supabase.co/auth/v1/callback
https://commerce.osohoo691016.workers.dev/auth/callback
http://localhost:3000/auth/callback
```

### Step 5: App Mode

For OAuth login to work, your app needs to be in one of these modes:

#### Option A: Development Mode (Easier for Testing)

1. In the left sidebar, click **"App Review"** → **"Permissions and Features"**
2. Your app should be in **"Development"** mode
3. Add yourself and test users:
   - Go to **"Roles"** → **"Test Users"**
   - Add test users or add yourself as a developer/admin
4. In Development mode, only added test users can log in

#### Option B: Live Mode (For Production)

1. Complete all required fields (icon, data deletion)
2. The app will automatically become eligible
3. You may need to submit for review depending on permissions requested

### Step 6: Save and Wait

1. After adding the icon and data deletion info, click **"Save Changes"**
2. Wait 2-3 minutes for Facebook to process
3. The red warning should disappear
4. Try Facebook login again

## Quick Checklist

Before testing Facebook login, verify:

- [ ] App icon (1024x1024) uploaded
- [ ] User data deletion instructions added
- [ ] App Domains: `commerce.osohoo691016.workers.dev`
- [ ] Valid OAuth Redirect URIs: All 3 URLs added
- [ ] Site URL: `https://commerce.osohoo691016.workers.dev`
- [ ] App is in Development mode OR Live mode
- [ ] If Development mode: Test users are added
- [ ] All changes saved
- [ ] Waited 3-5 minutes after saving

## After Completing These Steps

Once you've added the icon and data deletion info:

1. The red warning should disappear
2. Your app will be eligible
3. Facebook login should work (if in Development mode with test users, or Live mode)

## Still Having Issues?

If login still doesn't work after completing all steps:

1. Make sure you're testing with a user that has access (test user in Dev mode, or any user in Live mode)
2. Clear browser cache completely
3. Wait 10-15 minutes for all Facebook changes to propagate
4. Check browser console for any error messages
