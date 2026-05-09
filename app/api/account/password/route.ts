import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-session';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const session = getSessionFromRequest(request);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { password } = await request.json();
    const nextPassword = String(password ?? '');

    if (nextPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(session.user.id, {
      password: nextPassword,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Unable to update password.' }, { status: 500 });
  }
}
