import { createClient } from '@supabase/supabase-js';

function getSupabaseUrl() {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'https://placeholder.supabase.co';
  }

  throw new Error('NEXT_PUBLIC_SUPABASE_URL must be configured.');
}

function getServiceRoleKey() {
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return process.env.SUPABASE_SERVICE_ROLE_KEY;
  }

  if (process.env.NODE_ENV !== 'production' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  throw new Error('SUPABASE_SERVICE_ROLE_KEY must be configured.');
}

export function createAdminClient() {
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
