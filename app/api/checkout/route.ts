import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSnapTransaction } from "@/lib/midtrans";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { invitationId, promoCode } = body;

    if (!invitationId) {
      return NextResponse.json(
        { success: false, error: "ID Undangan wajib diisi" },
        { status: 400 }
      );
    }

    const invitation = await prisma.invitation.findUnique({
      where: { id: invitationId },
      include: {
        package: true,
        order: true,
        user: { select: { phone: true } },
      },
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (invitation.order?.status === "PAID") {
      return NextResponse.json(
        { success: false, error: "Undangan ini sudah berhasil dibayar" },
        { status: 400 }
      );
    }

    const basePrice = invitation.package.priceIdr;

    if (basePrice <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Paket ini gratis dan tidak memerlukan proses checkout pembayaran",
        },
        { status: 400 }
      );
    }

    let discount = 0;
    let appliedPromoCodeId: string | null = null;

    if (promoCode && typeof promoCode === "string") {
      const trimmedCode = promoCode.trim().toUpperCase();
      const now = new Date();

      const promo = await prisma.promoCode.findUnique({
        where: { code: trimmedCode },
      });

      if (
        promo &&
        promo.isActive &&
        promo.validFrom <= now &&
        promo.validUntil >= now &&
        (promo.maxUses === null || promo.usedCount < promo.maxUses)
      ) {
        appliedPromoCodeId = promo.id;
        if (promo.discountType === "PERCENT") {
          discount = Math.round(basePrice * (promo.discountValue / 100));
        } else {
          discount = promo.discountValue;
        }
      }
    }

    const finalAmount = Math.max(1000, basePrice - discount); // Minimal 1000 IDR untuk gateway Midtrans

    // Buat kode order unik yang mudah dilacak
    const cleanSlug = invitation.slug.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase();
    const timestampSuffix = Date.now().toString().slice(-6);
    const midtransOrderId = `KRY-${cleanSlug}-${timestampSuffix}`;

    // Buat atau perbarui Order jika sudah ada pending order sebelumnya
    let order;
    if (invitation.order && invitation.order.status === "PENDING") {
      order = await prisma.order.update({
        where: { id: invitation.order.id },
        data: {
          packageId: invitation.packageId,
          promoCodeId: appliedPromoCodeId,
          amountIdr: finalAmount,
          midtransOrderId,
        },
      });
    } else {
      order = await prisma.order.create({
        data: {
          userId: session.user.id,
          packageId: invitation.packageId,
          invitationId: invitation.id,
          promoCodeId: appliedPromoCodeId,
          amountIdr: finalAmount,
          midtransOrderId,
          status: "PENDING",
        },
      });
    }

    // Panggil Midtrans Snap API
    const snapResponse = await createSnapTransaction({
      orderId: midtransOrderId,
      grossAmount: finalAmount,
      customerName: session.user.name || "Pelanggan Kreyasi",
      customerEmail: session.user.email || "customer@kreyasi.id",
      customerPhone: invitation.user?.phone || undefined,
      itemName: `Paket ${invitation.package.name} - ${invitation.eventTitle.slice(0, 35)}`,
    });

    return NextResponse.json({
      success: true,
      message: "Transaksi berhasil diinisiasi",
      data: {
        orderId: order.id,
        midtransOrderId,
        token: snapResponse.token,
        redirectUrl: snapResponse.redirect_url,
        amount: finalAmount,
        basePrice,
        discount,
      },
    });
  } catch (error) {
    console.error("POST /api/checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Gagal memproses transaksi pembayaran",
      },
      { status: 500 }
    );
  }
}
