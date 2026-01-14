-- ============================================
-- DEBUG LOGIN ISSUES
-- ============================================
-- Run this to see what's wrong with your login

-- Step 1: Check if profiles table has required columns
SELECT 
  'Checking profiles table structure...' as status;

SELECT 
  column_name, 
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'profiles'
  AND column_name IN ('email', 'phone_number', 'full_name', 'role')
ORDER BY column_name;

-- If you see less than 4 rows above, run FIX_AUTH.sql first!

-- Step 2: Check your registered users
SELECT 
  'Your registered users:' as status;

SELECT 
  id,
  email,
  phone,
  created_at,
  last_sign_in_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Step 3: Check profiles table data
SELECT 
  'Profile data:' as status;

SELECT 
  p.id,
  p.email,
  p.phone_number,
  p.full_name,
  p.role,
  u.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 10;

-- Step 4: Find specific user by email
-- Replace 'your@email.com' with your actual email
/*
SELECT 
  'Finding your user:' as status;

SELECT 
  p.*,
  u.email as auth_email,
  u.phone as auth_phone
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
WHERE u.email = 'your@email.com';
*/

-- Step 5: Check for NULL emails in profiles
SELECT 
  'Users with missing email in profiles:' as status;

SELECT 
  p.id,
  p.email,
  p.phone_number,
  p.full_name,
  u.email as should_be_email
FROM public.profiles p
JOIN auth.users u ON p.id = u.id
WHERE p.email IS NULL;

-- If you see users above, run the fix below:
-- UPDATE public.profiles p
-- SET email = u.email
-- FROM auth.users u
-- WHERE p.id = u.id AND p.email IS NULL;

-- ============================================
-- COMMON ISSUES & FIXES
-- ============================================

-- Issue 1: Column 'email' doesn't exist in profiles
-- Fix: Run FIX_AUTH.sql

-- Issue 2: Email is NULL in profiles
-- Fix: 
-- UPDATE public.profiles p
-- SET email = u.email
-- FROM auth.users u  
-- WHERE p.id = u.id AND p.email IS NULL;

-- Issue 3: Phone number doesn't match
-- Fix: Check what's in auth.users.phone vs profiles.phone_number
-- UPDATE public.profiles 
-- SET phone_number = '99999999'
-- WHERE email = 'your@email.com';

-- Issue 4: Wrong password
-- Fix: Reset password or create new account at /auth/signup
