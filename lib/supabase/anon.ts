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

function getAnonKey() {
  if (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'placeholder-anon-key';
  }

  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY must be configured.');
}

export function createAnonClient() {
  return createClient(getSupabaseUrl(), getAnonKey());
}
