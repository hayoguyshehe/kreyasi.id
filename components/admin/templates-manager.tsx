"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Palette, Plus, Eye, Check, Power, RotateCw } from "lucide-react";

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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <Palette className="w-6 h-6 text-amber-400" />
            <span>Katalog Template Desain</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola template tema undangan digital, pratinjau desain, dan syarat tier paket minimum.
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shadow-md shadow-amber-500/20"
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
            className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] bg-slate-900 overflow-hidden">
              <img
                src={tpl.previewImageUrl}
                alt={tpl.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge variant="gold" className="text-[10px] py-0.5">
                  Tier {tpl.minPackageTier}
                </Badge>
                <Badge variant="outline" className="text-[10px] py-0.5 bg-slate-900/80">
                  {tpl.category.name}
                </Badge>
              </div>
              <div className="absolute top-3 right-3">
                {tpl.isActive ? (
                  <Badge variant="success" className="text-[10px] py-0.5">
                    Aktif
                  </Badge>
                ) : (
                  <Badge variant="danger" className="text-[10px] py-0.5">
                    Nonaktif
                  </Badge>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold font-serif text-white">{tpl.name}</h3>
                <p className="text-[11px] font-mono text-slate-400">slug: {tpl.slug}</p>
                <p className="text-xs text-slate-500 mt-1">
                  Digunakan pada {tpl._count.invitations} undangan
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <Button
                  variant={tpl.isActive ? "outline" : "gold"}
                  size="sm"
                  onClick={() => handleToggleActive(tpl)}
                  className="text-xs gap-1.5 w-full justify-center"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{tpl.isActive ? "Nonaktifkan" : "Aktifkan"}</span>
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
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Nama Template</label>
            <input
              type="text"
              required
              placeholder="Contoh: Royal Emerald Minimalist"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Slug Template</label>
            <input
              type="text"
              required
              placeholder="contoh: royal-emerald"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Kategori</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Min. Paket Tier</label>
              <select
                value={minPackageTier}
                onChange={(e) => setMinPackageTier(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
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
            <label className="text-slate-300 font-medium">URL Gambar Preview</label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={previewImageUrl}
              onChange={(e) => setPreviewImageUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
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
              <span>Simpan Template</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
