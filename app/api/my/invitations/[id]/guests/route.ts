import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { addGuestSchema } from "@/lib/validators/guest";
import { generatePersonalSlug } from "@/lib/utils";

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

    const guests = await prisma.guest.findMany({
      where: { invitationId: id },
      include: {
        rsvp: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: guests,
    });
  } catch (error) {
    console.error("GET /api/my/invitations/[id]/guests error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar tamu" },
      { status: 500 }
    );
  }
}

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

    // Cek limitasi kapasitas tamu paket
    if (
      invitation.package.maxGuests !== null &&
      invitation._count.guests >= invitation.package.maxGuests
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Batas kuota tamu untuk paket ${invitation.package.name} (${invitation.package.maxGuests} tamu) telah tercapai. Silakan upgrade paket Anda.`,
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = addGuestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues?.[0]?.message || "Data tamu tidak valid",
        },
        { status: 400 }
      );
    }

    const { name, whatsapp, invitedCount } = parsed.data;

    // Generate unique personalSlug
    let personalSlug = generatePersonalSlug();
    let isUnique = false;
    while (!isUnique) {
      const exists = await prisma.guest.findUnique({
        where: { personalSlug },
      });
      if (!exists) isUnique = true;
      else personalSlug = generatePersonalSlug();
    }

    const guest = await prisma.guest.create({
      data: {
        invitationId: id,
        name: name.trim(),
        whatsapp: whatsapp ? whatsapp.trim() : null,
        invitedCount,
        personalSlug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Tamu berhasil ditambahkan",
        data: guest,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/my/invitations/[id]/guests error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan tamu" },
      { status: 500 }
    );
  }
}
