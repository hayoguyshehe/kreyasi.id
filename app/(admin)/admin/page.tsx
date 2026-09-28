import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  CreditCard,
  Users,
  Mail,
  TrendingUp,
  Sparkles,
  Palette,
  Tag,
  HeartHandshake,
} from "lucide-react";

export const metadata = {
  title: "Ringkasan Admin | Kreyasi.id",
};

export default async function AdminOverviewPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalRev,
    monthRev,
    totalOrders,
    paidOrders,
    totalUsers,
    totalInvitations,
    publishedInvitations,
    complimentaryInvitations,
    recentOrders,
    recentUsers,
  ] = await Promise.all([
    prisma.order.aggregate({
      where: { status: "PAID" },
      _sum: { amountIdr: true },
    }),
    prisma.order.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: startOfMonth },
      },
      _sum: { amountIdr: true },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PAID" } }),
    prisma.user.count(),
    prisma.invitation.count(),
    prisma.invitation.count({ where: { status: "PUBLISHED" } }),
    prisma.invitation.count({ where: { isComplimentary: true } }),
    prisma.order.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        package: { select: { name: true } },
      },
    }),
    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        createdAt: true,
      },
    }),
  ]);

  const totalRevenue = totalRev._sum.amountIdr || 0;
  const monthlyRevenue = monthRev._sum.amountIdr || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2A211B] tracking-tight">
            Pusat Kendali Administrator
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Ringkasan performa bisnis, aktivitas transaksi Midtrans, dan pengguna platform Kreyasi.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Link href="/admin/invitations">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-[#EAE3D8] text-[#8C6A28] hover:bg-[#F5EFEB]">
              <HeartHandshake className="w-3.5 h-3.5 text-[#8C6A28]" />
              <span>Undangan Kerjasama</span>
            </Button>
          </Link>
          <Link href="/admin/templates">
            <Button variant="outline" size="sm" className="text-xs gap-1.5 border-[#EAE3D8] text-[#2A211B] hover:bg-[#F5EFEB]">
              <Palette className="w-3.5 h-3.5 text-[#4C6957]" />
              <span>Kelola Template</span>
            </Button>
          </Link>
          <Link href="/admin/promo-codes">
            <Button variant="sage" size="sm" className="text-xs gap-1.5 shadow-sm">
              <Tag className="w-3.5 h-3.5" />
              <span>Buat Kupon</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row: Hierarchical layout instead of 4 identical SaaS-cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Primary Metric: Total Revenue (prominent) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#EAE3D8] shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <span className="text-xs font-medium text-[#6B5E55]">Total Pendapatan Terkumpul</span>
            <p className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
              {formatRupiah(totalRevenue)}
            </p>
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-between text-xs">
            <span className="text-[#6B5E55]">Pendapatan Bulan Ini</span>
            <span className="font-semibold text-[#4C6957] font-mono">
              {formatRupiah(monthlyRevenue)}
            </span>
          </div>
        </div>

        {/* Secondary Metrics: 4 calmer, compact tiles */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Pesanan Lunas */}
          <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs text-[#6B5E55] font-medium">Pesanan Lunas</span>
            <div className="mt-2">
              <p className="text-xl font-bold font-serif text-[#2A211B]">{paidOrders}</p>
              <p className="text-[11px] text-[#7A6D63] mt-0.5">dari {totalOrders} pesanan</p>
            </div>
          </div>

          {/* Total Pengguna */}
          <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs text-[#6B5E55] font-medium">Pengguna</span>
            <div className="mt-2">
              <p className="text-xl font-bold font-serif text-[#2A211B]">{totalUsers}</p>
              <p className="text-[11px] text-[#7A6D63] mt-0.5">akun terdaftar</p>
            </div>
          </div>

          {/* Undangan Aktif */}
          <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs flex flex-col justify-between">
            <span className="text-xs text-[#6B5E55] font-medium">Undangan Aktif</span>
            <div className="mt-2">
              <p className="text-xl font-bold font-serif text-[#2A211B]">{publishedInvitations}</p>
              <p className="text-[11px] text-[#7A6D63] mt-0.5">dari {totalInvitations} draft</p>
            </div>
          </div>

          {/* Kerjasama (Complimentary) */}
          <div className="p-4 rounded-xl bg-white border border-[#DFC798] shadow-xs flex flex-col justify-between bg-[#FDFBF7]">
            <span className="text-xs text-[#8C6A28] font-medium">Kerjasama</span>
            <div className="mt-2">
              <p className="text-xl font-bold font-serif text-[#8C6A28]">{complimentaryInvitations}</p>
              <p className="text-[11px] text-[#8C6A28]/80 mt-0.5">mitra gratis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#EAE3D8] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D8]">
            <div>
              <h2 className="text-base font-bold font-serif text-[#2A211B]">
                Transaksi Terbaru
              </h2>
              <p className="text-xs text-[#6B5E55]">
                Aktivitas pembayaran pelanggan terkini
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-[#4C6957] hover:underline font-medium"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#EAE3D8] text-[#6B5E55] font-semibold text-xs bg-[#F5EFEB]/50">
                  <th className="py-2.5 px-3 rounded-l-lg">ID Pesanan</th>
                  <th className="py-2.5 px-3">Pelanggan</th>
                  <th className="py-2.5 px-3">Paket</th>
                  <th className="py-2.5 px-3">Nominal</th>
                  <th className="py-2.5 px-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE3D8] text-[#2A211B]">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7A6D63] text-xs">
                      Belum ada transaksi tercatat.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3 font-mono text-[#8C6A28] text-[11px]">
                        {order.midtransOrderId}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-[#2A211B] truncate max-w-36">
                          {order.user.name}
                        </p>
                        <p className="text-[10px] text-[#7A6D63] truncate max-w-36">
                          {order.user.email}
                        </p>
                      </td>
                      <td className="py-3 px-3 text-[#6B5E55]">
                        {order.package.name}
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#2A211B] font-mono">
                        {formatRupiah(order.amountIdr)}
                      </td>
                      <td className="py-3 px-3">
                        {order.status === "PAID" && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/20">
                            Lunas
                          </span>
                        )}
                        {order.status === "PENDING" && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A059]/15 text-[#8C6A28] border border-[#C5A059]/30">
                            Menunggu
                          </span>
                        )}
                        {order.status === "EXPIRED" && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/20">
                            Kedaluwarsa
                          </span>
                        )}
                        {order.status === "FAILED" && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/20">
                            Gagal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users (1 col) */}
        <div className="rounded-2xl bg-white border border-[#EAE3D8] p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#EAE3D8]">
            <div>
              <h2 className="text-base font-bold font-serif text-[#2A211B]">
                Pengguna Baru
              </h2>
              <p className="text-xs text-[#6B5E55]">Pendaftaran akun terkini</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-[#4C6957] hover:underline font-medium"
            >
              Kelola
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8]"
              >
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-[#2A211B] truncate">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-[#7A6D63] truncate">{u.email}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                      u.role === "CUSTOMER"
                        ? "bg-[#F5EFEB] text-[#6B5E55] border border-[#EAE3D8]"
                        : "bg-[#C5A059]/15 text-[#8C6A28] border border-[#C5A059]/30"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
