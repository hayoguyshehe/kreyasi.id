import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { orders: true, invitations: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("GET /api/admin/packages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar paket" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      priceIdr,
      activeDurationDays,
      maxGalleryPhotos,
      maxGalleryVideos,
      maxGuests,
      customDomainAllowed = false,
      watermark = true,
      qrCheckinAllowed = false,
      digitalGiftAllowed = false,
      sortOrder = 0,
      isActive = true,
    } = body;

    if (!name || !slug || priceIdr === undefined || !activeDurationDays) {
      return NextResponse.json(
        { success: false, error: "Nama, slug, harga, dan durasi aktif wajib diisi" },
        { status: 400 }
      );
    }

    const existing = await prisma.package.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug paket sudah digunakan" },
        { status: 400 }
      );
    }

    const pkg = await prisma.package.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        priceIdr: Number(priceIdr),
        activeDurationDays: Number(activeDurationDays),
        maxGalleryPhotos: Number(maxGalleryPhotos) || 5,
        maxGalleryVideos: Number(maxGalleryVideos) || 1,
        maxGuests: maxGuests !== undefined && maxGuests !== null ? Number(maxGuests) : null,
        customDomainAllowed: Boolean(customDomainAllowed),
        watermark: Boolean(watermark),
        qrCheckinAllowed: Boolean(qrCheckinAllowed),
        digitalGiftAllowed: Boolean(digitalGiftAllowed),
        sortOrder: Number(sortOrder),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Paket baru berhasil ditambahkan",
        data: pkg,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/packages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menambahkan paket baru" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID paket wajib disertakan" },
        { status: 400 }
      );
    }

    const updated = await prisma.package.update({
      where: { id },
      data: {
        ...(updates.name && { name: updates.name.trim() }),
        ...(updates.slug && { slug: updates.slug.trim().toLowerCase() }),
        ...(updates.priceIdr !== undefined && { priceIdr: Number(updates.priceIdr) }),
        ...(updates.activeDurationDays !== undefined && {
          activeDurationDays: Number(updates.activeDurationDays),
        }),
        ...(updates.maxGalleryPhotos !== undefined && {
          maxGalleryPhotos: Number(updates.maxGalleryPhotos),
        }),
        ...(updates.maxGalleryVideos !== undefined && {
          maxGalleryVideos: Number(updates.maxGalleryVideos),
        }),
        ...(updates.maxGuests !== undefined && {
          maxGuests: updates.maxGuests ? Number(updates.maxGuests) : null,
        }),
        ...(updates.customDomainAllowed !== undefined && {
          customDomainAllowed: Boolean(updates.customDomainAllowed),
        }),
        ...(updates.watermark !== undefined && {
          watermark: Boolean(updates.watermark),
        }),
        ...(updates.qrCheckinAllowed !== undefined && {
          qrCheckinAllowed: Boolean(updates.qrCheckinAllowed),
        }),
        ...(updates.digitalGiftAllowed !== undefined && {
          digitalGiftAllowed: Boolean(updates.digitalGiftAllowed),
        }),
        ...(updates.sortOrder !== undefined && {
          sortOrder: Number(updates.sortOrder),
        }),
        ...(updates.isActive !== undefined && {
          isActive: Boolean(updates.isActive),
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Paket berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/packages error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui paket" },
      { status: 500 }
    );
  }
}
