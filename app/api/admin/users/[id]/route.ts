import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { isSuspended, role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hindari suspend diri sendiri jika SUPERADMIN
    if (existingUser.role === "SUPERADMIN" && isSuspended === true) {
      return NextResponse.json(
        { success: false, error: "Akun Superadmin tidak dapat disuspend" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          ...(isSuspended !== undefined && { isSuspended: Boolean(isSuspended) }),
          ...(role && { role }),
        },
      });

      // Jika disuspend, ubah secara massal semua undangan milik user tersebut menjadi SUSPENDED
      // sehingga akses ke /u/[slug] langsung menghasilkan 404 (status !== 'PUBLISHED')
      if (isSuspended === true) {
        await tx.invitation.updateMany({
          where: { userId: id },
          data: { status: "SUSPENDED" },
        });
      } else if (isSuspended === false) {
        // Jika diaktifkan kembali, pulihkan undangan yang sudah pernah dipublikasi
        await tx.invitation.updateMany({
          where: { userId: id, publishedAt: { not: null } },
          data: { status: "PUBLISHED" },
        });
        // Undangan yang belum pernah dipublikasi dipulihkan ke DRAFT
        await tx.invitation.updateMany({
          where: { userId: id, publishedAt: null },
          data: { status: "DRAFT" },
        });
      }

      return user;
    });

    return NextResponse.json({
      success: true,
      message: `Status pengguna berhasil diperbarui (${updatedUser.isSuspended ? "Disuspend" : "Aktif"})`,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isSuspended: updatedUser.isSuspended,
      },
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui data pengguna" },
      { status: 500 }
    );
  }
}
