import React from "react";
import { prisma } from "@/lib/prisma";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#2A211B] tracking-tight">
          Monitoring Transaksi &amp; Pembayaran
        </h1>
        <p className="text-xs text-[#6B5E55] mt-1">
          Pantau seluruh pesanan masuk, status settlement Midtrans, dan audit trail pembayaran.
        </p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Total Pesanan</p>
          <p className="text-2xl font-bold font-serif text-[#2A211B]">{totalCount}</p>
          <p className="text-[11px] text-[#7A6D63]">sesuai filter aktif</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Total Terbayar (Lunas)</p>
          <p className="text-2xl font-bold font-serif text-[#4C6957]">
            {formatRupiah(totalPaidSum)}
          </p>
          <p className="text-[11px] text-[#4C6957]/80">pendapatan bersih tercatat</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Gateway Integrasi</p>
          <div className="flex items-center gap-1.5 text-xs text-[#8C6A28] font-medium pt-1">
            <ShieldCheck className="w-4 h-4 text-[#8C6A28]" />
            <span>Midtrans Snap &amp; Webhook Terverifikasi</span>
          </div>
        </div>
      </div>

      {/* Orders Filter & Table Card */}
      <div className="rounded-2xl bg-white border border-[#EAE3D8] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[#EAE3D8] bg-[#F5EFEB]/30 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#2A211B]">
            Daftar Pesanan ({totalCount})
          </span>
          <div className="flex items-center gap-1.5">
            <a
              href="/admin/orders"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !statusParam || statusParam === "ALL"
                  ? "bg-[#4C6957] text-white"
                  : "text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB]"
              }`}
            >
              Semua
            </a>
            <a
              href="/admin/orders?status=PAID"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusParam === "PAID"
                  ? "bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/20 font-semibold"
                  : "text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB]"
              }`}
            >
              Lunas
            </a>
            <a
              href="/admin/orders?status=PENDING"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                statusParam === "PENDING"
                  ? "bg-[#C5A059]/15 text-[#8C6A28] border border-[#C5A059]/30 font-semibold"
                  : "text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB]"
              }`}
            >
              Menunggu
            </a>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D8] bg-[#F5EFEB]/50 text-[#6B5E55] font-semibold text-xs">
                <th className="py-3 px-4">ID Pesanan Midtrans</th>
                <th className="py-3 px-4">Pelanggan</th>
                <th className="py-3 px-4">Paket &amp; Undangan</th>
                <th className="py-3 px-4">Nominal</th>
                <th className="py-3 px-4">Metode / Gateway Ref</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D8] text-[#2A211B]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A6D63]">
                    Tidak ada data transaksi yang sesuai filter.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  return (
                    <tr key={order.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-medium text-[#8C6A28]">
                        {order.midtransOrderId}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#2A211B]">{order.user.name}</p>
                        <p className="text-[11px] text-[#7A6D63] font-mono">{order.user.email}</p>
                        {order.user.phone && (
                          <p className="text-[10px] text-[#A89F91]">{order.user.phone}</p>
                        )}
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <p className="font-medium text-[#2A211B]">Paket {order.package.name}</p>
                        {order.invitation ? (
                          <a
                            href={`/u/${order.invitation.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] text-[#4C6957] hover:underline block truncate max-w-48"
                          >
                            {order.invitation.eventTitle}
                          </a>
                        ) : (
                          <span className="text-[#A89F91] text-[11px]">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2A211B] font-mono">
                        {formatRupiah(order.amountIdr)}
                      </td>
                      <td className="py-3.5 px-4">
                        {order.payment ? (
                          <div className="space-y-0.5">
                            <span className="inline-block font-medium text-[11px] text-[#2A211B]">
                              {order.payment.method}
                            </span>
                            <p className="text-[10px] font-mono text-[#7A6D63] truncate max-w-36">
                              {order.payment.gatewayRef}
                            </p>
                          </div>
                        ) : (
                          <span className="text-[#A89F91] italic text-[11px]">Belum dibayar</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {order.status === "PAID" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/20">
                            Lunas
                          </span>
                        )}
                        {order.status === "PENDING" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#C5A059]/15 text-[#8C6A28] border border-[#C5A059]/30">
                            Menunggu
                          </span>
                        )}
                        {order.status === "EXPIRED" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/20">
                            Kedaluwarsa
                          </span>
                        )}
                        {order.status === "FAILED" && (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/20">
                            Gagal
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5E55] whitespace-nowrap text-[11px]">
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
