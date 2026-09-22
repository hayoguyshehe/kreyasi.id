import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { templates: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("GET /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil kategori" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Nama dan slug kategori wajib diisi" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    const existing = await prisma.category.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Slug kategori sudah digunakan" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug: cleanSlug,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kategori baru berhasil dibuat",
        data: category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kategori" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, slug } = body;

    if (!id || !name || !slug) {
      return NextResponse.json(
        { success: false, error: "ID, nama, dan slug kategori wajib disertakan" },
        { status: 400 }
      );
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: name.trim(),
        slug: cleanSlug,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kategori" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID kategori wajib disertakan" },
        { status: 400 }
      );
    }

    const templateCount = await prisma.template.count({
      where: { categoryId: id },
    });

    if (templateCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Tidak dapat menghapus kategori yang masih memiliki template terkait",
        },
        { status: 400 }
      );
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Kategori berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/admin/categories error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kategori" },
      { status: 500 }
    );
  }
}
