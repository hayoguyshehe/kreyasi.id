import { UserRole, EventCategory } from "../generated/prisma";
import { hash } from "bcryptjs";
import { prisma } from "../lib/prisma";

async function main() {
  console.log("🌱 Seeding database...");

  // ============================================
  // 1. SEED ADMIN USER
  // ============================================
  const adminPassword = await hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@kreyasi.id" },
    update: {},
    create: {
      email: "admin@kreyasi.id",
      name: "Admin Kreyasi",
      passwordHash: adminPassword,
      role: UserRole.SUPERADMIN,
    },
  });
  console.log(`  ✅ Admin user: ${admin.email}`);

  // ============================================
  // 2. SEED PACKAGES (5 tier harga)
  // ============================================
  const packages = [
    {
      name: "Gratis",
      slug: "gratis",
      priceIdr: 0,
      activeDurationDays: 3,
      maxGalleryPhotos: 3,
      maxGalleryVideos: 0,
      maxGuests: 20,
      customDomainAllowed: false,
      watermark: true,
      qrCheckinAllowed: false,
      digitalGiftAllowed: false,
      sortOrder: 0,
    },
    {
      name: "Basic",
      slug: "basic",
      priceIdr: 35000,
      activeDurationDays: 30,
      maxGalleryPhotos: 10,
      maxGalleryVideos: 0,
      maxGuests: null,
      customDomainAllowed: false,
      watermark: false,
      qrCheckinAllowed: false,
      digitalGiftAllowed: false,
      sortOrder: 1,
    },
    {
      name: "Standar",
      slug: "standar",
      priceIdr: 59000,
      activeDurationDays: 90,
      maxGalleryPhotos: 20,
      maxGalleryVideos: 1,
      maxGuests: null,
      customDomainAllowed: false,
      watermark: false,
      qrCheckinAllowed: false,
      digitalGiftAllowed: true,
      sortOrder: 2,
    },
    {
      name: "Premium",
      slug: "premium",
      priceIdr: 99000,
      activeDurationDays: 365,
      maxGalleryPhotos: 999, // unlimited
      maxGalleryVideos: 999,
      maxGuests: null,
      customDomainAllowed: false,
      watermark: false,
      qrCheckinAllowed: true,
      digitalGiftAllowed: true,
      sortOrder: 3,
    },
    {
      name: "Eksklusif + Domain",
      slug: "eksklusif",
      priceIdr: 149000,
      activeDurationDays: 365,
      maxGalleryPhotos: 999,
      maxGalleryVideos: 999,
      maxGuests: null,
      customDomainAllowed: true,
      watermark: false,
      qrCheckinAllowed: true,
      digitalGiftAllowed: true,
      sortOrder: 4,
    },
  ];

  for (const pkg of packages) {
    await prisma.package.upsert({
      where: { slug: pkg.slug },
      update: pkg,
      create: pkg,
    });
  }
  console.log(`  ✅ ${packages.length} paket harga di-seed`);

  // ============================================
  // 3. SEED CATEGORIES (4 kategori acara)
  // ============================================
  const categories = [
    { name: "Pernikahan", slug: "pernikahan" },
    { name: "Ulang Tahun", slug: "ulang-tahun" },
    { name: "Khitanan & Aqiqah", slug: "khitanan-aqiqah" },
    { name: "Event Umum", slug: "event-umum" },
  ];

  const categoryRecords: Record<string, string> = {};
  for (const cat of categories) {
    const record = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    categoryRecords[cat.slug] = record.id;
  }
  console.log(`  ✅ ${categories.length} kategori acara di-seed`);

  // ============================================
  // 4. SEED TEMPLATES (2-3 per kategori Pernikahan)
  // ============================================
  const templates = [
    {
      name: "Sakura Elegance",
      slug: "sakura-elegance",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 0, // Tersedia dari tier Gratis
      previewImageUrl: "/templates/sakura-elegance.jpg",
      themeConfig: {
        primaryColor: "#D4A373",
        secondaryColor: "#FEFAE0",
        accentColor: "#E9EDC9",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Playfair Display",
        layout: "classic",
        sections: [
          "cover",
          "couple",
          "countdown",
          "events",
          "gallery",
          "rsvp",
          "guestbook",
          "gift",
          "footer",
        ],
      },
    },
    {
      name: "Rose Garden",
      slug: "rose-garden",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 1, // Minimal paket Basic
      previewImageUrl: "/templates/rose-garden.jpg",
      themeConfig: {
        primaryColor: "#BC6C57",
        secondaryColor: "#FFF5F1",
        accentColor: "#F2D7CE",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Cormorant Garamond",
        layout: "modern",
        sections: [
          "cover",
          "couple",
          "love-story",
          "countdown",
          "events",
          "gallery",
          "rsvp",
          "guestbook",
          "gift",
          "footer",
        ],
      },
    },
    {
      name: "Midnight Gold",
      slug: "midnight-gold",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 2, // Minimal paket Standar
      previewImageUrl: "/templates/midnight-gold.jpg",
      themeConfig: {
        primaryColor: "#C9A84C",
        secondaryColor: "#1A1A2E",
        accentColor: "#16213E",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Cinzel",
        layout: "luxury",
        sections: [
          "cover",
          "couple",
          "love-story",
          "countdown",
          "events",
          "gallery",
          "video",
          "rsvp",
          "guestbook",
          "gift",
          "closing",
        ],
      },
    },
    {
      name: "Undangan Lengkap",
      slug: "undangan-lengkap",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 0, // Tersedia dari tier Gratis
      previewImageUrl: "/templates/undangan-lengkap.jpg",
      themeConfig: {
        primaryColor: "#C5A059",
        secondaryColor: "#FAF7F2",
        accentColor: "#4C6957",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Playfair Display",
        layout: "classic-full",
        description: "Tema klasik lengkap dengan fitur paripurna: hitung mundur, audio otomatis, galeri foto, amplop digital, dan buku tamu interaktif.",
        sections: [
          "cover",
          "quote",
          "couple",
          "countdown",
          "events",
          "gallery",
          "gift",
          "rsvp",
          "guestbook",
          "closing",
        ],
      },
    },
    {
      name: "Modern Minimalist",
      slug: "modern-minimalist",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 0, // Tersedia dari tier Gratis
      previewImageUrl: "/templates/modern-minimalist.jpg",
      themeConfig: {
        primaryColor: "#18181B",
        secondaryColor: "#FAFAFA",
        accentColor: "#2563EB",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Plus Jakarta Sans",
        layout: "minimal",
        description: "Tipografi editorial kontemporer dengan whitespace lega, garis bersih monokromatik, dan aksen modern tanpa ornamen floral.",
        sections: [
          { id: "cover", animation: { assetKey: "minimalist-pulse", position: "top", loop: true, speed: 1 } },
          { id: "quote" },
          { id: "couple" },
          { id: "countdown", animation: { assetKey: "minimalist-pulse", position: "bottom", loop: true, speed: 0.8 } },
          { id: "events" },
          { id: "love-story" },
          { id: "gallery" },
          { id: "gift" },
          { id: "rsvp" },
          { id: "guestbook" },
          { id: "closing" },
        ],
      },
    },
    {
      name: "Adat Nusantara",
      slug: "adat-nusantara",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 1, // Minimal paket Basic
      previewImageUrl: "/templates/adat-nusantara.jpg",
      themeConfig: {
        primaryColor: "#8D4925",
        secondaryColor: "#FAF6F0",
        accentColor: "#B86F36",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Cinzel",
        layout: "nusantara",
        description: "Nuansa adat Indonesia yang megah dengan sentuhan motif songket & batik geometris, berbalut palet warna tanah terracotta hangat.",
        sections: [
          { id: "cover", animation: { assetKey: "nusantara-mandala", position: "top", loop: true, speed: 0.5 } },
          { id: "quote" },
          { id: "couple" },
          { id: "countdown" },
          { id: "events" },
          { id: "love-story" },
          { id: "gallery" },
          { id: "gift" },
          { id: "rsvp" },
          { id: "guestbook" },
          { id: "closing" },
        ],
      },
    },
    {
      name: "Botanical Rustic",
      slug: "botanical-rustic",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 1, // Minimal paket Basic
      previewImageUrl: "/templates/botanical-rustic.jpg",
      themeConfig: {
        primaryColor: "#4C6957",
        secondaryColor: "#F5F2EB",
        accentColor: "#3B5343",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Cormorant Garamond",
        layout: "rustic",
        description: "Sentuhan dedaunan eucalyptus organik, tekstur kertas kraft alami, dan palet warna hijau-sage yang teduh untuk pesta kebun.",
        sections: [
          { id: "cover", animation: { assetKey: "botanical-leaves", position: "top", loop: true, speed: 0.8 } },
          { id: "quote" },
          { id: "couple" },
          { id: "countdown" },
          { id: "events" },
          { id: "love-story" },
          { id: "gallery" },
          { id: "gift" },
          { id: "rsvp" },
          { id: "guestbook" },
          { id: "closing" },
        ],
      },
    },
    {
      name: "Geometris Islami",
      slug: "geometris-islami",
      categoryId: categoryRecords["pernikahan"],
      minPackageTier: 2, // Minimal paket Standar
      previewImageUrl: "/templates/geometris-islami.jpg",
      themeConfig: {
        primaryColor: "#0F4C3A",
        secondaryColor: "#F8F9F6",
        accentColor: "#C5A059",
        fontFamily: "Plus Jakarta Sans",
        fontDisplay: "Playfair Display",
        layout: "islamic",
        description: "Pola simetris geometris arabesque islami, bingkai mihrab, dan tipografi kaligrafi suci nan anggun untuk akad dan walimah.",
        sections: [
          { id: "cover", animation: { assetKey: "islamic-star", position: "top", loop: true, speed: 0.6 } },
          { id: "quote" },
          { id: "couple" },
          { id: "countdown" },
          { id: "events" },
          { id: "love-story" },
          { id: "gallery" },
          { id: "gift" },
          { id: "rsvp" },
          { id: "guestbook" },
          { id: "closing" },
        ],
      },
    },
  ];

  for (const tmpl of templates) {
    await prisma.template.upsert({
      where: { slug: tmpl.slug },
      update: tmpl,
      create: tmpl,
    });
  }
  console.log(`  ✅ ${templates.length} template di-seed`);

  console.log("\n🎉 Seeding selesai!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed error:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
