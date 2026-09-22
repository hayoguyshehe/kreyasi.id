import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { isActive, discountValue, maxUses, validUntil } = body;

    const existing = await prisma.promoCode.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Kode promo tidak ditemukan" },
        { status: 404 }
      );
    }

    const updated = await prisma.promoCode.update({
      where: { id },
      data: {
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(discountValue !== undefined && { discountValue: Number(discountValue) }),
        ...(maxUses !== undefined && {
          maxUses: maxUses ? Number(maxUses) : null,
        }),
        ...(validUntil && { validUntil: new Date(validUntil) }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Kode promo berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/promo-codes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui kode promo" },
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

    const orderCount = await prisma.order.count({
      where: { promoCodeId: id },
    });

    if (orderCount > 0) {
      // Nonaktifkan jika sudah pernah dipakai pada transaksi
      const deactivated = await prisma.promoCode.update({
        where: { id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Kode promo telah dinonaktifkan karena telah digunakan pada riwayat pesanan",
        data: deactivated,
      });
    }

    await prisma.promoCode.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Kode promo berhasil dihapus secara permanen",
    });
  } catch (error) {
    console.error("DELETE /api/admin/promo-codes/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus kode promo" },
      { status: 500 }
    );
  }
}
