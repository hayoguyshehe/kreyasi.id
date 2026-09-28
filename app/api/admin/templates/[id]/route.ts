import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const {
      name,
      slug,
      categoryId,
      minPackageTier,
      previewImageUrl,
      themeConfig,
      isActive,
      previewMobileUrl,
      previewDesktopUrl,
    } = body;

    const existing = await prisma.template.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    // Gerbang QA: isActive hanya boleh true bila qaStatus === "RESPONSIVE_OK"
    if (isActive === true && existing.qaStatus !== "RESPONSIVE_OK") {
      return NextResponse.json(
        {
          success: false,
          error:
            "Template tidak dapat diaktifkan sebelum lolos uji responsif (status harus RESPONSIVE_OK)",
        },
        { status: 400 }
      );
    }

    const updated = await prisma.template.update({
      where: { id },
      data: {
        ...(name && { name: name.trim() }),
        ...(slug && { slug: slug.trim().toLowerCase() }),
        ...(categoryId && { categoryId }),
        ...(minPackageTier !== undefined && { minPackageTier: Number(minPackageTier) }),
        ...(previewImageUrl && { previewImageUrl }),
        ...(themeConfig && { themeConfig }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(previewMobileUrl !== undefined && { previewMobileUrl }),
        ...(previewDesktopUrl !== undefined && { previewDesktopUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Template berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/admin/templates/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui template" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const invitationCount = await prisma.invitation.count({
      where: { templateId: id },
    });

    if (invitationCount > 0) {
      // Soft-deactivate if already used by user invitations
      const deactivated = await prisma.template.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Template telah dinonaktifkan karena sudah digunakan oleh undangan aktif",
        data: deactivated,
      });
    }

    await prisma.template.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Template berhasil dihapus secara permanen",
    });
  } catch (error) {
    console.error("DELETE /api/admin/templates/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus template" },
      { status: 500 }
    );
  }
}
