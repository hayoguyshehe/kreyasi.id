import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/my") || pathname.startsWith("/api/admin");

  if (isDashboard || isAdmin || isProtectedApi) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    });

    // 1. Cek otentikasi login & status akun
    if (!token || token.isSuspended) {
      if (isProtectedApi) {
        return NextResponse.json(
          { success: false, error: "Unauthorized: Akun tidak aktif atau disuspend" },
          { status: 401 }
        );
      }
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // 2. Cek otorisasi role Admin
    if (isAdmin || pathname.startsWith("/api/admin")) {
      const role = token.role as string;
      if (role !== "ADMIN" && role !== "SUPERADMIN") {
        if (isProtectedApi) {
          return NextResponse.json(
            { success: false, error: "Forbidden: Admin access required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/my/:path*",
    "/api/admin/:path*",
  ],
};
