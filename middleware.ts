import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIX = "/superadmin";
const LOGIN_PATH = "/superadmin/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith(PROTECTED_PREFIX)) {
    return NextResponse.next();
  }
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get("authjs.session-token")?.value ??
    req.cookies.get("__Secure-authjs.session-token")?.value;

  if (!sessionToken) {
    const url = req.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/superadmin", "/superadmin/:path*"],
};
