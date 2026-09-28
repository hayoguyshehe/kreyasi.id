"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Palette, Plus, Power, RotateCw } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  minPackageTier: number;
  previewImageUrl: string;
  isActive: boolean;
  category: { id: string; name: string };
  _count: { invitations: number };
}

interface TemplatesManagerProps {
  initialTemplates: TemplateItem[];
  categories: CategoryOption[];
}

export function TemplatesManager({
  initialTemplates,
  categories,
}: TemplatesManagerProps) {
  const [templates, setTemplates] = useState<TemplateItem[]>(initialTemplates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [minPackageTier, setMinPackageTier] = useState("0");
  const [previewImageUrl, setPreviewImageUrl] = useState("");

  const handleToggleActive = async (template: TemplateItem) => {
    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !template.isActive }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setTemplates((prev) =>
        prev.map((t) =>
          t.id === template.id ? { ...t, isActive: !t.isActive } : t
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal mengubah status template");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug || !categoryId || !previewImageUrl) {
      alert("Harap lengkapi semua field form.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          categoryId,
          minPackageTier: Number(minPackageTier),
          previewImageUrl,
          isActive: true,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      const cat = categories.find((c) => c.id === categoryId);
      const newTpl: TemplateItem = {
        id: data.data.id,
        name: data.data.name,
        slug: data.data.slug,
        minPackageTier: data.data.minPackageTier,
        previewImageUrl: data.data.previewImageUrl,
        isActive: data.data.isActive,
        category: { id: categoryId, name: cat ? cat.name : "Umum" },
        _count: { invitations: 0 },
      };

      setTemplates([newTpl, ...templates]);
      setIsModalOpen(false);
      setName("");
      setSlug("");
      setPreviewImageUrl("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membuat template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#2A211B] tracking-tight">
            Katalog Template Desain
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Kelola template tema undangan digital, pratinjau desain, dan syarat tier paket minimum.
          </p>
        </div>
        <Button
          variant="sage"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Template</span>
        </Button>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl bg-white border border-[#EAE3D8] overflow-hidden shadow-xs flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 bg-[#F5EFEB] overflow-hidden">
              <img
                src={tpl.previewImageUrl}
                alt={tpl.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/95 text-[#8C6A28] border border-[#DFC798] shadow-xs">
                  Tier {tpl.minPackageTier}
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/95 text-[#2A211B] border border-[#EAE3D8] shadow-xs">
                  {tpl.category.name}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                {tpl.isActive ? (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4C6957] text-white shadow-xs">
                    Aktif
                  </span>
                ) : (
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27] text-white shadow-xs">
                    Nonaktif
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold font-serif text-[#2A211B]">{tpl.name}</h3>
                <p className="text-[11px] font-mono text-[#8C6A28]">slug: {tpl.slug}</p>
                <p className="text-xs text-[#6B5E55] mt-1">
                  Digunakan pada {tpl._count.invitations} undangan
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#EAE3D8]">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(tpl)}
                  className={`text-xs gap-1.5 w-full justify-center ${
                    tpl.isActive
                      ? "text-[#8C3A27] border-[#8C3A27]/30 hover:bg-[#8C3A27]/10"
                      : "text-[#4C6957] border-[#4C6957]/30 hover:bg-[#4C6957]/10"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{tpl.isActive ? "Nonaktifkan Template" : "Aktifkan Template"}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Template */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Template Desain Baru"
        description="Daftarkan template tema baru ke dalam katalog sistem Kreyasi."
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-[#2A211B] font-medium">Nama Template</label>
            <input
              type="text"
              required
              placeholder="Contoh: Royal Emerald Minimalist"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="w-full px-3.5 py-2 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] placeholder-[#7A6D63] focus:outline-none focus:border-[#4C6957] focus:ring-1 focus:ring-[#4C6957]/20"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#2A211B] font-medium">Slug Template</label>
            <input
              type="text"
              required
              placeholder="contoh: royal-emerald"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] placeholder-[#7A6D63] focus:outline-none focus:border-[#4C6957] focus:ring-1 focus:ring-[#4C6957]/20 font-mono text-[11px]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] focus:outline-none focus:border-[#4C6957]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#2A211B] font-medium">Min. Paket Tier</label>
              <select
                value={minPackageTier}
                onChange={(e) => setMinPackageTier(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] focus:outline-none focus:border-[#4C6957]"
              >
                <option value="0">Tier 0 (Semua Paket / Gratis)</option>
                <option value="1">Tier 1 (Basic ke atas)</option>
                <option value="2">Tier 2 (Standar ke atas)</option>
                <option value="3">Tier 3 (Premium ke atas)</option>
                <option value="4">Tier 4 (Eksklusif)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#2A211B] font-medium">URL Gambar Preview</label>
            <input
              type="text"
              required
              placeholder="/templates/nama-template.jpg"
              value={previewImageUrl}
              onChange={(e) => setPreviewImageUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-white border border-[#EAE3D8] rounded-xl text-[#2A211B] placeholder-[#7A6D63] focus:outline-none focus:border-[#4C6957] focus:ring-1 focus:ring-[#4C6957]/20 font-mono text-[11px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-[#EAE3D8]">
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
              variant="sage"
              size="sm"
              disabled={loading}
              className="gap-1.5 shadow-sm"
            >
              {loading && <RotateCw className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Template</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
