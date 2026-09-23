import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain");
  if (!domain) {
    return NextResponse.json({ slug: null });
  }

  try {
    const invitation = await prisma.invitation.findUnique({
      where: { customDomain: domain.toLowerCase() },
      select: { slug: true },
    });
    return NextResponse.json({ slug: invitation?.slug || null });
  } catch (error) {
    console.error(`[API] Error resolving custom domain "${domain}":`, error);
    return NextResponse.json({ slug: null });
  }
}
