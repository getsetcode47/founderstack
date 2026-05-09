import { NextResponse, type NextRequest } from 'next/server';
import { getSessionFromEdgeRequest } from '@/lib/auth-session-edge';
import { hasPaidAccess, isAdminRole } from '@/lib/founderstack';
import { applySecurityHeaders } from '@/lib/security/headers';

function secure(response: NextResponse) {
  return applySecurityHeaders(response);
}

export async function middleware(request: NextRequest) {
  const session = await getSessionFromEdgeRequest(request);
  const pathname = request.nextUrl.pathname;

  if (!session && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin'))) {
    const url = request.nextUrl.clone();
    url.pathname = '/sign-in';
    url.searchParams.set('redirectTo', pathname);
    return secure(NextResponse.redirect(url));
  }

  if (pathname.startsWith('/deal/')) {
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      url.searchParams.set('mode', 'signup');
      url.searchParams.set('redirectTo', pathname);
      return secure(NextResponse.redirect(url));
    }

    if (!hasPaidAccess(session.profile)) {
      return secure(NextResponse.redirect(new URL('/dashboard/billing', request.url)));
    }
  }

  if (session && (pathname === '/sign-in' || pathname === '/login' || pathname === '/register')) {
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return secure(NextResponse.redirect(url));
  }

  if (session && pathname.startsWith('/admin') && !isAdminRole(session.profile?.role)) {
    return secure(NextResponse.redirect(new URL('/deals', request.url)));
  }

  return secure(NextResponse.next({ request }));
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
