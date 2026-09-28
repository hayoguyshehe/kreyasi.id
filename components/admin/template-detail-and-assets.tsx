"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  ArrowLeft,
  Sparkles,
  Smartphone,
  Upload,
  Trash2,
  Copy,
  Check,
  RotateCw,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Layers,
  FileWarning,
} from "lucide-react";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { LottiePlayer } from "@/components/invitation/lottie-player";

interface TemplateAsset {
  id: string;
  type: "IMAGE" | "VIDEO" | "LOTTIE" | "FONT";
  key: string;
  url: string;
  fileSize: number;
  mimeType: string;
  metadata?: any;
  createdAt: string;
}

interface TemplateDetailProps {
  template: {
    id: string;
    name: string;
    slug: string;
    minPackageTier: number;
    previewImageUrl: string;
    themeConfig: any;
    isActive: boolean;
    qaStatus: "PENDING_REVIEW" | "RESPONSIVE_OK" | "NEEDS_FIX";
    qaNote: string | null;
    responsiveCheckedAt: string | null;
    category: { id: string; name: string };
    assets: TemplateAsset[];
    _count: { invitations: number };
  };
}

export function TemplateDetailAndAssets({ template: initialTemplate }: TemplateDetailProps) {
  const [template, setTemplate] = useState(initialTemplate);
  const [assets, setAssets] = useState<TemplateAsset[]>(initialTemplate.assets || []);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadKey, setUploadKey] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!uploadKey) {
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        setUploadKey(rawName.toLowerCase().replace(/[^a-z0-9-_]+/g, "-"));
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert("Pilih file terlebih dahulu");
      return;
    }

    // Client-side guard check for Lottie size
    const isLottie = selectedFile.name.endsWith(".json") || selectedFile.name.endsWith(".lottie");
    if (isLottie && selectedFile.size > 500 * 1024) {
      const sizeKb = Math.round(selectedFile.size / 1024);
      if (
        !confirm(
          `PERINGATAN: File animasi Lottie ini berukuran ${sizeKb} KB (melebihi batas rekomendasi 500 KB). File yang terlalu besar dapat ditolak server atau memperlambat pemuatan undangan di ponsel tamu. Tetap lanjutkan?`
        )
      ) {
        return;
      }
    }

    setUploadLoading(true);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("key", uploadKey);

      const res = await fetch(`/api/admin/templates/${template.id}/assets`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Refresh list
      setAssets([data.data, ...assets.filter((a) => a.key !== data.data.key)]);
      setIsUploadModalOpen(false);
      setSelectedFile(null);
      setUploadKey("");
      setStatusMessage({
        text: `Aset "${data.data.key}" berhasil diunggah!`,
      });
    } catch (err: any) {
      alert(err.message || "Gagal mengunggah aset");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteAsset = async (asset: TemplateAsset) => {
    if (!confirm(`Hapus aset "${asset.key}" dari template ini?`)) return;

    try {
      const res = await fetch(
        `/api/admin/templates/${template.id}/assets?assetId=${asset.id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setAssets(assets.filter((a) => a.id !== asset.id));
      setStatusMessage({ text: `Aset "${asset.key}" berhasil dihapus` });
    } catch (err: any) {
      alert(err.message || "Gagal menghapus aset");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D8]">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs text-[#6B5E55]">
            <Link
              href="/admin/templates"
              className="hover:text-[#2A211B] inline-flex items-center gap-1 font-medium transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Daftar Template</span>
            </Link>
            <span>/</span>
            <span className="text-[#2A211B] font-semibold">{template.name}</span>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <h1 className="text-2xl font-serif font-bold text-[#2A211B]">{template.name}</h1>
            <Badge variant="outline" className="text-xs border-[#EAE3D8] text-[#6B5E55]">
              {template.category.name}
            </Badge>

            {/* QA Status */}
            {template.qaStatus === "RESPONSIVE_OK" ? (
              <Badge variant="sage" className="text-xs gap-1 py-0.5">
                <CheckCircle2 className="w-3 h-3" />
                <span>RESPONSIVE_OK</span>
              </Badge>
            ) : template.qaStatus === "NEEDS_FIX" ? (
              <Badge variant="danger" className="text-xs gap-1 py-0.5">
                <AlertTriangle className="w-3 h-3" />
                <span>NEEDS_FIX</span>
              </Badge>
            ) : (
              <Badge variant="gold" className="text-xs gap-1 py-0.5">
                <Sparkles className="w-3 h-3" />
                <span>PENDING_REVIEW</span>
              </Badge>
            )}

            {/* Active Status */}
            {template.isActive ? (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/20">
                Katalog Aktif
              </span>
            ) : (
              <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5EFEB] text-[#6B5E55] border border-[#EAE3D8]">
                Katalog Nonaktif
              </span>
            )}
          </div>
        </div>

        {/* Action Link to Responsive Tester */}
        <div className="flex items-center gap-2">
          <Link href={`/admin/templates/${template.id}/preview`}>
            <Button variant="gold" size="sm" className="text-xs gap-1.5 shadow-sm">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Uji Responsif 4 Device</span>
            </Button>
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
            statusMessage.isError
              ? "bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/30"
              : "bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/30"
          }`}
        >
          <span>{statusMessage.text}</span>
          <button onClick={() => setStatusMessage(null)} className="font-bold text-xs">
            ✕
          </button>
        </div>
      )}

      {/* Grid: Template Info & QA Gate Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Template Overview Card */}
        <div className="p-6 rounded-2xl bg-white border border-[#EAE3D8] shadow-sm space-y-4">
          <h2 className="text-base font-serif font-bold text-[#2A211B]">Informasi Template</h2>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-[#EAE3D8]">
              <span className="text-[#6B5E55]">Slug URL</span>
              <span className="font-mono text-[#8C6A28] font-medium">{template.slug}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE3D8]">
              <span className="text-[#6B5E55]">Minimum Tier</span>
              <span className="font-medium text-[#2A211B]">
                Tier {template.minPackageTier}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE3D8]">
              <span className="text-[#6B5E55]">Undangan Pelanggan</span>
              <span className="font-medium text-[#2A211B]">
                {template._count.invitations} undangan
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#EAE3D8]">
              <span className="text-[#6B5E55]">Total Aset Terdaftar</span>
              <span className="font-medium text-[#2A211B]">{assets.length} file</span>
            </div>
          </div>
        </div>

        {/* QA Status & Instructions */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-[#EAE3D8] shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-bold text-[#2A211B] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#4C6957]" />
                <span>Status Kesiapan &amp; QA Responsiveness</span>
              </h2>
              {template.responsiveCheckedAt && (
                <span className="text-[11px] text-[#9C8E84]">
                  Dicek: {formatDateIndonesia(template.responsiveCheckedAt)}
                </span>
              )}
            </div>
            <p className="text-xs text-[#6B5E55] mt-1 leading-relaxed">
              Sesuai PRD v1.2 Bagian 2.1, setiap template baru otomatis berstatus{" "}
              <strong>PENDING_REVIEW</strong> dan dilarang tayang di katalog/wizard sampai
              diverifikasi pada 4 preset layar: Mobile Kecil (375px), Mobile Besar (390px), Tablet (768px), dan Desktop (1280px).
            </p>

            {template.qaNote && (
              <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] text-xs space-y-1">
                <span className="font-semibold text-[#8C3A27]">Catatan QA Terakhir:</span>
                <p className="text-[#6B5E55] italic">&quot;{template.qaNote}&quot;</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#EAE3D8] flex items-center justify-between">
            <span className="text-xs text-[#6B5E55]">
              Ingin mengecek atau memperbarui status responsif?
            </span>
            <Link href={`/admin/templates/${template.id}/preview`}>
              <Button variant="outline" size="sm" className="text-xs border-[#EAE3D8] text-[#2A211B] hover:bg-[#FAF7F2]">
                Buka Layar Uji Responsif
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Asset Management Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#8C6A28]" />
              <span>Aset &amp; Animasi Lottie Template</span>
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Unggah file animasi Lottie (.json / .lottie, maks 500KB) atau elemen grafis pendukung.
              Section tema dapat merujuk aset menggunakan <code>animation.assetKey</code>.
            </p>
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsUploadModalOpen(true)}
            className="text-xs gap-1.5 shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Unggah Aset Baru</span>
          </Button>
        </div>

        {/* Asset Cards Grid */}
        {assets.length === 0 ? (
          <div className="p-12 rounded-2xl bg-white border border-[#EAE3D8] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF7F2] border border-[#EAE3D8] mx-auto flex items-center justify-center text-[#8C6A28]">
              <FileCode className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-[#2A211B]">Belum ada aset terdaftar</p>
            <p className="text-xs text-[#6B5E55] max-w-md mx-auto">
              Unggah animasi Lottie seperti <code>hero-animation</code> atau ornamen dekorasi untuk memperkaya tampilan undangan.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(true)}
              className="text-xs mt-2 border-[#EAE3D8]"
            >
              Unggah Sekarang
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assets.map((asset) => {
              const sizeKb = Math.round(asset.fileSize / 1024);
              const isOverLimit = asset.type === "LOTTIE" && asset.fileSize > 500 * 1024;

              return (
                <div
                  key={asset.id}
                  className="p-4 rounded-2xl bg-white border border-[#EAE3D8] shadow-sm flex flex-col justify-between space-y-4 hover:border-[#D5C7B5] transition-colors"
                >
                  <div className="space-y-3">
                    {/* Header Card: Type badge & Size */}
                    <div className="flex items-center justify-between">
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#FAF7F2] border border-[#EAE3D8] text-[#8C6A28]">
                        {asset.type}
                      </span>
                      <span
                        className={`text-[11px] font-mono ${
                          isOverLimit ? "text-[#8C3A27] font-bold" : "text-[#6B5E55]"
                        }`}
                      >
                        {sizeKb} KB
                      </span>
                    </div>

                    {/* Preview Box */}
                    <div className="h-36 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] flex items-center justify-center overflow-hidden relative">
                      {asset.type === "LOTTIE" ? (
                        <div className="w-28 h-28 mx-auto flex items-center justify-center">
                          <LottiePlayer src={asset.url} loop autoplay className="w-full h-full" />
                        </div>
                      ) : asset.type === "IMAGE" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={asset.url}
                          alt={asset.key}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-center text-[#9C8E84] space-y-1">
                          <FileCode className="w-8 h-8 mx-auto text-[#8C6A28]" />
                          <p className="text-[11px] font-mono">{asset.mimeType}</p>
                        </div>
                      )}
                    </div>

                    {/* Key & Copy */}
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#9C8E84] uppercase tracking-wider font-semibold">
                        Kunci Aset (Asset Key):
                      </span>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] border border-[#EAE3D8]">
                        <code className="text-xs font-mono text-[#2A211B] truncate">{asset.key}</code>
                        <button
                          onClick={() => handleCopy(asset.key)}
                          className="text-[#6B5E55] hover:text-[#2A211B] p-1 transition-colors"
                          title="Salin Kunci Aset"
                        >
                          {copiedKey === asset.key ? (
                            <Check className="w-3.5 h-3.5 text-[#4C6957]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Warning if over 500KB */}
                    {isOverLimit && (
                      <div className="p-2 rounded-lg bg-[#8C3A27]/10 border border-[#8C3A27]/20 text-[10px] text-[#8C3A27] flex items-center gap-1.5">
                        <FileWarning className="w-3.5 h-3.5 shrink-0" />
                        <span>Melebihi batas rekomendasi 500 KB</span>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#9C8E84]">
                      {formatDateIndonesia(asset.createdAt)}
                    </span>
                    <button
                      onClick={() => handleDeleteAsset(asset)}
                      className="p-1 rounded-lg text-[#8C3A27] hover:bg-[#8C3A27]/10 transition-colors"
                      title="Hapus Aset"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal Upload Aset */}
      <Modal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        title="Unggah Aset Template Baru"
        description="Unggah animasi Lottie (.json / .lottie) atau gambar dekoratif pendukung."
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
          {/* File Picker */}
          <div className="space-y-1.5">
            <label className="text-[#2A211B] font-medium">Pilih File Aset *</label>
            <input
              type="file"
              required
              accept=".json,.lottie,image/png,image/jpeg,image/webp,image/avif"
              onChange={handleFileChange}
              className="w-full px-3 py-2 bg-white border border-[#EAE3D8] rounded-xl text-xs text-[#2A211B] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-[#FAF7F2] file:text-[#8C6A28] hover:file:bg-[#F5EFEB]"
            />
            <p className="text-[10px] text-[#6B5E55]">
              Format didukung: Animasi Lottie (.json, .lottie, maks 500KB) atau Gambar (.png, .webp, .jpg, maks 5MB).
            </p>
          </div>

          {/* Asset Key */}
          <div className="space-y-1.5">
            <label className="text-[#2A211B] font-medium">
              Kunci Aset (Asset Key / Identifier) *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: hero-animation, flower-corner, divider-ornament"
              value={uploadKey}
              onChange={(e) => setUploadKey(e.target.value.toLowerCase().replace(/[^a-z0-9-_]+/g, "-"))}
              className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl font-mono text-[#2A211B] placeholder-[#9C8E84] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
            />
            <p className="text-[10px] text-[#6B5E55]">
              Kunci unik untuk dipanggil di template JSON <code>animation.assetKey</code>.
            </p>
          </div>

          <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsUploadModalOpen(false)}
              className="border-[#EAE3D8] text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B]"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={uploadLoading || !selectedFile}
              className="gap-1.5 shadow-sm"
            >
              {uploadLoading ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>Unggah Sekarang</span>
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
