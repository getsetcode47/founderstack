/*
  # Fix mutable search_path on security definer functions

  ## Summary
  Functions with SECURITY DEFINER and a mutable search_path can be exploited by
  attackers who create objects in schemas that appear earlier in the search path.
  Setting `search_path = ''` and using fully-qualified names eliminates this risk.

  ## Functions fixed
  - `public.handle_new_user` - trigger function that creates a profile on user signup
  - `public.promote_to_admin` - function that grants admin role to a user by email
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
  RETURNS trigger
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, username, referral_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    upper(substring(md5(random()::text), 1, 8))
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.promote_to_admin(user_email text)
  RETURNS void
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = ''
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found with email: %', user_email;
  END IF;

  UPDATE public.profiles
  SET role = 'admin'
  WHERE id = target_user_id;
END;
$$;
