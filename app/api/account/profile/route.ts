import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest, setSessionCookie } from '@/lib/auth-session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function PATCH(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { username } = await request.json();
    const trimmedUsername = String(username ?? '').trim();

    if (!trimmedUsername) {
      return NextResponse.json({ error: 'Display name is required.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: profile, error } = await supabase
      .from('profiles')
      .update({ username: trimmedUsername })
      .eq('id', session.user.id)
      .select('*')
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const response = NextResponse.json({ profile });
    setSessionCookie(response, {
      user: session.user,
      profile: profile ?? session.profile ?? null,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to update profile.' }, { status: 500 });
  }
}
