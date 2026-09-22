"use client";

import React, { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  RotateCw,
  Sparkles,
} from "lucide-react";

interface OrderItem {
  id: string;
  midtransOrderId: string;
  amountIdr: number;
  status: "PENDING" | "PAID" | "FAILED" | "EXPIRED" | "REFUNDED";
  createdAt: string;
  paidAt: string | null;
  package: {
    name: string;
    slug: string;
    activeDurationDays: number;
  };
  invitation: {
    id: string;
    eventTitle: string;
    slug: string;
    status: string;
  } | null;
  payment: {
    method: string;
    gatewayRef: string;
  } | null;
}

interface OrdersManagerProps {
  orders: OrderItem[];
  midtransClientKey?: string;
  isProduction?: boolean;
}

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: unknown) => void;
          onPending?: (result: unknown) => void;
          onError?: (result: unknown) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

export function OrdersManager({
  orders: initialOrders,
  midtransClientKey,
  isProduction = false,
}: OrdersManagerProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [payingOrderId, setPayingOrderId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const snapSrc = isProduction
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

  const totalOrders = orders.length;
  const paidOrders = orders.filter((o) => o.status === "PAID").length;
  const pendingOrders = orders.filter((o) => o.status === "PENDING").length;

  const handlePay = async (order: OrderItem) => {
    if (!order.invitation) {
      alert("Data undangan tidak ditemukan untuk pesanan ini.");
      return;
    }

    setPayingOrderId(order.id);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invitationId: order.invitation.id }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal menginisiasi pembayaran");
      }

      const { token, redirectUrl } = data.data;

      if (window.snap && token) {
        window.snap.pay(token, {
          onSuccess: () => {
            window.location.reload();
          },
          onPending: () => {
            window.location.reload();
          },
          onError: () => {
            alert("Pembayaran gagal. Silakan coba kembali.");
          },
          onClose: () => {
            setPayingOrderId(null);
          },
        });
      } else if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses pembayaran.";
      setErrorMessage(message);
    } finally {
      setPayingOrderId(null);
    }
  };

  return (
    <>
      {midtransClientKey && (
        <Script
          src={snapSrc}
          data-client-key={midtransClientKey}
          strategy="lazyOnload"
        />
      )}

      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <CreditCard className="w-6 h-6 text-amber-400" />
            <span>Riwayat Transaksi</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daftar pesanan paket dan status konfirmasi pembayaran Midtrans Snap.
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Total Pesanan</p>
            <p className="text-2xl font-bold font-serif text-white">{totalOrders}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Menunggu Pembayaran</p>
            <p className="text-2xl font-bold font-serif text-amber-400">{pendingOrders}</p>
          </div>
          <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
            <p className="text-xs text-slate-400 font-medium">Pembayaran Berhasil</p>
            <p className="text-2xl font-bold font-serif text-emerald-400">{paidOrders}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Table List */}
        <div className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl">
          {orders.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
                <CreditCard className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">Belum ada transaksi</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Transaksi akan otomatis tercatat di sini setelah Anda memilih paket berbayar untuk undangan digital Anda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                    <th className="py-3.5 px-4">No. Pesanan</th>
                    <th className="py-3.5 px-4">Paket & Undangan</th>
                    <th className="py-3.5 px-4">Nominal</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Tanggal</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {orders.map((order) => {
                    const isPending = order.status === "PENDING";
                    const isPaid = order.status === "PAID";

                    return (
                      <tr key={order.id} className="hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-4 font-mono font-medium text-amber-300">
                          {order.midtransOrderId}
                        </td>
                        <td className="py-4 px-4 space-y-0.5">
                          <p className="font-semibold text-white">
                            Paket {order.package.name}
                          </p>
                          {order.invitation ? (
                            <p className="text-slate-400 text-[11px] truncate max-w-xs">
                              {order.invitation.eventTitle}
                            </p>
                          ) : (
                            <span className="text-slate-500 italic text-[11px]">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4 font-semibold text-white">
                          {formatRupiah(order.amountIdr)}
                        </td>
                        <td className="py-4 px-4">
                          {isPaid && (
                            <Badge variant="success" className="gap-1.5 py-0.5">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Lunas</span>
                            </Badge>
                          )}
                          {isPending && (
                            <Badge variant="warning" className="gap-1.5 py-0.5">
                              <Clock className="w-3 h-3" />
                              <span>Menunggu</span>
                            </Badge>
                          )}
                          {order.status === "EXPIRED" && (
                            <Badge variant="danger" className="py-0.5">
                              Kedaluwarsa
                            </Badge>
                          )}
                          {order.status === "FAILED" && (
                            <Badge variant="danger" className="py-0.5">
                              Gagal
                            </Badge>
                          )}
                        </td>
                        <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                          {formatDateIndonesia(order.createdAt)}
                        </td>
                        <td className="py-4 px-4 text-right whitespace-nowrap">
                          {isPending && order.invitation && (
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => handlePay(order)}
                              disabled={payingOrderId === order.id}
                              className="text-xs shadow-md shadow-amber-500/20"
                            >
                              {payingOrderId === order.id ? (
                                <span className="flex items-center gap-1.5">
                                  <RotateCw className="w-3 h-3 animate-spin" />
                                  <span>Memuat...</span>
                                </span>
                              ) : (
                                <span>Bayar Sekarang</span>
                              )}
                            </Button>
                          )}

                          {isPaid && order.invitation && (
                            <Link href={`/dashboard/invitations/${order.invitation.id}`}>
                              <Button variant="outline" size="sm" className="text-xs gap-1">
                                <span>Detail</span>
                                <ExternalLink className="w-3 h-3" />
                              </Button>
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
