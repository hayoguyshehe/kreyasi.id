/**
 * scripts/qa-screenshots.ts
 *
 * Skrip lokal berbasis Playwright untuk menghasilkan screenshot responsif template:
 * - Mobile (390×844) -> previewMobileUrl
 * - Desktop (1280×800) -> previewDesktopUrl
 *
 * Jalankan secara manual di laptop/lokal (BUKAN di runtime Vercel):
 * npx tsx scripts/qa-screenshots.ts <templateId-or-slug>
 */

import fs from "fs";
import path from "path";

async function runQaScreenshots() {
  const targetTemplate = process.argv[2];
  if (!targetTemplate) {
    console.error("Gunakan: npx tsx scripts/qa-screenshots.ts <templateId-or-slug>");
    process.exit(1);
  }

  console.log(`[QA Screenshots] Memulai capture untuk template: ${targetTemplate}`);

  try {
    // Dynamic import playwright
    const { chromium } = await import("playwright");

    const browser = await chromium.launch({ headless: true });
    const outputDir = path.join(process.cwd(), "public", "previews", targetTemplate);
    fs.mkdirSync(outputDir, { recursive: true });

    // 1. Mobile Besar (390x844)
    console.log("[QA Screenshots] Mengambil screenshot Mobile Besar (390x844)...");
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    const targetUrl = `http://localhost:3000/admin/templates/${targetTemplate}/render-preview`;

    await mobilePage.goto(targetUrl, { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(1500); // Tunggu Lottie & font render

    const mobilePath = path.join(outputDir, "mobile-390x844.png");
    await mobilePage.screenshot({ path: mobilePath, fullPage: false });
    console.log(`[QA Screenshots] Mobile screenshot tersimpan di: ${mobilePath}`);
    await mobileContext.close();

    // 2. Desktop (1280x800)
    console.log("[QA Screenshots] Mengambil screenshot Desktop (1280x800)...");
    const desktopContext = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: 2,
    });
    const desktopPage = await desktopContext.newPage();
    await desktopPage.goto(targetUrl, { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(1500);

    const desktopPath = path.join(outputDir, "desktop-1280x800.png");
    await desktopPage.screenshot({ path: desktopPath, fullPage: false });
    console.log(`[QA Screenshots] Desktop screenshot tersimpan di: ${desktopPath}`);
    await desktopContext.close();

    await browser.close();
    console.log("[QA Screenshots] Selesai dengan sukses!");
  } catch (err: any) {
    console.error("[QA Screenshots] Catatan: Playwright belum terpasang atau server belum aktif:", err.message);
    console.log("[QA Screenshots] Jalankan `npm i -D playwright` jika ingin mengotomasi pengambilan screenshot lokal.");
  }
}

runQaScreenshots();
