import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyWebhookSignature, mapMidtransStatus } from "@/lib/midtrans";
import type { PaymentMethod } from "@/generated/prisma";

function resolvePaymentMethod(paymentType?: string): PaymentMethod {
  if (!paymentType) return "VIRTUAL_ACCOUNT";
  const type = paymentType.toLowerCase();
  if (type.includes("qris") || type.includes("gopay") || type.includes("shopeepay")) {
    return "QRIS";
  }
  if (type.includes("va") || type.includes("bank_transfer") || type.includes("echannel") || type.includes("bca_va") || type.includes("bni_va") || type.includes("bri_va")) {
    return "VIRTUAL_ACCOUNT";
  }
  if (type.includes("credit_card") || type.includes("card")) {
    return "CREDIT_CARD";
  }
  if (type.includes("cstore") || type.includes("wallet") || type.includes("ovo") || type.includes("dana")) {
    return "EWALLET";
  }
  return "VIRTUAL_ACCOUNT";
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type,
      transaction_id,
    } = payload;

    if (!order_id || !status_code || !gross_amount || !signature_key) {
      return NextResponse.json(
        { success: false, error: "Parameter webhook tidak lengkap" },
        { status: 400 }
      );
    }

    // 1. Verifikasi SHA-512 Signature Midtrans
    const isValidSignature = verifyWebhookSignature({
      order_id,
      status_code,
      gross_amount,
      signature_key,
    });

    if (!isValidSignature) {
      console.warn(`[Midtrans Webhook] Signature TIDAK valid untuk order_id: ${order_id}`);
      return NextResponse.json(
        { success: false, error: "Invalid signature key" },
        { status: 403 }
      );
    }

    // 2. Cari Order yang bersangkutan
    const order = await prisma.order.findUnique({
      where: { midtransOrderId: order_id },
      include: {
        package: true,
        invitation: true,
      },
    });

    if (!order) {
      console.warn(`[Midtrans Webhook] Order tidak ditemukan: ${order_id}`);
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // 3. Mapping status Midtrans ke status internal
    const targetStatus = mapMidtransStatus(transaction_status, fraud_status);
    const method = resolvePaymentMethod(payment_type);
    const now = new Date();

    // 4. Update dalam transaksi atomik
    await prisma.$transaction(async (tx) => {
      // A. Update Status Order
      await tx.order.update({
        where: { id: order.id },
        data: {
          status: targetStatus,
          paidAt: targetStatus === "PAID" ? now : order.paidAt,
        },
      });

      // B. Catat Audit Trail Pembayaran ke Model Payment
      await tx.payment.upsert({
        where: { orderId: order.id },
        update: {
          method,
          gatewayRef: transaction_id || order_id,
          rawPayload: payload,
          paidAt: targetStatus === "PAID" ? now : null,
        },
        create: {
          orderId: order.id,
          method,
          gatewayRef: transaction_id || order_id,
          rawPayload: payload,
          paidAt: targetStatus === "PAID" ? now : null,
        },
      });

      // C. Jika pembayaran sukses (PAID)
      if (targetStatus === "PAID") {
        // Increment kupon jika dipakai
        if (order.promoCodeId) {
          await tx.promoCode.update({
            where: { id: order.promoCodeId },
            data: { usedCount: { increment: 1 } },
          });
        }

        // Auto-publish undangan dan atur expiresAt
        if (order.invitationId && order.package) {
          const durationDays = order.package.activeDurationDays;
          const expiresAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);

          await tx.invitation.update({
            where: { id: order.invitationId },
            data: {
              status: "PUBLISHED",
              publishedAt: now,
              expiresAt,
            },
          });
        }
      }
    });

    console.log(
      `[Midtrans Webhook] Berhasil memproses order ${order_id} -> Status: ${targetStatus}`
    );

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
      data: { orderId: order.id, status: targetStatus },
    });
  } catch (error) {
    console.error("POST /api/webhooks/midtrans error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
