CREATE TABLE IF NOT EXISTS public.founder_onboarding_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  startup_name text,
  startup_idea text NOT NULL,
  startup_stage text NOT NULL,
  team_size text NOT NULL,
  customer_type text NOT NULL,
  business_model text NOT NULL,
  primary_goal text NOT NULL,
  priority_categories text[] NOT NULL DEFAULT '{}',
  go_to_market_channels text[] NOT NULL DEFAULT '{}',
  recommended_slugs text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_founder_onboarding_stage ON public.founder_onboarding_profiles(startup_stage);
CREATE INDEX IF NOT EXISTS idx_founder_onboarding_customer_type ON public.founder_onboarding_profiles(customer_type);

ALTER TABLE public.founder_onboarding_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own onboarding profile" ON public.founder_onboarding_profiles;
CREATE POLICY "Users can read own onboarding profile"
  ON public.founder_onboarding_profiles FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own onboarding profile" ON public.founder_onboarding_profiles;
CREATE POLICY "Users can manage own onboarding profile"
  ON public.founder_onboarding_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read onboarding profiles" ON public.founder_onboarding_profiles;
CREATE POLICY "Admins can read onboarding profiles"
  ON public.founder_onboarding_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

DROP TRIGGER IF EXISTS handle_founder_onboarding_profiles_updated_at ON public.founder_onboarding_profiles;
CREATE TRIGGER handle_founder_onboarding_profiles_updated_at
  BEFORE UPDATE ON public.founder_onboarding_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
