import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get("status");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (statusParam && ["PENDING", "PAID", "FAILED", "EXPIRED", "REFUNDED"].includes(statusParam)) {
      where.status = statusParam as OrderStatus;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { midtransOrderId: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        package: { select: { id: true, name: true, slug: true } },
        invitation: { select: { id: true, eventTitle: true, slug: true } },
        payment: { select: { id: true, method: true, gatewayRef: true, paidAt: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("GET /api/admin/orders error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar transaksi" },
      { status: 500 }
    );
  }
}
