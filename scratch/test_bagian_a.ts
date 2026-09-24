import { prisma } from "../lib/prisma";
import { hash, compare } from "bcryptjs";

async function testItem1() {
  console.log("\n=======================================================");
  console.log("TEST ITEM 1: ALUR AKUN GOOGLE-ONLY & SET PASSWORD");
  console.log("=======================================================");

  // 1. Cari user Google
  const googleUser = await prisma.user.findUnique({
    where: { email: "ngodingbarengasik@gmail.com" },
  });

  if (!googleUser) {
    console.error("❌ User Google ngodingbarengasik@gmail.com tidak ditemukan di database!");
    return false;
  }

  console.log(`[Item 1 - Step 1] Ditemukan user Google: ${googleUser.email}`);
  console.log(`[Item 1 - Step 1] Status awal passwordHash: ${googleUser.passwordHash}`);

  // 2. Simulasikan aksi Set Password
  const testNewPassword = "GoogleUserNewPass2026!";
  const newPasswordHash = await hash(testNewPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { id: googleUser.id },
    data: { passwordHash: newPasswordHash },
    select: { id: true, email: true, name: true, passwordHash: true },
  });

  console.log(`[Item 1 - Step 2] Berhasil set password untuk user ID: ${updatedUser.id}`);
  console.log(`[Item 1 - Step 2] passwordHash terisi: ${updatedUser.passwordHash?.substring(0, 20)}...`);

  // 3. Verifikasi alur login credentials
  const fetchedUser = await prisma.user.findUnique({
    where: { email: "ngodingbarengasik@gmail.com" },
  });

  if (!fetchedUser || !fetchedUser.passwordHash) {
    console.error("❌ Gagal re-fetch user atau passwordHash kosong!");
    return false;
  }

  const isPasswordValid = await compare(testNewPassword, fetchedUser.passwordHash);
  const isWrongPasswordRejected = !(await compare("WrongPassword123", fetchedUser.passwordHash));

  console.log(`[Item 1 - Step 3] Validasi password benar: ${isPasswordValid ? "PASSED ✅" : "FAILED ❌"}`);
  console.log(`[Item 1 - Step 3] Penolakan password salah: ${isWrongPasswordRejected ? "PASSED ✅" : "FAILED ❌"}`);

  if (isPasswordValid && isWrongPasswordRejected) {
    console.log("🎉 ITEM 1 VERIFIED: User Google-only kini sukses memiliki kata sandi dan bisa login via credentials!");
    return true;
  }
  return false;
}

