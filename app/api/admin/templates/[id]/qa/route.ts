import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya admin yang diizinkan melakukan QA" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { qaStatus, qaNote } = body;

    const validStatuses = ["RESPONSIVE_OK", "NEEDS_FIX", "PENDING_REVIEW"];
    if (!qaStatus || !validStatuses.includes(qaStatus)) {
      return NextResponse.json(
        { success: false, error: "Status QA tidak valid. Pilihan: RESPONSIVE_OK, NEEDS_FIX, PENDING_REVIEW" },
        { status: 400 }
      );
    }

    const existing = await prisma.template.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika status bukan RESPONSIVE_OK, template tidak boleh aktif (isActive = false)
    const shouldDeactivate = qaStatus !== "RESPONSIVE_OK" && existing.isActive;

    const updated = await prisma.template.update({
      where: { id },
      data: {
        qaStatus: qaStatus as any,
        qaNote: qaStatus === "RESPONSIVE_OK" ? (qaNote || null) : (qaNote || "Perlu perbaikan responsif"),
        ...(qaStatus === "RESPONSIVE_OK" && { responsiveCheckedAt: new Date() }),
        ...(shouldDeactivate && { isActive: false }),
      },
      include: {
        category: true,
        assets: true,
      },
    });

    return NextResponse.json({
      success: true,
      message:
        qaStatus === "RESPONSIVE_OK"
          ? "Template berhasil ditandai RESPONSIVE_OK dan siap diaktifkan"
          : "Status QA template diperbarui ke " + qaStatus,
      data: updated,
    });
  } catch (error) {
    console.error("POST /api/admin/templates/[id]/qa error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status QA template" },
      { status: 500 }
    );
  }
}
