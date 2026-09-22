import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      revenueAggregate,
      monthlyRevenueAggregate,
      totalOrders,
      paidOrdersCount,
      pendingOrdersCount,
      totalUsers,
      totalInvitations,
      publishedInvitations,
      recentOrders,
      recentUsers,
    ] = await Promise.all([
      // Total Pendapatan Seluruh Waktu
      prisma.order.aggregate({
        where: { status: "PAID" },
        _sum: { amountIdr: true },
      }),
      // Pendapatan Bulan Ini
      prisma.order.aggregate({
        where: {
          status: "PAID",
          paidAt: { gte: startOfMonth },
        },
        _sum: { amountIdr: true },
      }),
      // Total Pesanan
      prisma.order.count(),
      // Pesanan Lunas
      prisma.order.count({ where: { status: "PAID" } }),
      // Pesanan Menunggu
      prisma.order.count({ where: { status: "PENDING" } }),
      // Total Pengguna
      prisma.user.count(),
      // Total Undangan
      prisma.invitation.count(),
      // Undangan Aktif/Published
      prisma.invitation.count({ where: { status: "PUBLISHED" } }),
      // 5 Pesanan Terakhir
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          package: { select: { name: true } },
        },
      }),
      // 5 Pengguna Baru
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue: revenueAggregate._sum.amountIdr || 0,
        monthlyRevenue: monthlyRevenueAggregate._sum.amountIdr || 0,
        totalOrders,
        paidOrdersCount,
        pendingOrdersCount,
        totalUsers,
        totalInvitations,
        publishedInvitations,
        recentOrders,
        recentUsers,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/dashboard/stats error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data statistik admin" },
      { status: 500 }
    );
  }
}
