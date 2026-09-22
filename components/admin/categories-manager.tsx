"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { FolderTree, Plus, Trash2, RotateCw } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  _count: { templates: number };
}

export function CategoriesManager({
  initialCategories,
}: {
  initialCategories: CategoryItem[];
}) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCategories([...categories, { ...data.data, _count: { templates: 0 } }]);
      setIsModalOpen(false);
      setName("");
      setSlug("");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal membuat kategori");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat._count.templates > 0) {
      alert("Tidak dapat menghapus kategori yang masih memiliki template aktif.");
      return;
    }

    if (!confirm(`Hapus kategori "${cat.name}"?`)) return;

    try {
      const res = await fetch(`/api/admin/categories?id=${cat.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setCategories(categories.filter((c) => c.id !== cat.id));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Gagal menghapus kategori");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-amber-400" />
            <span>Kategori Acara</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pengelompokan jenis tema dan acara (Pernikahan, Ulang Tahun, Khitanan, Event Umum).
          </p>
        </div>
        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="text-xs gap-1.5 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kategori</span>
        </Button>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-3 flex flex-col justify-between shadow-xl"
          >
            <div>
              <h3 className="text-base font-bold font-serif text-white">{cat.name}</h3>
              <p className="text-[11px] font-mono text-amber-400 mt-0.5">slug: {cat.slug}</p>
              <p className="text-xs text-slate-400 mt-2">
                {cat._count.templates} template tersedia
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(cat)}
                disabled={cat._count.templates > 0}
                className="text-xs text-red-400 hover:text-red-300 gap-1"
                title={
                  cat._count.templates > 0
                    ? "Kategori masih digunakan"
                    : "Hapus Kategori"
                }
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Tambah Kategori */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Tambah Kategori Acara Baru"
      >
        <form onSubmit={handleCreate} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Nama Kategori</label>
            <input
              type="text"
              required
              placeholder="Contoh: Wisuda & Kelulusan"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Slug Kategori</label>
            <input
              type="text"
              required
              placeholder="contoh: wisuda-kelulusan"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
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
              <span>Simpan Kategori</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
