-- ============================================
-- Make User Admin Helper Script
-- ============================================
-- Use this script to grant admin access to users

-- STEP 1: Find your user by phone or email
-- Uncomment and modify one of these queries:

-- Find by phone:
-- SELECT id, phone, email, created_at 
-- FROM auth.users 
-- WHERE phone = '+976XXXXXXXX';

-- Find by email (for Google OAuth users):
-- SELECT id, phone, email, created_at 
-- FROM auth.users 
-- WHERE email = 'youremail@gmail.com';

-- Find all users:
-- SELECT id, phone, email, created_at 
-- FROM auth.users 
-- ORDER BY created_at DESC;

-- ============================================

-- STEP 2: Update the user role to admin
-- Replace 'USER_ID_HERE' with the actual user ID from Step 1

UPDATE public.profiles 
SET role = 'admin' 
WHERE id = 'USER_ID_HERE';

-- ============================================

-- STEP 3: Verify the change
-- SELECT p.id, p.full_name, p.role, u.phone, u.email
-- FROM public.profiles p
-- JOIN auth.users u ON u.id = p.id
-- WHERE p.role = 'admin';

-- ============================================
-- QUICK COMMAND: Make first user admin
-- ============================================
-- Uncomment this if you want to make the first registered user an admin:

-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE id = (
--   SELECT id FROM auth.users 
--   ORDER BY created_at ASC 
--   LIMIT 1
-- );

-- ============================================
-- Remove admin role (demote to user)
-- ============================================
-- UPDATE public.profiles 
-- SET role = 'user' 
-- WHERE id = 'USER_ID_HERE';
