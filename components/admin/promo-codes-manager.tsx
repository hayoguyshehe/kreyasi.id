"use client";

import React, { useState } from "react";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Tag, Plus, Power, Trash2, RotateCw } from "lucide-react";

interface PromoCodeItem {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  _count: { orders: number };
}

export function PromoCodesManager({
  initialPromoCodes,
}: {
  initialPromoCodes: PromoCodeItem[];
}) {
  const [promoCodes, setPromoCodes] = useState<PromoCodeItem[]>(initialPromoCodes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !discountValue || !validUntil) {
      alert("Harap lengkapi field form");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountType,
          discountValue: Number(discountValue),
          maxUses: maxUses ? Number(maxUses) : null,
          validUntil,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setPromoCodes([
        {
          ...data.data,
          validFrom: data.data.validFrom,
          validUntil: data.data.validUntil,
          _count: { orders: 0 },
        },
        ...promoCodes,
      ]);
      setIsModalOpen(false);
      setCode("");
      setDiscountValue("");
      setMaxUses("");
      setValidUntil("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membuat kode promo");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (promo: PromoCodeItem) => {
    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !promo.isActive }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setPromoCodes(
        promoCodes.map((p) =>
          p.id === promo.id ? { ...p, isActive: !p.isActive } : p
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status promo");
    }
  };

  const handleDelete = async (promo: PromoCodeItem) => {
    if (!confirm(`Hapus atau nonaktifkan kode promo ${promo.code}?`)) return;

    try {
      const res = await fetch(`/api/admin/promo-codes/${promo.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setPromoCodes(promoCodes.filter((p) => p.id !== promo.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus promo");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-amber-400" />
            <span>Manajemen Kode Promo & Diskon</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Buat kupon potongan harga persentase atau nominal rupiah untuk kampanye promosi Kreyasi.
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kode Promo</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Kode Kupon</th>
                <th className="py-3.5 px-4">Besaran Diskon</th>
                <th className="py-3.5 px-4">Penggunaan</th>
                <th className="py-3.5 px-4">Berlaku Sampai</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Belum ada kode promo yang dibuat.
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => {
                  const isExpired = new Date(promo.validUntil) < new Date();

                  return (
                    <tr key={promo.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-amber-300 text-sm">
                        {promo.code}
                      </td>
                      <td className="py-4 px-4 font-semibold text-white">
                        {promo.discountType === "PERCENT"
                          ? `${promo.discountValue}%`
                          : formatRupiah(promo.discountValue)}
                      </td>
                      <td className="py-4 px-4 text-slate-300">
                        {promo.usedCount}{" "}
                        {promo.maxUses !== null ? `/ ${promo.maxUses}` : "kali (unlimited)"}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateIndonesia(promo.validUntil)}
                      </td>
                      <td className="py-4 px-4">
                        {isExpired ? (
                          <Badge variant="danger" className="text-[10px] py-0.5">
                            Kedaluwarsa
                          </Badge>
                        ) : promo.isActive ? (
                          <Badge variant="success" className="text-[10px] py-0.5">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] py-0.5">
                            Nonaktif
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(promo)}
                          className="text-xs"
                          title={promo.isActive ? "Nonaktifkan" : "Aktifkan"}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(promo)}
                          className="text-xs"
                          title="Hapus Promo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Promo */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Kode Promo Baru"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Kode Kupon</label>
            <input
              type="text"
              required
              placeholder="Contoh: MERDEKA50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Tipe Diskon</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="PERCENT">Persentase (%)</option>
                <option value="FIXED">Nominal Tetap (Rp)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">
                {discountType === "PERCENT" ? "Persentase Diskon (%)" : "Nominal Diskon (Rp)"}
              </label>
              <input
                type="number"
                required
                placeholder={discountType === "PERCENT" ? "Contoh: 20" : "Contoh: 50000"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Maksimal Pemakaian</label>
              <input
                type="number"
                placeholder="Kosongkan jika tak terbatas"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Berlaku Sampai Tanggal</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={loading}
              className="gap-1.5"
            >
              {loading && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Kode Promo</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
