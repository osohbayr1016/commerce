-- ============================================
-- Complete Authentication Setup
-- ============================================
-- This sets up proper user authentication storage
-- Supabase stores auth in auth.users (system table)
-- We extend it with profiles table for additional info

-- Step 1: Ensure profiles table has all necessary columns
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Step 2: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- Step 3: Update the trigger function to capture all auth data
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    full_name, 
    avatar_url, 
    phone_number, 
    email,
    created_at
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    new.email,
    new.created_at
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
    email = COALESCE(EXCLUDED.email, profiles.email),
    updated_at = NOW();
  RETURN new;
END;
$$;

-- Step 4: Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_new_user();

-- Step 5: Create a view to easily access complete user information
CREATE OR REPLACE VIEW public.user_details AS
SELECT 
  p.id,
  p.full_name,
  p.email,
  p.phone_number,
  p.avatar_url,
  p.role,
  p.xp,
  p.tier_level,
  p.created_at,
  p.updated_at,
  u.last_sign_in_at,
  u.email_confirmed_at,
  u.phone as auth_phone,
  u.confirmed_at
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id;

-- Step 6: Grant access to the view
GRANT SELECT ON public.user_details TO authenticated;
GRANT SELECT ON public.user_details TO service_role;

-- Step 7: Create function to get user by phone or email
CREATE OR REPLACE FUNCTION public.get_user_by_identifier(identifier TEXT)
RETURNS TABLE (
  id UUID,
  email TEXT,
  phone_number TEXT,
  full_name TEXT,
  role TEXT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  -- Check if identifier is email or phone
  IF identifier LIKE '%@%' THEN
    -- Email search
    RETURN QUERY
    SELECT p.id, p.email, p.phone_number, p.full_name, p.role
    FROM public.profiles p
    WHERE p.email = identifier;
  ELSE
    -- Phone search (clean the input)
    RETURN QUERY
    SELECT p.id, p.email, p.phone_number, p.full_name, p.role
    FROM public.profiles p
    WHERE p.phone_number = regexp_replace(identifier, '[^0-9]', '', 'g');
  END IF;
END;
$$;

-- Step 8: Update existing users to have email in profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- Step 9: Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_profile_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at 
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_profile_updated_at();

-- Step 10: Verify the setup
SELECT 
  'profiles columns' as check_type,
  column_name, 
  data_type 
FROM information_schema.columns 
WHERE table_schema = 'public'
  AND table_name = 'profiles' 
  AND column_name IN ('phone_number', 'email', 'full_name', 'role', 'created_at', 'updated_at')
ORDER BY column_name;

-- ============================================
-- IMPORTANT NOTES:
-- ============================================
-- 1. auth.users table: Managed by Supabase (contains password hashes, auth tokens)
-- 2. public.profiles table: Your custom user data (extends auth.users)
-- 3. Password is NEVER stored in plain text (only hashed in auth.users by Supabase)
-- 4. Email is stored in both: auth.users (for auth) and profiles (for queries)
-- 5. Phone is stored in profiles (for login lookup)
-- ============================================
