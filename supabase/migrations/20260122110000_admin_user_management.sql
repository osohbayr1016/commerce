-- Allow admins to list all profiles and update roles for User Management
CREATE POLICY "Profiles: admin select all"
  ON public.profiles FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE POLICY "Profiles: admin update"
  ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
