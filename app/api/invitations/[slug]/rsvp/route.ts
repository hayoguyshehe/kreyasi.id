import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validators/rsvp";
import { sanitizeHtml } from "@/lib/utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    // Rate Limiting: Maks. 10 submission per menit per IP + undangan
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`${clientIp}:${slug}`, 10, 60 * 1000);

    if (!rateLimit.success) {
      const retryAfterSec = Math.max(1, Math.ceil((rateLimit.resetTime - Date.now()) / 1000));
      return NextResponse.json(
        {
          success: false,
          error: "Terlalu banyak pengiriman RSVP. Silakan tunggu 1 menit sebelum mencoba kembali.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfterSec),
            "X-RateLimit-Limit": String(rateLimit.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { slug },
      select: { id: true, status: true },
    });

    if (!invitation || invitation.status !== "PUBLISHED") {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan atau belum dipublikasikan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = rsvpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues?.[0]?.message || "Data RSVP tidak valid",
        },
        { status: 400 }
      );
    }

    const { guestPersonalSlug, guestNameFallback, status, attendeeCount, message } =
      parsed.data;

    const sanitizedMessage = message ? sanitizeHtml(message) : null;
    const sanitizedFallbackName = guestNameFallback
      ? sanitizeHtml(guestNameFallback)
      : null;

    let guestId: string | null = null;

    // Jika membawa tautan personal tamu
    if (guestPersonalSlug) {
      const guest = await prisma.guest.findUnique({
        where: { personalSlug: guestPersonalSlug },
      });

      if (guest && guest.invitationId === invitation.id) {
        guestId = guest.id;

        // Tandai dibuka jika belum
        if (!guest.openedAt) {
          await prisma.guest.update({
            where: { id: guest.id },
            data: { openedAt: new Date() },
          });
        }
      }
    }

    if (guestId) {
      // Upsert jika tamu sudah pernah submit RSVP
      await prisma.rsvp.upsert({
        where: { guestId },
        update: {
          status,
          attendeeCount,
          message: sanitizedMessage,
        },
        create: {
          invitationId: invitation.id,
          guestId,
          status,
          attendeeCount,
          message: sanitizedMessage,
        },
      });
    } else {
      // Tamu publik tanpa personal link
      await prisma.rsvp.create({
        data: {
          invitationId: invitation.id,
          guestNameFallback: sanitizedFallbackName || "Tamu Undangan",
          status,
          attendeeCount,
          message: sanitizedMessage,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Terima kasih! Konfirmasi kehadiran Anda telah berhasil dikirim.",
    });
  } catch (error) {
    console.error("POST /api/invitations/[slug]/rsvp error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyimpan konfirmasi kehadiran" },
      { status: 500 }
    );
  }
}
