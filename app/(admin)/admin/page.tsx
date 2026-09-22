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
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Palette,
  Tag,
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
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <span>Pusat Kendali Administrator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Ringkasan performa bisnis, aktivitas transaksi Midtrans, dan pengguna platform Kreyasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/templates">
            <Button variant="outline" size="sm" className="text-xs gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              <span>Kelola Template</span>
            </Button>
          </Link>
          <Link href="/admin/promo-codes">
            <Button variant="gold" size="sm" className="text-xs gap-1.5 shadow-md shadow-amber-500/20">
              <Tag className="w-3.5 h-3.5" />
              <span>Buat Kupon</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Pendapatan</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-white">
            {formatRupiah(totalRevenue)}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90">
            <TrendingUp className="w-3 h-3" />
            <span>Bulan ini: {formatRupiah(monthlyRevenue)}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pesanan Lunas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-white">{paidOrders}</p>
          <p className="text-[11px] text-slate-500">
            Dari total {totalOrders} pesanan tercatat
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Total Pengguna</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-white">{totalUsers}</p>
          <p className="text-[11px] text-slate-500">Akun terdaftar di sistem</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Undangan Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold font-serif text-white">{publishedInvitations}</p>
          <p className="text-[11px] text-slate-500">
            Dari {totalInvitations} total draft/undangan
          </p>
        </div>
      </div>

      {/* Two Columns: Recent Orders & Recent Users */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Orders (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-[#14171F] border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-white">
                Transaksi Terbaru
              </h2>
              <p className="text-xs text-slate-400">
                Aktivitas pembayaran pelanggan terkini
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800/80 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                  <th className="pb-3 px-2">Order ID</th>
                  <th className="pb-3 px-2">Pelanggan</th>
                  <th className="pb-3 px-2">Paket</th>
                  <th className="pb-3 px-2">Nominal</th>
                  <th className="pb-3 px-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="py-3 px-2 font-mono text-amber-300 text-[11px]">
                      {order.midtransOrderId}
                    </td>
                    <td className="py-3 px-2">
                      <p className="font-semibold text-white truncate max-w-[120px]">
                        {order.user.name}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {order.user.email}
                      </p>
                    </td>
                    <td className="py-3 px-2 text-slate-300">
                      {order.package.name}
                    </td>
                    <td className="py-3 px-2 font-semibold text-white">
                      {formatRupiah(order.amountIdr)}
                    </td>
                    <td className="py-3 px-2">
                      {order.status === "PAID" && (
                        <Badge variant="success" className="py-0 text-[10px]">
                          Lunas
                        </Badge>
                      )}
                      {order.status === "PENDING" && (
                        <Badge variant="warning" className="py-0 text-[10px]">
                          Pending
                        </Badge>
                      )}
                      {order.status === "EXPIRED" && (
                        <Badge variant="danger" className="py-0 text-[10px]">
                          Kedaluwarsa
                        </Badge>
                      )}
                      {order.status === "FAILED" && (
                        <Badge variant="danger" className="py-0 text-[10px]">
                          Gagal
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users (1 col) */}
        <div className="rounded-2xl bg-[#14171F] border border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold font-serif text-white">
                Pengguna Baru
              </h2>
              <p className="text-xs text-slate-400">Pendaftaran akun terkini</p>
            </div>
            <Link
              href="/admin/users"
              className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
            >
              <span>Kelola</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80"
              >
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">
                    {u.name}
                  </p>
                  <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                  <Badge variant={u.role === "CUSTOMER" ? "outline" : "gold"} className="text-[9px] py-0">
                    {u.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
