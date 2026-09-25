import { prisma } from "../lib/prisma";
import { createSnapTransaction, generateWebhookSignature } from "../lib/midtrans";
import { POST as handleWebhook } from "../app/api/webhooks/midtrans/route";
import { NextRequest } from "next/server";

async function runMidtransE2ETest() {
  console.log("=================================================");
  console.log("TEST E2E CHECKOUT MIDTRANS & WEBHOOK PRODUCTION");
  console.log("=================================================\n");

  const user = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  const pkg = await prisma.package.findFirst({ where: { priceIdr: { gt: 0 } } });

  if (!user || !pkg) {
    throw new Error("User atau Paket berbayar tidak ditemukan");
  }

  const orderId = `KREYASI-TEST-${Date.now()}`;
  const amount = pkg.priceIdr;

  // 1. Buat Order di Database dengan status PENDING
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      amountIdr: amount,
      midtransOrderId: orderId,
      status: "PENDING",
    },
  });

  console.log(`[SEBELUM TRANSAKSI]`);
  console.log(`- Order ID: ${order.id}`);
  console.log(`- Midtrans Order ID: ${order.midtransOrderId}`);
  console.log(`- Paket: ${pkg.name} (Rp ${amount.toLocaleString("id-ID")})`);
  console.log(`- Status Database: ${order.status}`);
  console.log(`- Paid At: ${order.paidAt || "null"}`);

  // 2. Buat Snap Token ke Server Midtrans Sandbox
  console.log(`\nMenghubungi API Midtrans Sandbox (${process.env.MIDTRANS_IS_PRODUCTION === "true" ? "Production" : "Sandbox"})...`);
  const snap = await createSnapTransaction({
    orderId,
    grossAmount: amount,
    customerName: user.name,
    customerEmail: user.email,
    itemName: `Paket ${pkg.name}`,
  });

  console.log(`- Snap Token Diterima: ${snap.token.substring(0, 15)}...`);
  console.log(`- Redirect URL: ${snap.redirect_url}`);

  // 3. Simulasikan Notifikasi Webhook Resmi dari Midtrans (Settlement / Berhasil Bayar)
  const statusCode = "200";
  const grossAmountStr = `${amount}.00`;
  const signatureKey = generateWebhookSignature({
    order_id: orderId,
    status_code: statusCode,
    gross_amount: grossAmountStr,
  });

  const webhookPayload = {
    transaction_time: new Date().toISOString(),
    transaction_status: "settlement",
    transaction_id: `MIDTRANS-TRX-${Date.now()}`,
    status_message: "midtrans payment notification",
    status_code: statusCode,
    signature_key: signatureKey,
    payment_type: "bank_transfer",
    order_id: orderId,
    gross_amount: grossAmountStr,
    fraud_status: "accept",
    currency: "IDR",
  };

  console.log(`\nMengirim notifikasi webhook Midtrans ke endpoint /api/webhooks/midtrans...`);
  const req = new NextRequest("https://kreyasi.id/api/webhooks/midtrans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload),
  });

  const res = await handleWebhook(req);
  const resJson = await res.json();
  console.log(`- HTTP Status Webhook: ${res.status}`);
  console.log(`- Respon Webhook: ${JSON.stringify(resJson)}`);

  // 4. Cek Database Langsung Setelah Webhook
  const updatedOrder = await prisma.order.findUnique({
    where: { id: order.id },
    include: { payment: true },
  });

  console.log(`\n[SETELAH TRANSAKSI & WEBHOOK]`);
  console.log(`- Order ID: ${updatedOrder?.id}`);
  console.log(`- Status Database: ${updatedOrder?.status} (SEBELUMNYA: PENDING, KINI: ${updatedOrder?.status})`);
  console.log(`- Waktu Pembayaran (paidAt): ${updatedOrder?.paidAt?.toISOString()}`);
  console.log(`- Audit Trail Payment Method: ${updatedOrder?.payment?.method}`);
  console.log(`- Audit Trail Gateway Ref: ${updatedOrder?.payment?.gatewayRef}`);

  if (updatedOrder?.status !== "PAID") {
    throw new Error("TEST GAGAL: Status order tidak berubah menjadi PAID!");
  }

  console.log("\n>>> HASIL PENGUJIAN E2E CHECKOUT: BERHASIL! STATUS ORDER BERHASIL BERUBAH DARI PENDING KE PAID DENGAN AUDIT TRAIL LENGKAP!");

  // Cleanup
  await prisma.payment.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
}

runMidtransE2ETest()
  .catch((err) => {
    console.error("Error menjalankan test Midtrans:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
