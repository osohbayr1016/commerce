-- ============================================
-- QUICK FIX FOR LOGIN ISSUES
-- ============================================
-- Run ALL of these queries in order

-- 1. Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'email'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN email TEXT;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'phone_number'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN phone_number TEXT;
    END IF;
END $$;

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_phone ON public.profiles(phone_number);

-- 3. Sync email from auth.users to profiles
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 4. Sync phone from auth metadata to profiles
UPDATE public.profiles p
SET phone_number = u.raw_user_meta_data->>'phone_number'
FROM auth.users u
WHERE p.id = u.id 
  AND p.phone_number IS NULL 
  AND u.raw_user_meta_data->>'phone_number' IS NOT NULL;

-- 5. Update the trigger
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
    email
  )
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', ''), 
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'phone_number', ''),
    new.email
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
    phone_number = COALESCE(EXCLUDED.phone_number, profiles.phone_number),
    email = COALESCE(EXCLUDED.email, profiles.email);
  RETURN new;
END;
$$;

-- 6. Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created 
  AFTER INSERT ON auth.users 
  FOR EACH ROW 
  EXECUTE PROCEDURE public.handle_new_user();

-- 7. Verify everything is correct
SELECT 
  p.id,
  p.email as profile_email,
  p.phone_number,
  p.full_name,
  p.role,
  u.email as auth_email
FROM public.profiles p
LEFT JOIN auth.users u ON p.id = u.id
ORDER BY p.created_at DESC
LIMIT 5;

-- ============================================
-- If you STILL can't login after this:
-- ============================================
-- Option 1: Login with EMAIL only (not phone)
--   - Use your actual email address
--   - Don't use phone number

-- Option 2: Create a NEW account
--   - Go to /auth/signup
--   - Fill in all fields (name, email, phone, password)
--   - It will auto-login you

-- Option 3: Check browser console
--   - Press F12
--   - Go to Console tab
--   - Try logging in
--   - Share the error messages you see
