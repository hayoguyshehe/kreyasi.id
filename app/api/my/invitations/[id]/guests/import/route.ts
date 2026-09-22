import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { guestImportBatchSchema } from "@/lib/validators/guest";
import { generatePersonalSlug } from "@/lib/utils";

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
        _count: { select: { guests: true } },
      },
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = guestImportBatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues?.[0]?.message || "Format data import tidak valid",
        },
        { status: 400 }
      );
    }

    const newGuests = parsed.data.guests;

    // Cek limit kapasitas
    if (invitation.package.maxGuests !== null) {
      const remainingQuota =
        invitation.package.maxGuests - invitation._count.guests;
      if (newGuests.length > remainingQuota) {
        return NextResponse.json(
          {
            success: false,
            error: `Jumlah tamu yang di-import (${newGuests.length}) melebihi sisa kuota paket (${remainingQuota} tamu tersisa).`,
          },
          { status: 403 }
        );
      }
    }

    // Persiapkan data dengan personal slug unik
    const insertData = newGuests.map((g) => ({
      invitationId: id,
      name: g.name.trim(),
      whatsapp: g.whatsapp ? g.whatsapp.trim() : null,
      invitedCount: g.invitedCount || 1,
      personalSlug: generatePersonalSlug(),
    }));

    await prisma.guest.createMany({
      data: insertData,
    });

    return NextResponse.json({
      success: true,
      message: `Berhasil mengimpor ${insertData.length} data tamu`,
      count: insertData.length,
    });
  } catch (error) {
    console.error("POST /api/my/invitations/[id]/guests/import error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengimpor daftar tamu" },
      { status: 500 }
    );
  }
}
