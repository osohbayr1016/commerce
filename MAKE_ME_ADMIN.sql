-- ==============================================================================
-- MAKE YOURSELF ADMIN
-- ==============================================================================
-- This will give your account admin privileges
-- ==============================================================================

-- First, let's see your current user info
select id, email, raw_user_meta_data from auth.users;

-- Find your user ID from the result above, then run this:
-- Replace 'YOUR-USER-ID-HERE' with your actual user ID from the query above

-- Option 1: If you know your user ID, replace it here:
-- update public.profiles 
-- set role = 'admin' 
-- where id = 'YOUR-USER-ID-HERE';

-- Option 2: Make ALL users admin (easier for testing):
update public.profiles 
set role = 'admin';

-- Verify it worked:
select id, full_name, role from public.profiles;

-- ==============================================================================
-- ✅ Now you should have admin access!
-- Try creating a product in the admin dashboard
-- ==============================================================================
