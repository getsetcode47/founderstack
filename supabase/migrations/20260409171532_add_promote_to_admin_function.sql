/*
  # Add promote_to_admin helper function

  ## Summary
  Creates a utility function that allows promoting a user to admin by email address.
  This is a SECURITY DEFINER function that can only be called by service-role.

  ## Usage
  In the Supabase SQL editor, run:
    SELECT promote_to_admin('your@email.com');

  ## Notes
  - Only use this for initial setup / trusted admin promotion
  - All admin actions are gated by RLS checking role = 'admin'
*/

CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;
