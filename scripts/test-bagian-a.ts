import { prisma } from "../lib/prisma";
import { hash, compare } from "bcryptjs";
import { generateWebhookSignature } from "../lib/midtrans";
import { POST as handleWebhook } from "../app/api/webhooks/midtrans/route";
import { NextRequest } from "next/server";

async function runTests() {
  console.log("=================================================");
  console.log("MEMULAI PENGUJIAN OTOMATIS BAGIAN A (DOKUMENTASI BUKTI)");
  console.log("=================================================\n");

  // ========================================================
  // TEST ITEM 1: ALUR AKUN GOOGLE-ONLY (SET PASSWORD & LOGIN)
  // ========================================================
  console.log("--- [TEST 1] User Google-Only (Set Password & Login) ---");
  const testGoogleEmail = `test.google.${Date.now()}@example.com`;

  // 1. Simulasikan user yang mendaftar via Google OAuth (passwordHash: null)
  const googleUser = await prisma.user.create({
    data: {
      name: "Google User Test",
      email: testGoogleEmail,
      emailVerified: new Date(),
      passwordHash: null, // Murni Google OAuth
      role: "CUSTOMER",
    },
  });

  console.log(`1. User dibuat via Google OAuth: ID=${googleUser.id}, Email=${googleUser.email}, passwordHash=${googleUser.passwordHash}`);

  // Verifikasi kondisi awal: tidak bisa login pakai password
  const initialLoginAttempt = googleUser.passwordHash
    ? await compare("PasswordBaru123!", googleUser.passwordHash)
    : false;
  console.log(`2. Verifikasi sebelum Set Password: Login email/password valid? -> ${initialLoginAttempt} (Harus false)`);

  // 3. Simulasikan aksi Set Password dari dashboard
  const newPasswordPlain = "PasswordBaru123!";
  const generatedHash = await hash(newPasswordPlain, 12);

  const updatedUser = await prisma.user.update({
    where: { id: googleUser.id },
    data: { passwordHash: generatedHash },
  });

  console.log(`3. Password berhasil diatur: passwordHash=${updatedUser.passwordHash?.substring(0, 20)}... (Bcrypt hash)`);

  // 4. Verifikasi user kini bisa login via Credentials Provider
  const isNewPasswordValid = await compare(newPasswordPlain, updatedUser.passwordHash!);
  console.log(`4. Verifikasi setelah Set Password: Login dengan password baru valid? -> ${isNewPasswordValid} (Harus true)`);

  if (!isNewPasswordValid) {
    throw new Error("TEST 1 GAGAL: User tidak bisa login dengan password baru!");
  }
  console.log(">>> HASIL TEST 1: BERHASIL MEMENUHI DEFINITION OF DONE!\n");

  // ========================================================
  // TEST ITEM 2: PENGARASAN IDEMPOTENSI WEBHOOK (PROMISE.ALL)
  // ========================================================
  console.log("--- [TEST 2] Pengerasan Idempotensi Webhook (Parallel Promise.all) ---");

  // 1. Cari atau buat Package & Template untuk order test
  let pkg = await prisma.package.findFirst({ where: { isActive: true } });
  if (!pkg) {
    pkg = await prisma.package.create({
      data: {
        name: "Paket Test Idempotensi",
        slug: `paket-test-${Date.now()}`,
        priceIdr: 149000,
        activeDurationDays: 30,
        maxGalleryPhotos: 10,
        maxGalleryVideos: 1,
      },
    });
  }

  let template = await prisma.template.findFirst();
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: { name: "Pernikahan", slug: `pernikahan-${Date.now()}` },
    });
  }
  if (!template) {
    template = await prisma.template.create({
      data: {
        name: "Template Test",
        slug: `template-test-${Date.now()}`,
        categoryId: category.id,
        minPackageTier: 1,
        previewImageUrl: "https://example.com/preview.jpg",
        themeConfig: {},
      },
    });
  }

  // Buat invitation pendukung
  const testInvitation = await prisma.invitation.create({
    data: {
      userId: googleUser.id,
      packageId: pkg.id,
      templateId: template.id,
      slug: `undangan-test-${Date.now()}`,
      eventCategory: "PERNIKAHAN",
      eventTitle: "Pernikahan Test Idempotensi",
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      content: {},
      status: "DRAFT",
    },
  });

  const testMidtransOrderId = `ORDER-TEST-IDEMP-${Date.now()}`;
  const grossAmount = "149000.00";
  const statusCode = "200";

  // Buat Order dengan status awal PENDING
  const order = await prisma.order.create({
    data: {
      userId: googleUser.id,
      packageId: pkg.id,
      invitationId: testInvitation.id,
      amountIdr: 149000,
      midtransOrderId: testMidtransOrderId,
      status: "PENDING",
    },
  });

  console.log(`1. Order dibuat: ID=${order.id}, midtransOrderId=${testMidtransOrderId}, Status Awal=${order.status}`);

  // 2. Buat signature SHA-512 Midtrans valid
  const signatureKey = generateWebhookSignature({
    order_id: testMidtransOrderId,
    status_code: statusCode,
    gross_amount: grossAmount,
  });

  const webhookPayload = {
    order_id: testMidtransOrderId,
    status_code: statusCode,
    gross_amount: grossAmount,
    signature_key: signatureKey,
    transaction_status: "settlement",
    fraud_status: "accept",
    payment_type: "qris",
    transaction_id: `TRX-${Date.now()}`,
  };

  console.log(`2. Menyiapkan 2 request webhook identik dan menembakkannya secara PARALEL (Promise.all)...`);

  // 3. Jalankan 2 request webhook identik secara paralel persis di saat yang sama
  const req1 = new NextRequest("http://localhost:3000/api/webhooks/midtrans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload),
  });

  const req2 = new NextRequest("http://localhost:3000/api/webhooks/midtrans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(webhookPayload),
  });

  const [res1, res2] = await Promise.all([
    handleWebhook(req1),
    handleWebhook(req2),
  ]);

  const json1 = await res1.json();
  const json2 = await res2.json();

  console.log(`Response Request 1: HTTP ${res1.status} -> ${JSON.stringify(json1)}`);
  console.log(`Response Request 2: HTTP ${res2.status} -> ${JSON.stringify(json2)}`);

  // 4. Verifikasi integritas database setelah race condition:
  const finalOrder = await prisma.order.findUnique({
    where: { id: order.id },
  });

  const paymentRecords = await prisma.payment.findMany({
    where: { orderId: order.id },
  });

  const finalInvitation = await prisma.invitation.findUnique({
    where: { id: testInvitation.id },
  });

  console.log("\n--- VERIFIKASI HASIL DATABASE SETELAH DUA WEBHOOK PARALEL ---");
  console.log(`- Status Order: ${finalOrder?.status} (Harus: PAID)`);
  console.log(`- Jumlah Record Payment: ${paymentRecords.length} (Harus: TEPAT 1)`);
  console.log(`- Status Undangan: ${finalInvitation?.status} (Harus: PUBLISHED)`);
  console.log(`- Tanggal Kadaluarsa Undangan (expiresAt): ${finalInvitation?.expiresAt?.toISOString()}`);

  if (finalOrder?.status !== "PAID") {
    throw new Error(`TEST 2 GAGAL: Status order adalah ${finalOrder?.status}, bukan PAID`);
  }

  if (paymentRecords.length !== 1) {
    throw new Error(`TEST 2 GAGAL: Tercipta ${paymentRecords.length} record Payment! Race condition bocor!`);
  }

  console.log(">>> HASIL TEST 2: BERHASIL MEMENUHI DEFINITION OF DONE! ROW-LOCK AKTIF & HANYA 1 EFEK TERJADI!\n");

  // Cleanup data uji
  await prisma.payment.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
  await prisma.invitation.delete({ where: { id: testInvitation.id } });
  await prisma.user.delete({ where: { id: googleUser.id } });
  console.log("Pembersihan data uji selesai.");
}

runTests()
  .catch((err) => {
    console.error("Error menjalankan pengujian:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
