import { createAdminClient } from '@/lib/supabase/admin';

function isMissingAppErrorEventsTable(error: { message?: string; code?: string } | null) {
  return !!error && (
    error.code === 'PGRST205' ||
    error.message?.includes("Could not find the table 'public.app_error_events'")
  );
}

export async function logAppError(input: {
  source: string;
  route?: string | null;
  message: string;
  digest?: string | null;
  metadata?: Record<string, unknown>;
}) {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from('app_error_events').insert({
      source: input.source,
      route: input.route ?? null,
      message: input.message,
      digest: input.digest ?? null,
      metadata: input.metadata ?? {},
    });

    if (error && !isMissingAppErrorEventsTable(error)) {
      console.error('Failed to log app error', error);
    }
  } catch (error) {
    console.error('Failed to log app error', error);
  }
}
