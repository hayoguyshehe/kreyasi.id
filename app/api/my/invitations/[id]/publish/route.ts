import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        package: true,
        order: true,
      },
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    // Cek apakah paket berbayar dan sudah lunas
    const isFree = invitation.package.priceIdr === 0;
    const isPaid = invitation.order?.status === "PAID";

    if (!isFree && !isPaid) {
      return NextResponse.json(
        {
          success: false,
          error: "Undangan ini menggunakan paket berbayar yang belum diselesaikan pembayarannya.",
          requiresPayment: true,
          packagePrice: invitation.package.priceIdr,
        },
        { status: 402 }
      );
    }

    const now = new Date();
    const expiresAt = new Date(
      now.getTime() + invitation.package.activeDurationDays * 24 * 60 * 60 * 1000
    );

    const published = await prisma.invitation.update({
      where: { id },
      data: {
        status: "PUBLISHED",
        publishedAt: now,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Undangan berhasil dipublikasikan!",
      data: published,
    });
  } catch (error) {
    console.error("POST /api/my/invitations/[id]/publish error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mempublikasikan undangan" },
      { status: 500 }
    );
  }
}
