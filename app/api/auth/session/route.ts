import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { AUTH_COOKIE_NAME, decodeSession, clearSessionCookie, setSessionCookie } from '@/lib/auth-session';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const token = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${AUTH_COOKIE_NAME}=`))
    ?.slice(AUTH_COOKIE_NAME.length + 1);

  const session = decodeSession(token);
  if (!session) {
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }

  const supabase = createAdminClient();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();

  const response = NextResponse.json({
    user: session.user,
    profile: profile ?? session.profile ?? null,
  });

  if (!profile) {
    clearSessionCookie(response);
    return response;
  }

  setSessionCookie(response, {
    user: session.user,
    profile,
  });

  return response;
}
