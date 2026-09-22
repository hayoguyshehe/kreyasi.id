import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, guestId } = await context.params;

    const [invitation, guest] = await Promise.all([
      prisma.invitation.findUnique({ where: { id } }),
      prisma.guest.findUnique({ where: { id: guestId } }),
    ]);

    if (!invitation || !guest || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Data undangan atau tamu tidak ditemukan" },
        { status: 404 }
      );
    }

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://kreyasi.id";
    const personalUrl = `${appUrl}/u/${invitation.slug}?to=${guest.personalSlug}`;

    // Buat template teks WhatsApp yang santun dan profesional
    const message = `Kepada Yth. *${guest.name}*,

Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri momen spesial kami:

✨ *${invitation.eventTitle}* ✨

Untuk melihat informasi lengkap rangkaian acara, peta lokasi, dan melakukan konfirmasi kehadiran (RSVP), silakan kunjungi tautan undangan berikut:

👉 ${personalUrl}

Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir serta memberikan doa restu.

Terima kasih.`;

    let waPhone = "";
    if (guest.whatsapp) {
      let p = guest.whatsapp.replace(/\D/g, "");
      if (p.startsWith("0")) {
        p = "62" + p.slice(1);
      }
      waPhone = p;
    }

    const whatsappShareUrl = waPhone
      ? `https://wa.me/${waPhone}?text=${encodeURIComponent(message)}`
      : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      data: {
        personalUrl,
        message,
        whatsappShareUrl,
      },
    });
  } catch (error) {
    console.error("GET share-link error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat tautan berbagi" },
      { status: 500 }
    );
  }
}
