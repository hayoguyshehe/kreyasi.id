import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        _count: { select: { invitations: true } },
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
    const body = await request.json();
    const {
      name,
      slug,
      categoryId,
      minPackageTier,
      previewImageUrl,
      themeConfig,
      isActive = true,
    } = body;

    if (!name || !slug || !categoryId || !previewImageUrl) {
      return NextResponse.json(
        { success: false, error: "Data template tidak lengkap (nama, slug, kategori, gambar wajib)" },
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
          font: "Playfair Display",
          primaryColor: "#D4AF37",
          backgroundColor: "#0B0D11",
        },
        isActive: Boolean(isActive),
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
