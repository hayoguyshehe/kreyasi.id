import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Cache in-memory resolusi custom domain (TTL 5 menit)
const domainCache = new Map<string, { slug: string | null; expiresAt: number }>();

async function resolveCustomDomain(domain: string, reqUrl: string): Promise<string | null> {
  const cached = domainCache.get(domain);
  const now = Date.now();
  if (cached && cached.expiresAt > now) {
    return cached.slug;
  }

  try {
    const res = await fetch(
      new URL(`/api/domains/resolve?domain=${encodeURIComponent(domain)}`, reqUrl)
    );
    if (!res.ok) return null;
    const data = await res.json();
    const slug = data.slug || null;
    domainCache.set(domain, { slug, expiresAt: now + 5 * 60 * 1000 });
    return slug;
  } catch (error) {
    console.error(`[Proxy] Error resolving custom domain "${domain}":`, error);
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hostHeader = request.headers.get("host")?.toLowerCase() || "";
  const hostname = hostHeader.split(":")[0]; // hilangkan port jika ada

  const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "kreyasi.id").toLowerCase();
  const apexHosts = new Set([
    rootDomain,
    `www.${rootDomain}`,
    "localhost",
    "127.0.0.1",
    "0.0.0.0",
  ]);

  // Abaikan pemrosesan multi-tenant untuk request internal API dan aset statis
  const isStaticOrInternal =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico";

  // ============================================================
  // MULTI-TENANT ROUTING (PRD Bagian 6.3)
  // ============================================================
  if (!isStaticOrInternal) {
    // 1. Cek Subdomain: misal {slug}.kreyasi.id atau {slug}.localhost
    const isSubdomainOfRoot = hostname.endsWith(`.${rootDomain}`) && hostname !== `www.${rootDomain}`;
    const isSubdomainOfLocal = hostname.endsWith(".localhost");

    if (isSubdomainOfRoot || isSubdomainOfLocal) {
      let slug = "";
      if (isSubdomainOfRoot) {
        slug = hostname.slice(0, -(rootDomain.length + 1));
      } else if (isSubdomainOfLocal) {
        slug = hostname.slice(0, -".localhost".length);
      }

      // Abaikan reserved subdomains jika ada
      const reserved = ["www", "admin", "app", "api", "dashboard", "mail"];
      if (slug && !reserved.includes(slug)) {
        const targetPath = pathname === "/" ? `/u/${slug}` : `/u/${slug}${pathname}`;
        return NextResponse.rewrite(new URL(`${targetPath}${search}`, request.url));
      }
    }

    // 2. Cek Custom Domain (Tier Eksklusif): misal budi-ani.com
    const isApex = apexHosts.has(hostname) || hostname.endsWith(".vercel.app");
    if (!isApex && !isSubdomainOfRoot && !isSubdomainOfLocal) {
      const resolvedSlug = await resolveCustomDomain(hostname, request.url);
      if (resolvedSlug) {
        const targetPath = pathname === "/" ? `/u/${resolvedSlug}` : `/u/${resolvedSlug}${pathname}`;
        return NextResponse.rewrite(new URL(`${targetPath}${search}`, request.url));
      }
    }
  }

  // ============================================================
  // AUTHENTICATION & ROLE-BASED ACCESS CONTROL
  // ============================================================
  const isDashboard = pathname.startsWith("/dashboard");
  const isAdmin = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/my") || pathname.startsWith("/api/admin");

  if (isDashboard || isAdmin || isProtectedApi) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "8sJDFfUKUu2YKvya5dMu+5oYAKikBgvCQgoDbkf8mxo=",
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
    /*
     * Tangkap semua request halaman untuk resolusi host / multi-tenancy,
     * tetapi kecualikan file statis Next.js dan aset statis publik.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
