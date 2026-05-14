CREATE TABLE IF NOT EXISTS public.deal_discovery_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  source_type text NOT NULL DEFAULT 'startup_program',
  homepage_url text NOT NULL,
  crawl_url text NOT NULL,
  parser_hint text,
  active boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_discovery_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.deal_discovery_sources(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'queued',
  http_status integer,
  discovered_count integer NOT NULL DEFAULT 0,
  error_message text,
  started_at timestamptz NOT NULL DEFAULT now(),
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_discovery_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES public.deal_discovery_runs(id) ON DELETE CASCADE,
  source_id uuid NOT NULL REFERENCES public.deal_discovery_sources(id) ON DELETE CASCADE,
  url text NOT NULL,
  page_title text,
  raw_html text,
  raw_text text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.deal_discovery_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id uuid NOT NULL REFERENCES public.deal_discovery_sources(id) ON DELETE CASCADE,
  run_id uuid REFERENCES public.deal_discovery_runs(id) ON DELETE SET NULL,
  software_name text NOT NULL,
  headline text NOT NULL,
  approx_value text,
  conditions text,
  redeem_url text,
  promo_code text,
  category text,
  status text NOT NULL DEFAULT 'pending',
  confidence numeric(4,3) NOT NULL DEFAULT 0.5,
  source_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_deal_discovery_sources_active ON public.deal_discovery_sources(active);
CREATE INDEX IF NOT EXISTS idx_deal_discovery_runs_source_started ON public.deal_discovery_runs(source_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_deal_discovery_candidates_status_created ON public.deal_discovery_candidates(status, created_at DESC);

ALTER TABLE public.deal_discovery_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_discovery_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_discovery_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deal_discovery_candidates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage discovery sources" ON public.deal_discovery_sources;
CREATE POLICY "Admins can manage discovery sources"
  ON public.deal_discovery_sources FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage discovery runs" ON public.deal_discovery_runs;
CREATE POLICY "Admins can manage discovery runs"
  ON public.deal_discovery_runs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage discovery snapshots" ON public.deal_discovery_snapshots;
CREATE POLICY "Admins can manage discovery snapshots"
  ON public.deal_discovery_snapshots FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage discovery candidates" ON public.deal_discovery_candidates;
CREATE POLICY "Admins can manage discovery candidates"
  ON public.deal_discovery_candidates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

DROP TRIGGER IF EXISTS handle_deal_discovery_sources_updated_at ON public.deal_discovery_sources;
CREATE TRIGGER handle_deal_discovery_sources_updated_at
  BEFORE UPDATE ON public.deal_discovery_sources
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS handle_deal_discovery_runs_updated_at ON public.deal_discovery_runs;
CREATE TRIGGER handle_deal_discovery_runs_updated_at
  BEFORE UPDATE ON public.deal_discovery_runs
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();

DROP TRIGGER IF EXISTS handle_deal_discovery_candidates_updated_at ON public.deal_discovery_candidates;
CREATE TRIGGER handle_deal_discovery_candidates_updated_at
  BEFORE UPDATE ON public.deal_discovery_candidates
  FOR EACH ROW
  EXECUTE FUNCTION public.set_current_timestamp_updated_at();
