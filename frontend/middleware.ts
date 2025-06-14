import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken } from './app/lib/auth';

export function middleware(request: NextRequest) {
  const userIdToken = request.cookies.get('userId')?.value;
  const userRoleToken = request.cookies.get('userRole')?.value;
  const path = request.nextUrl.pathname;

  // Validate tokens and get actual values
  const userId = validateToken(userIdToken);
  const userRole = validateToken(userRoleToken);

  // Block dashboard access if not logged in
  if (!userId && path.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based routing (only if we have valid tokens)
  if (userRole) {
    if (userRole === 'admin') {
      // Only allow /dashboard and /dashboard/admin
      const isAllowed =
        path === '/dashboard' || path.startsWith('/dashboard/admin');
      if (!isAllowed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } else {
      // Non-admin: block access to /dashboard/admin
      if (path.startsWith('/dashboard/admin')) {
        return NextResponse.redirect(new URL('/dashboard/notfound', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
