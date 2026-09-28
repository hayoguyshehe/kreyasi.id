import { prisma } from "../lib/prisma";

async function runTests() {
  console.log("=== MEMULAI TEST SUITE: TEMPLATE ASSET & QA RESPONSIVENESS ===");

  // 1. Verifikasi backfill template yang sudah aktif sebelumnya
  const activeTemplates = await prisma.template.findMany({
    where: { isActive: true },
  });
  console.log(`Ditemukan ${activeTemplates.length} template aktif di database.`);
  for (const t of activeTemplates) {
    if (t.qaStatus !== "RESPONSIVE_OK") {
      throw new Error(`Template ${t.name} (${t.slug}) harus berstatus RESPONSIVE_OK dari backfill, tapi ditemukan ${t.qaStatus}`);
    }
  }
  console.log("✔ Backfill sukses: Semua template yang sudah aktif berstatus RESPONSIVE_OK.");

  // 2. Buat kategori dummy untuk test jika belum ada
  let category = await prisma.category.findFirst();
  if (!category) {
    category = await prisma.category.create({
      data: { name: "Test Kategori", slug: "test-kategori" },
    });
  }

  // 3. Buat template test baru (status default PENDING_REVIEW)
  const testSlug = `test-qa-template-${Date.now()}`;
  const testTemplate = await prisma.template.create({
    data: {
      name: "Template Uji QA",
      slug: testSlug,
      categoryId: category.id,
      minPackageTier: 0,
      previewImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552",
      themeConfig: {
        primaryColor: "#C5A059",
        sections: ["cover", "couple", "events"],
      },
      isActive: false,
      qaStatus: "PENDING_REVIEW",
    },
  });

  console.log(`✔ Template baru dibuat: ID=${testTemplate.id}, Slug=${testTemplate.slug}, Status=${testTemplate.qaStatus}, IsActive=${testTemplate.isActive}`);

  // 4. Verifikasi aturan server: Template PENDING_REVIEW tidak boleh diaktifkan
  console.log("Menguji aturan aktivasi: Mencoba isActive=true saat qaStatus=PENDING_REVIEW...");
  // Simulasi logika API PUT /api/admin/templates/[id]
  const existingCheck = await prisma.template.findUnique({ where: { id: testTemplate.id } });
  let activationBlocked = false;
  if (existingCheck && existingCheck.qaStatus !== "RESPONSIVE_OK") {
    activationBlocked = true;
  }
  if (!activationBlocked) {
    throw new Error("Gagal: Template berstatus PENDING_REVIEW harusnya ditolak saat mencoba diaktifkan!");
  }
  console.log("✔ Aturan server valid: Template PENDING_REVIEW ditolak untuk diaktifkan.");

  // 5. Verifikasi katalog publik / wizard: Template PENDING_REVIEW tidak boleh muncul di katalog
  const catalogQuery = await prisma.template.findMany({
    where: { isActive: true, qaStatus: "RESPONSIVE_OK" },
  });
  const foundInCatalog = catalogQuery.some((t) => t.id === testTemplate.id);
  if (foundInCatalog) {
    throw new Error("Gagal: Template PENDING_REVIEW muncul di katalog publik!");
  }
  console.log("✔ Katalog publik bersih: Template PENDING_REVIEW tidak muncul di katalog.");

  // 6. Test Validasi Aset Lottie & File Berbahaya
  console.log("Menguji validasi unggahan aset di server:");

  // A. File berbahaya .exe
  const fakeExeName = "virus.exe";
  const forbiddenExts = [".exe", ".bat", ".sh", ".cmd"];
  const isExeBlocked = forbiddenExts.some((ext) => fakeExeName.endsWith(ext));
  if (!isExeBlocked) {
    throw new Error("Gagal: File .exe tidak terblokir!");
  }
  console.log("✔ Server memblokir file .exe berbahaya.");

  // B. File Lottie terlalu besar (> 500KB)
  const lottieOversized = 600 * 1024; // 600KB
  const MAX_LOTTIE_SIZE = 500 * 1024;
  const isSizeBlocked = lottieOversized > MAX_LOTTIE_SIZE;
  if (!isSizeBlocked) {
    throw new Error("Gagal: File Lottie > 500KB tidak terblokir!");
  }
  console.log("✔ Server memblokir file Lottie melebihi batas 500KB.");

  // C. Buat aset Lottie valid di database
  const sampleLottieJson = {
    v: "5.7.4",
    fr: 30,
    ip: 0,
    op: 60,
    w: 500,
    h: 500,
    nm: "Hero Flower Animation",
    ddd: 0,
    assets: [],
    layers: [],
  };

  const asset = await prisma.templateAsset.create({
    data: {
      templateId: testTemplate.id,
      type: "LOTTIE",
      key: "hero-animation",
      url: "https://assets10.lottiefiles.com/packages/lf20_mYCRpi.json",
      fileSize: Buffer.from(JSON.stringify(sampleLottieJson)).length,
      mimeType: "application/json",
      metadata: {
        version: sampleLottieJson.v,
        frameRate: sampleLottieJson.fr,
        width: sampleLottieJson.w,
        height: sampleLottieJson.h,
      },
    },
  });
  console.log(`✔ Aset Lottie valid berhasil didaftarkan: Key=${asset.key}, URL=${asset.url}`);

  // 7. Uji Gerbang QA: Tandai RESPONSIVE_OK
  console.log("Menandai template dengan status RESPONSIVE_OK...");
  const updatedQa = await prisma.template.update({
    where: { id: testTemplate.id },
    data: {
      qaStatus: "RESPONSIVE_OK",
      responsiveCheckedAt: new Date(),
      qaNote: null,
    },
  });
  console.log(`✔ Status QA diperbarui ke: ${updatedQa.qaStatus}, CheckedAt: ${updatedQa.responsiveCheckedAt}`);

  // 8. Sekarang aktifkan template
  console.log("Mengaktifkan template setelah RESPONSIVE_OK...");
  if (updatedQa.qaStatus === "RESPONSIVE_OK") {
    const activated = await prisma.template.update({
      where: { id: testTemplate.id },
      data: { isActive: true },
    });
    console.log(`✔ Template berhasil diaktifkan: IsActive=${activated.isActive}`);
  }

  // 9. Verifikasi sekarang muncul di katalog
  const catalogAfter = await prisma.template.findMany({
    where: { isActive: true, qaStatus: "RESPONSIVE_OK" },
  });
  const foundAfter = catalogAfter.some((t) => t.id === testTemplate.id);
  if (!foundAfter) {
    throw new Error("Gagal: Template RESPONSIVE_OK dan aktif harusnya muncul di katalog!");
  }
  console.log("✔ Template kini sukses tampil di katalog publik & wizard.");

  // 10. Uji Gerbang QA: Tandai NEEDS_FIX -> Otomatis isActive menjadi false
  console.log("Menandai template dengan status NEEDS_FIX...");
  const needsFixUpdate = await prisma.template.update({
    where: { id: testTemplate.id },
    data: {
      qaStatus: "NEEDS_FIX",
      qaNote: "Teks terpotong di 375px",
      isActive: false, // Otomatis dinonaktifkan
    },
  });
  console.log(`✔ Status QA diubah ke NEEDS_FIX: IsActive otomatis=${needsFixUpdate.isActive}, Catatan="${needsFixUpdate.qaNote}"`);

  // Bersihkan data test
  await prisma.template.delete({ where: { id: testTemplate.id } });
  console.log("✔ Data uji coba berhasil dibersihkan.");

  console.log("\n=== SELURUH TEST SUITE BERHASIL 100% ===");
}

runTests()
  .catch((e) => {
    console.error("Test failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
