import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { guestbookSchema } from "@/lib/validators/rsvp";
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
          error: "Terlalu banyak pengiriman ucapan. Silakan tunggu 1 menit sebelum mencoba kembali.",
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
    const parsed = guestbookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues?.[0]?.message || "Nama dan ucapan wajib diisi",
        },
        { status: 400 }
      );
    }

    const { name, message } = parsed.data;

    // Sanitasi XSS menggunakan isomorphic-dompurify
    const cleanName = sanitizeHtml(name.trim());
    const cleanMessage = sanitizeHtml(message.trim());

    if (!cleanName || !cleanMessage) {
      return NextResponse.json(
        { success: false, error: "Karakter tidak valid terdeteksi pada input" },
        { status: 400 }
      );
    }

    const newMsg = await prisma.guestbookMessage.create({
      data: {
        invitationId: invitation.id,
        name: cleanName,
        message: cleanMessage,
        isApproved: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Terima kasih atas ucapan dan doa yang Anda berikan!",
        data: newMsg,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/invitations/[slug]/guestbook error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengirimkan ucapan buku tamu" },
      { status: 500 }
    );
  }
}
