import React from "react";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCard, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Monitoring Transaksi | Admin Kreyasi.id",
};

interface OrdersPageProps {
  searchParams: Promise<{ status?: string; search?: string }>;
}

export default async function AdminOrdersPage(props: OrdersPageProps) {
  const searchParams = await props.searchParams;
  const statusParam = searchParams?.status;
  const searchQuery = searchParams?.search;

  const where: Record<string, unknown> = {};
  if (statusParam && statusParam !== "ALL") {
    where.status = statusParam;
  }
  if (searchQuery && searchQuery.trim()) {
    const q = searchQuery.trim();
    where.OR = [
      { midtransOrderId: { contains: q, mode: "insensitive" } },
      { user: { name: { contains: q, mode: "insensitive" } } },
      { user: { email: { contains: q, mode: "insensitive" } } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      package: { select: { id: true, name: true } },
      invitation: { select: { id: true, eventTitle: true, slug: true } },
      payment: { select: { id: true, method: true, gatewayRef: true, paidAt: true, rawPayload: true } },
    },
  });

  const totalCount = orders.length;
  const totalPaidSum = orders
    .filter((o) => o.status === "PAID")
    .reduce((acc, o) => acc + o.amountIdr, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
          <CreditCard className="w-6 h-6 text-amber-400" />
          <span>Monitoring Transaksi & Pembayaran Midtrans</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Pantau seluruh pesanan masuk, status settlement, dan audit trail webhook pembayaran.
        </p>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Pesanan Ditampilkan</p>
          <p className="text-2xl font-bold font-serif text-white">{totalCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Terbayar (Lunas)</p>
          <p className="text-2xl font-bold font-serif text-emerald-400">{formatRupiah(totalPaidSum)}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Audit Trail Gateway</p>
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-medium pt-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Terkoneksi ke Model Payment</span>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-slate-300">
            Daftar Seluruh Pesanan ({totalCount})
          </span>
          <div className="flex items-center gap-2">
            <a
              href="/admin/orders"
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                !statusParam || statusParam === "ALL"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Semua
            </a>
            <a
              href="/admin/orders?status=PAID"
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusParam === "PAID"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Lunas
            </a>
            <a
              href="/admin/orders?status=PENDING"
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                statusParam === "PENDING"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Pending
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Order ID Midtrans</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Paket & Undangan</th>
                <th className="py-3.5 px-4">Nominal</th>
                <th className="py-3.5 px-4">Metode / Gateway Ref</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada data transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-amber-300">
                        {order.midtransOrderId}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-white">{order.user.name}</p>
                        <p className="text-[11px] text-slate-400">{order.user.email}</p>
                        {order.user.phone && (
                          <p className="text-[10px] text-slate-500">{order.user.phone}</p>
                        )}
                      </td>
                      <td className="py-4 px-4 space-y-0.5">
                        <p className="font-medium text-white">Paket {order.package.name}</p>
                        {order.invitation ? (
                          <a
                            href={`/u/${order.invitation.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-amber-400/90 hover:underline block truncate max-w-[200px]"
                          >
                            {order.invitation.eventTitle}
                          </a>
                        ) : (
                          <span className="text-slate-500 text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {formatRupiah(order.amountIdr)}
                      </td>
                      <td className="py-4 px-4">
                        {order.payment ? (
                          <div className="space-y-0.5">
                            <span className="inline-block font-medium text-[11px] text-slate-200">
                              {order.payment.method}
                            </span>
                            <p className="text-[10px] font-mono text-slate-500 truncate max-w-[130px]">
                              {order.payment.gatewayRef}
                            </p>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Belum dibayar</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        {order.status === "PAID" && (
                          <Badge variant="success" className="py-0.5 text-[10px]">
                            Lunas
                          </Badge>
                        )}
                        {order.status === "PENDING" && (
                          <Badge variant="warning" className="py-0.5 text-[10px]">
                            Menunggu
                          </Badge>
                        )}
                        {order.status === "EXPIRED" && (
                          <Badge variant="danger" className="py-0.5 text-[10px]">
                            Kedaluwarsa
                          </Badge>
                        )}
                        {order.status === "FAILED" && (
                          <Badge variant="danger" className="py-0.5 text-[10px]">
                            Gagal
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateIndonesia(order.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
