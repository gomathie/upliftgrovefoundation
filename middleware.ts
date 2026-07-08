import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/auth";

// Gate everything under /admin and /api/admin behind a valid session, except
// the login endpoints themselves.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths reachable without a session (login + password reset flow).
  const PUBLIC_ADMIN_PATHS = new Set([
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/api/admin/login",
    "/api/admin/forgot-password",
    "/api/admin/reset-password",
  ]);
  if (PUBLIC_ADMIN_PATHS.has(pathname)) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const authed = await verifySessionToken(token);

  if (authed) return NextResponse.next();

  // Unauthenticated: API calls get 401, pages redirect to login.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin/:path*"],
};
