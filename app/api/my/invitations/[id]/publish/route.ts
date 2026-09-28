import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertInvitationAccess } from "@/lib/invitation-access";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const { id } = await context.params;

    const access = await assertInvitationAccess(id, session?.user, {
      include: {
        package: true,
        order: true,
      },
    });

    if (!access.authorized) {
      return access.response;
    }

    const invitation = access.invitation;

    // Validasi kelengkapan data wajib sebelum dipublikasikan menjadi undangan resmi
    const content = (invitation.content as any) || {};
    const isWedding = invitation.eventCategory === "PERNIKAHAN";
    const missingFields: string[] = [];

    if (isWedding) {
      if (!content.couple?.groomName?.trim()) {
        missingFields.push("Nama Mempelai Pria");
      }
      if (!content.couple?.brideName?.trim()) {
        missingFields.push("Nama Mempelai Wanita");
      }
    } else {
      if (!content.person?.name?.trim()) {
        missingFields.push("Nama Tokoh / Yang Berbahagia");
      }
    }

    if (!invitation.eventDate) {
      missingFields.push("Tanggal Acara");
    }

    if (!content.mapsUrl?.trim()) {
      missingFields.push("Link Google Maps Lokasi Acara");
    }

    // Validasi sesi acara (minimal akad dan resepsi untuk pernikahan)
    const events = content.events || [];
    if (isWedding) {
      const hasAkad = events.some(
        (e: any) => e.name?.toLowerCase().includes("akad") && e.venueAddress?.trim()
      );
      const hasResepsi = events.some(
        (e: any) => e.name?.toLowerCase().includes("resepsi") && e.venueAddress?.trim()
      );
      if (!hasAkad) missingFields.push("Rincian Akad (Tanggal, Waktu, Lokasi)");
      if (!hasResepsi) missingFields.push("Rincian Resepsi (Tanggal, Waktu, Lokasi)");
    } else {
      if (events.length === 0 || !events[0]?.venueAddress?.trim()) {
        missingFields.push("Waktu dan Lokasi Acara Utama");
      }
    }

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Mohon lengkapi data utama berikut sebelum mempublikasikan undangan: ${missingFields.join(", ")}. Data pendukung seperti Galeri Foto, Love Story, dan Amplop Kado dapat dilengkapi nanti.`,
          missingFields,
        },
        { status: 400 }
      );
    }

    // Cek apakah paket berbayar dan sudah lunas, atau undangan gratis/kerjasama (isComplimentary)
    const isFree = invitation.package.priceIdr === 0;
    const isPaid = invitation.order?.status === "PAID";
    const isComplimentary = Boolean(invitation.isComplimentary);

    if (!isFree && !isPaid && !isComplimentary) {
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
    // Masa aktif: jika isComplimentary, pertahankan konfigurasi expiresAt (bisa null = tanpa kedaluwarsa, atau tanggal tertentu)
    // Jika bukan complimentary, masa aktif mengikuti default durasi paket
    let expiresAt: Date | null = null;
    if (isComplimentary) {
      expiresAt = invitation.expiresAt ? new Date(invitation.expiresAt) : null;
    } else {
      expiresAt = new Date(
        now.getTime() + invitation.package.activeDurationDays * 24 * 60 * 60 * 1000
      );
    }

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
