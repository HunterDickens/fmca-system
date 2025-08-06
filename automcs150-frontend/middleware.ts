import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import type { NextRequest } from 'next/server';

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY!;
const secret = new TextEncoder().encode(JWT_SECRET_KEY);

export async function middleware(request: NextRequest) {

  const { pathname } = request.nextUrl;
  const token = request.cookies.get('accesstoken')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  try {
    // 👇 Verify and decode token
    const { payload } = await jwtVerify(token, secret);

    // Access email from the payload
    const { email, firstName, lastName, isAdmin } = payload;

    if (!isAdmin && pathname.includes("admin")) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Token is valid, continue
    return NextResponse.next();
  } catch (err: any) {
    // 👇 If token is expired or invalid
    console.error('JWT error:', err.message);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - favicon.ico (favicon file)
     */
    '/((?!login|register|_next/static|api/auth|favicon.ico|.*\\.jpg$).*)'
  ]
}
