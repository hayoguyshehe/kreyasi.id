import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      include: {
        template: {
          select: { name: true, themeConfig: true },
        },
        giftAccounts: true,
        media: {
          orderBy: { sortOrder: "asc" },
        },
        guestbook: {
          where: { isApproved: true },
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!invitation || invitation.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan atau belum dipublikasikan" },
        { status: 404 }
      );
    }

    const now = new Date();
    if (invitation.expiresAt && new Date(invitation.expiresAt).getTime() < now.getTime()) {
      return NextResponse.json(
        {
          success: false,
          error: "Masa aktif undangan telah berakhir",
          isExpired: true,
        },
        { status: 410 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("GET /api/invitations/[slug]/public error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memuat data undangan" },
      { status: 500 }
    );
  }
}
