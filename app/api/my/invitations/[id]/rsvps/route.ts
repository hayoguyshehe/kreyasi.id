import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
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
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const rsvps = await prisma.rsvp.findMany({
      where: { invitationId: id },
      include: {
        guest: {
          select: { name: true, whatsapp: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    let totalHadir = 0;
    let totalTidakHadir = 0;
    let totalRagu = 0;
    let totalPorsiHadir = 0;

    for (const r of rsvps) {
      if (r.status === "HADIR") {
        totalHadir += 1;
        totalPorsiHadir += r.attendeeCount;
      } else if (r.status === "TIDAK_HADIR") {
        totalTidakHadir += 1;
      } else {
        totalRagu += 1;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        rsvps,
        summary: {
          totalRsvps: rsvps.length,
          totalHadir,
          totalTidakHadir,
          totalRagu,
          totalPorsiHadir,
        },
      },
    });
  } catch (error) {
    console.error("GET /api/my/invitations/[id]/rsvps error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data RSVP" },
      { status: 500 }
    );
  }
}
