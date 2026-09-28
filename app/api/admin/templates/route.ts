import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan" },
        { status: 403 }
      );
    }

    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { invitations: true, assets: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("GET /api/admin/templates error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar template" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      slug,
      categoryId,
      minPackageTier,
      previewImageUrl,
      themeConfig,
      isActive = false,
      qaStatus = "PENDING_REVIEW",
    } = body;

    if (!name || !slug || !categoryId || !previewImageUrl) {
      return NextResponse.json(
        { success: false, error: "Data template tidak lengkap (nama, slug, kategori, gambar wajib)" },
        { status: 400 }
      );
    }

    // Aturan server: template baru tidak boleh aktif kecuali lolos QA RESPONSIVE_OK
    if (isActive === true && qaStatus !== "RESPONSIVE_OK") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Template baru tidak dapat diaktifkan langsung (status harus RESPONSIVE_OK terlebih dahulu)",
        },
        { status: 400 }
      );
    }

    const existing = await prisma.template.findUnique({
      where: { slug: slug.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug template sudah digunakan" },
        { status: 400 }
      );
    }

    const template = await prisma.template.create({
      data: {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        categoryId,
        minPackageTier: Number(minPackageTier) || 0,
        previewImageUrl,
        themeConfig: themeConfig || {
          primaryColor: "#C5A059",
          secondaryColor: "#8C6A28",
          accentColor: "#4C6957",
          fontFamily: "Plus Jakarta Sans",
          fontDisplay: "Cinzel",
          layout: "classic",
          sections: ["cover", "quote", "couple", "countdown", "events", "love-story", "gallery", "gift", "rsvp", "guestbook", "closing"],
        },
        isActive: Boolean(isActive),
        qaStatus: qaStatus as any,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Template baru berhasil dibuat",
        data: template,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/templates error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat template baru" },
      { status: 500 }
    );
  }
}
