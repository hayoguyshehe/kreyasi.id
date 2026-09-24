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
      include: {
        package: true,
        template: true,
        giftAccounts: true,
        media: { orderBy: { sortOrder: "asc" } },
        _count: { select: { guests: true, rsvps: true, guestbook: true } },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (invitation.userId !== session.user.id && session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("GET /api/my/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data undangan" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: Bukan pemilik undangan ini" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { eventTitle, eventDate, content, slug } = body;

    const updateData: Record<string, unknown> = {};

    if (eventTitle) updateData.eventTitle = eventTitle;
    if (eventDate) updateData.eventDate = new Date(eventDate);
    if (content) updateData.content = content;

    // Jika user mengedit slug kustom
    if (slug && slug !== invitation.slug) {
      const sanitizedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "");
      const slugExists = await prisma.invitation.findUnique({
        where: { slug: sanitizedSlug },
      });
      if (slugExists) {
        return NextResponse.json(
          { success: false, error: "Tautan URL ini sudah digunakan oleh undangan lain" },
          { status: 409 }
        );
      }
      updateData.slug = sanitizedSlug;
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data: updateData,
    });

    // Sinkronisasi data amplop & kado digital ke tabel gift_accounts jika disertakan
    if (content?.weddingGift) {
      try {
        await prisma.giftAccount.deleteMany({ where: { invitationId: id } });
        const accountsToCreate: {
          invitationId: string;
          type: string;
          bankName: string | null;
          accountNumber: string | null;
          accountName: string | null;
          qrisImageUrl: string | null;
        }[] = [];

        if (Array.isArray(content.weddingGift.accounts)) {
          for (const acc of content.weddingGift.accounts) {
            if (acc.accountNumber?.trim() || acc.bankName?.trim()) {
              accountsToCreate.push({
                invitationId: id,
                type: "BANK_TRANSFER",
                bankName: acc.bankName || "Bank / E-Wallet",
                accountNumber: acc.accountNumber || "",
                accountName: acc.accountName || "",
                qrisImageUrl: null,
              });
            }
          }
        }

        if (content.weddingGift.qrisImageUrl?.trim()) {
          accountsToCreate.push({
            invitationId: id,
            type: "QRIS",
            bankName: "QRIS",
            accountNumber: null,
            accountName: null,
            qrisImageUrl: content.weddingGift.qrisImageUrl,
          });
        }

        if (accountsToCreate.length > 0) {
          await prisma.giftAccount.createMany({ data: accountsToCreate });
        }
      } catch (syncErr) {
        console.error("Error syncing gift accounts:", syncErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Konten undangan berhasil disimpan",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/my/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui undangan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Undangan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/my/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus undangan" },
      { status: 500 }
    );
  }
}
