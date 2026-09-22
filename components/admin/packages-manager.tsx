"use client";

import React, { useState } from "react";
import { formatRupiah } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Layers, Edit3, Check, RotateCw, Power } from "lucide-react";

interface PackageItem {
  id: string;
  name: string;
  slug: string;
  priceIdr: number;
  activeDurationDays: number;
  maxGalleryPhotos: number;
  maxGalleryVideos: number;
  maxGuests: number | null;
  customDomainAllowed: boolean;
  watermark: boolean;
  qrCheckinAllowed: boolean;
  digitalGiftAllowed: boolean;
  isActive: boolean;
  sortOrder: number;
  _count: { orders: number; invitations: number };
}

export function PackagesManager({ initialPackages }: { initialPackages: PackageItem[] }) {
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [loading, setLoading] = useState(false);

  // Edit form states
  const [priceIdr, setPriceIdr] = useState(0);
  const [activeDurationDays, setActiveDurationDays] = useState(30);
  const [maxGalleryPhotos, setMaxGalleryPhotos] = useState(5);
  const [customDomainAllowed, setCustomDomainAllowed] = useState(false);
  const [watermark, setWatermark] = useState(true);
  const [digitalGiftAllowed, setDigitalGiftAllowed] = useState(false);

  const openEditModal = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setPriceIdr(pkg.priceIdr);
    setActiveDurationDays(pkg.activeDurationDays);
    setMaxGalleryPhotos(pkg.maxGalleryPhotos);
    setCustomDomainAllowed(pkg.customDomainAllowed);
    setWatermark(pkg.watermark);
    setDigitalGiftAllowed(pkg.digitalGiftAllowed);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingPkg.id,
          priceIdr: Number(priceIdr),
          activeDurationDays: Number(activeDurationDays),
          maxGalleryPhotos: Number(maxGalleryPhotos),
          customDomainAllowed,
          watermark,
          digitalGiftAllowed,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setPackages((prev) =>
        prev.map((p) => (p.id === editingPkg.id ? { ...p, ...data.data } : p))
      );
      setEditingPkg(null);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal memperbarui paket");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (pkg: PackageItem) => {
    try {
      const res = await fetch("/api/admin/packages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: pkg.id,
          isActive: !pkg.isActive,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setPackages((prev) =>
        prev.map((p) => (p.id === pkg.id ? { ...p, isActive: !p.isActive } : p))
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status paket");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
          <Layers className="w-6 h-6 text-amber-400" />
          <span>Paket Harga & Batasan Fitur</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Sesuaikan harga jual, masa aktif undangan, dan limit fitur untuk tiap tingkatan tier paket.
        </p>
      </div>

      {/* Package Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="p-6 rounded-2xl bg-[#14171F] border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl relative"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif text-white">{pkg.name}</h3>
                  <p className="text-[11px] font-mono text-amber-400">slug: {pkg.slug}</p>
                </div>
                <Badge variant={pkg.isActive ? "success" : "danger"} className="text-[10px] py-0.5">
                  {pkg.isActive ? "Aktif" : "Nonaktif"}
                </Badge>
              </div>

              <div>
                <p className="text-2xl font-bold font-serif text-white">
                  {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                </p>
                <p className="text-xs text-slate-400">Durasi aktif: {pkg.activeDurationDays} hari</p>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-3 border-t border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Maks. Galeri Foto:</span>
                  <span className="font-semibold text-white">{pkg.maxGalleryPhotos} foto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Maks. Tamu Undangan:</span>
                  <span className="font-semibold text-white">
                    {pkg.maxGuests === null ? "Unlimited" : `${pkg.maxGuests} tamu`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Custom Domain:</span>
                  <span className="font-semibold text-white">
                    {pkg.customDomainAllowed ? "Ya" : "Tidak"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Watermark Kreyasi:</span>
                  <span className="font-semibold text-white">
                    {pkg.watermark ? "Ada" : "Bebas Watermark"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amplop Kado Digital:</span>
                  <span className="font-semibold text-white">
                    {pkg.digitalGiftAllowed ? "Tersedia" : "Tidak"}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 flex justify-between">
                <span>{pkg._count.orders} total pesanan</span>
                <span>{pkg._count.invitations} undangan</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openEditModal(pkg)}
                className="flex-1 text-xs gap-1.5 justify-center"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Paket</span>
              </Button>
              <Button
                variant={pkg.isActive ? "outline" : "gold"}
                size="sm"
                onClick={() => handleToggleActive(pkg)}
                className="text-xs px-3"
                title={pkg.isActive ? "Nonaktifkan" : "Aktifkan"}
              >
                <Power className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Edit Paket */}
      {editingPkg && (
        <Modal
          isOpen={Boolean(editingPkg)}
          onClose={() => setEditingPkg(null)}
          title={`Edit Paket ${editingPkg.name}`}
        >
          <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Harga (IDR)</label>
                <input
                  type="number"
                  required
                  value={priceIdr}
                  onChange={(e) => setPriceIdr(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Masa Aktif (Hari)</label>
                <input
                  type="number"
                  required
                  value={activeDurationDays}
                  onChange={(e) => setActiveDurationDays(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Maksimal Foto Galeri</label>
              <input
                type="number"
                required
                value={maxGalleryPhotos}
                onChange={(e) => setMaxGalleryPhotos(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={customDomainAllowed}
                  onChange={(e) => setCustomDomainAllowed(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Izinkan Custom Domain</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={watermark}
                  onChange={(e) => setWatermark(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Tampilkan Watermark Kreyasi.id</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-300">
                <input
                  type="checkbox"
                  checked={digitalGiftAllowed}
                  onChange={(e) => setDigitalGiftAllowed(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                />
                <span>Izinkan Fitur Amplop Kado Digital (QRIS/Rekening)</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditingPkg(null)}
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
                <span>Simpan Perubahan</span>
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
