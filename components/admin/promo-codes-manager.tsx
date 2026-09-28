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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2A211B] flex items-center gap-2.5">
            <Tag className="w-6 h-6 text-[#8C6A28]" />
            <span>Manajemen Kode Promo & Diskon</span>
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Buat kupon potongan harga persentase atau nominal rupiah untuk kampanye promosi Kreyasi.
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Kode Promo</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-[#EAE3D8] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D8] bg-[#FAF7F2] text-[#6B5E55] font-semibold text-xs">
                <th className="py-3 px-4">Kode Kupon</th>
                <th className="py-3 px-4">Besaran Diskon</th>
                <th className="py-3 px-4">Penggunaan</th>
                <th className="py-3 px-4">Berlaku Sampai</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D8] text-[#2A211B]">
              {promoCodes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#9C8E84]">
                    Belum ada kode promo yang dibuat.
                  </td>
                </tr>
              ) : (
                promoCodes.map((promo) => {
                  const isExpired = new Date(promo.validUntil) < new Date();

                  return (
                    <tr key={promo.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-sm">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-[#FAF7F2] border border-[#EAE3D8] text-[#8C6A28]">
                          {promo.code}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#2A211B]">
                        {promo.discountType === "PERCENT"
                          ? `${promo.discountValue}%`
                          : formatRupiah(promo.discountValue)}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5E55]">
                        {promo.usedCount}{" "}
                        {promo.maxUses !== null ? `/ ${promo.maxUses}` : "kali (unlimited)"}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5E55] whitespace-nowrap">
                        {formatDateIndonesia(promo.validUntil)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isExpired ? (
                          <Badge variant="danger" className="text-[10px] py-0.5">
                            Kedaluwarsa
                          </Badge>
                        ) : promo.isActive ? (
                          <Badge variant="sage" className="text-[10px] py-0.5">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] py-0.5 border-[#EAE3D8] text-[#6B5E55]">
                            Nonaktif
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(promo)}
                          className="text-xs border-[#EAE3D8] text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B]"
                          title={promo.isActive ? "Nonaktifkan" : "Aktifkan"}
                        >
                          <Power className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(promo)}
                          className="text-xs text-[#8C3A27] hover:text-[#8C3A27] hover:bg-[#8C3A27]/5 border-[#EAE3D8] hover:border-[#8C3A27]/30"
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
            <label className="text-[#2A211B] font-medium">Kode Kupon</label>
            <input
              type="text"
              required
              placeholder="Contoh: MERDEKA50"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] font-mono placeholder-[#9C8E84] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">Tipe Diskon</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as "PERCENT" | "FIXED")}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
              >
                <option value="PERCENT">Persentase (%)</option>
                <option value="FIXED">Nominal Tetap (Rp)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">
                {discountType === "PERCENT" ? "Persentase Diskon (%)" : "Nominal Diskon (Rp)"}
              </label>
              <input
                type="number"
                required
                placeholder={discountType === "PERCENT" ? "Contoh: 20" : "Contoh: 50000"}
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">Maksimal Pemakaian</label>
              <input
                type="number"
                placeholder="Kosongkan jika tak terbatas"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] placeholder-[#9C8E84] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">Berlaku Sampai Tanggal</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#EAE3D8]">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
              className="border-[#EAE3D8] text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B]"
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