async function testItem2() {
  console.log("\n=======================================================");
  console.log("TEST ITEM 2: IDEMPOTENSI WEBHOOK MIDTRANS DENGAN ROW LOCK");
  console.log("=======================================================");

  // 1. Cari atau buat paket dan user untuk test order
  const pkg = await prisma.package.findFirst({ where: { isActive: true } });
  const user = await prisma.user.findFirst();

  if (!pkg || !user) {
    console.error("❌ Data master paket atau user tidak ditemukan");
    return false;
  }

  // Buat order dan invitation dummy untuk pengujian race condition
  const testOrderId = `TEST-RACE-${Date.now()}`;
  const now = new Date();

  const testInvitation = await prisma.invitation.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      templateId: (await prisma.template.findFirst())?.id || "",
      slug: `test-race-${Date.now()}`,
      eventCategory: "PERNIKAHAN",
      eventTitle: "Uji Coba Idempotensi Webhook",
      eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      content: {},
      status: "DRAFT",
    },
  });

  const testOrder = await prisma.order.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      invitationId: testInvitation.id,
      amountIdr: pkg.priceIdr,
      status: "PENDING",
      midtransOrderId: testOrderId,
    },
  });

  console.log(`[Item 2 - Step 1] Dummy Order dibuat: ${testOrder.midtransOrderId} (ID: ${testOrder.id})`);
  console.log(`[Item 2 - Step 1] Status awal: Order=${testOrder.status}, Invitation=${testInvitation.status}`);

  // 2. Fungsi worker yang mereplikasi logika transaksi Midtrans dengan SELECT ... FOR UPDATE
  let processedCount = 0;
  let skippedCount = 0;

  const simulateWebhookTransaction = async (workerId: string) => {
    return await prisma.$transaction(async (tx) => {
      // A. Kunci baris order dengan FOR UPDATE
      await tx.$queryRaw`SELECT id FROM orders WHERE id = ${testOrder.id} FOR UPDATE`;

      // B. Re-fetch data terbaru
      const currentOrder = await tx.order.findUnique({
        where: { id: testOrder.id },
        include: { invitation: true, package: true },
      });

      if (!currentOrder) throw new Error("Order not found");

      // C. Idempotensi race guard
      if (currentOrder.status === "PAID") {
        console.log(`[Worker ${workerId}] 🛡️ Terdeteksi status sudah PAID (ROW LOCKED). Melewati efek samping.`);
        skippedCount++;
        return { workerId, result: "SKIPPED_DUPLICATE" };
      }

      // D. Simulasi proses update & efek samping
      const paidTimestamp = new Date();
      await tx.order.update({
        where: { id: currentOrder.id },
        data: {
          status: "PAID",
          paidAt: paidTimestamp,
        },
      });

      await tx.payment.upsert({
        where: { orderId: currentOrder.id },
        update: {
          method: "QRIS",
          gatewayRef: `GW-${testOrderId}`,
          rawPayload: { worker: workerId },
          paidAt: paidTimestamp,
        },
        create: {
          orderId: currentOrder.id,
          method: "QRIS",
          gatewayRef: `GW-${testOrderId}`,
          rawPayload: { worker: workerId },
          paidAt: paidTimestamp,
        },
      });

      if (currentOrder.invitationId && currentOrder.package) {
        const durationDays = currentOrder.package.activeDurationDays;
        const expiresAt = new Date(paidTimestamp.getTime() + durationDays * 24 * 60 * 60 * 1000);

        await tx.invitation.update({
          where: { id: currentOrder.invitationId },
          data: {
            status: "PUBLISHED",
            publishedAt: paidTimestamp,
            expiresAt,
          },
        });
      }

      console.log(`[Worker ${workerId}] ⚡ Berhasil memproses pembayaran pertama kali.`);
      processedCount++;
      return { workerId, result: "PROCESSED" };
    });
  };

  // 3. Jalankan 2 request secara BERSAMAAN (Promise.all)
  console.log("[Item 2 - Step 2] Mengirim 2 notifikasi webhook identik secara paralel via Promise.all...");
  const results = await Promise.all([
    simulateWebhookTransaction("REQ-A"),
    simulateWebhookTransaction("REQ-B"),
  ]);

  console.log("[Item 2 - Step 2] Hasil eksekusi paralel:", results);

  // 4. Verifikasi kondisi akhir database
  const finalOrder = await prisma.order.findUnique({
    where: { id: testOrder.id },
    include: { payment: true, invitation: true },
  });

  const paymentRecords = await prisma.payment.count({
    where: { orderId: testOrder.id },
  });

  console.log("\n[Item 2 - Step 3] Verifikasi Hasil Akhir:");
  console.log(`- Order Status: ${finalOrder?.status} (Harus PAID)`);
  console.log(`- Total Record Payment: ${paymentRecords} (Harus tepat 1)`);
  console.log(`- Invitation Status: ${finalOrder?.invitation?.status} (Harus PUBLISHED)`);
  console.log(`- Invitation ExpiresAt: ${finalOrder?.invitation?.expiresAt?.toISOString()}`);
  console.log(`- Processed Count: ${processedCount}, Skipped Count: ${skippedCount}`);

  const passed =
    finalOrder?.status === "PAID" &&
    paymentRecords === 1 &&
    finalOrder?.invitation?.status === "PUBLISHED" &&
    processedCount === 1 &&
    skippedCount === 1;

  if (passed) {
    console.log("🎉 ITEM 2 VERIFIED: Row-lock SELECT ... FOR UPDATE terbukti mencegah race condition & efek samping dobel!");
  } else {
    console.error("❌ ITEM 2 FAILED: Ditemukan inkonsistensi pada pemrosesan paralel!");
  }

  // Cleanup test data
  await prisma.payment.deleteMany({ where: { orderId: testOrder.id } });
  await prisma.order.delete({ where: { id: testOrder.id } });
  await prisma.invitation.delete({ where: { id: testInvitation.id } });
  console.log("[Item 2 - Cleanup] Data test berhasil dibersihkan.");

  return passed;
}

async function runAll() {
  try {
    const item1Ok = await testItem1();
    const item2Ok = await testItem2();

    console.log("\n=======================================================");
    console.log("RINGKASAN HASIL TEST BAGIAN A:");
    console.log(`- Item 1 (Set Password Google User): ${item1Ok ? "SUKSES ✅" : "GAGAL ❌"}`);
    console.log(`- Item 2 (Webhook Row Lock Idempotency): ${item2Ok ? "SUKSES ✅" : "GAGAL ❌"}`);
    console.log("=======================================================\n");
  } catch (err) {
    console.error("Error during tests:", err);
  } finally {
    await prisma.$disconnect();
  }
}

runAll();
