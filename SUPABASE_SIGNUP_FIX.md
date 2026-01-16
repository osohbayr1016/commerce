# Fix: Enable Signups in Supabase

## Problem
Error: "Signups not allowed for this instance"

This means public email signups are disabled in your Supabase project.

## Solution: Enable Email Signups

### Step 1: Go to Supabase Dashboard
1. Open https://supabase.com/dashboard
2. Login to your account
3. Select your project: **ejdwrepyuznanwujidai**

### Step 2: Enable Email Provider
1. Click on **Authentication** in the left sidebar
2. Click on **Providers**
3. Find **Email** in the list
4. Click on **Email** to expand settings
5. Make sure these are checked:
   - ✅ **Enable Email provider**
   - ✅ **Enable Email Signup** (or uncheck "Disable Email Signup")
   - Set **Confirm email** to "disabled" for testing (you can enable later)
6. Click **Save**

### Step 3: Check Auth Settings
1. Still in **Authentication**, click on **Settings** (or **URL Configuration**)
2. Make sure:
   - **Site URL**: `http://localhost:3000` (for local development)
   - **Redirect URLs**: Add `http://localhost:3000/**` 

### Step 4: Test Signup
1. Go to http://localhost:3000/auth/signup
2. Fill in the form with:
   - Name: Test User
   - Email: test@example.com
   - Phone: 99999999
   - Password: test123456
3. Click "Бүртгүүлэх"
4. Check browser console for logs

### Step 5: Verify User Created
1. Go back to Supabase Dashboard
2. Click **Authentication** → **Users**
3. You should see your new user in the list

## Troubleshooting

### If you still get "Signups not allowed":
- Clear browser cache (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Wait 30 seconds for Supabase settings to propagate
- Try signing up with a different email

### If you get "Email already registered":
- Good! This means signups are working
- Use the login page instead
- Or try a different email

### Check Browser Console
Open browser DevTools (F12) and check Console tab for:
```
Attempting signup with: { email: '...', phone: '...' }
```

If you see errors, they will show detailed information.

## Alternative: Create Admin User Manually

If you want to keep public signups disabled:

1. Go to Supabase Dashboard → **Authentication** → **Users**
2. Click **Add User** or **Invite User**
3. Enter your email and password
4. After user is created, go to **SQL Editor**
5. Run this query to make the user an admin:

```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Important Notes

- For production deployment, you should:
  1. Enable **Confirm Email** in Email provider settings
  2. Configure **SMTP settings** for email delivery
  3. Set proper **Site URL** and **Redirect URLs** to your production domain
  4. Consider enabling **reCAPTCHA** to prevent spam signups

- The current setup is for **development only**
