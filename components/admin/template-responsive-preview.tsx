"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { formatDateIndonesia } from "@/lib/utils";

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  qaStatus: "PENDING_REVIEW" | "RESPONSIVE_OK" | "NEEDS_FIX";
  qaNote: string | null;
  responsiveCheckedAt: string | null;
  isActive: boolean;
  minPackageTier: number;
  category: { id: string; name: string };
}

interface DevicePreset {
  id: "mobile-sm" | "mobile-lg" | "tablet" | "desktop";
  label: string;
  sublabel: string;
  width: number;
  height: number;
  icon: any;
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: "mobile-sm",
    label: "Mobile Kecil",
    sublabel: "375 × 667",
    width: 375,
    height: 667,
    icon: Smartphone,
  },
  {
    id: "mobile-lg",
    label: "Mobile Besar",
    sublabel: "390 × 844",
    width: 390,
    height: 844,
    icon: Smartphone,
  },
  {
    id: "tablet",
    label: "Tablet",
    sublabel: "768 × 1024",
    width: 768,
    height: 1024,
    icon: Tablet,
  },
  {
    id: "desktop",
    label: "Desktop",
    sublabel: "1280 × 800",
    width: 1280,
    height: 800,
    icon: Monitor,
  },
];

export function TemplateResponsivePreview({
  template: initialTemplate,
}: {
  template: TemplateItem;
}) {
  const [template, setTemplate] = useState<TemplateItem>(initialTemplate);
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset["id"]>("mobile-lg");
  const [orientation, setOrientation] = useState<"portrait" | "landscape">("portrait");
  const [iframeKey, setIframeKey] = useState(0);
  const [qaNote, setQaNote] = useState(template.qaNote || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; isError?: boolean } | null>(null);

  const activeDevice = DEVICE_PRESETS.find((d) => d.id === selectedDevice) || DEVICE_PRESETS[1];

  const frameWidth = orientation === "portrait" ? activeDevice.width : activeDevice.height;
  const frameHeight = orientation === "portrait" ? activeDevice.height : activeDevice.width;

  const handleUpdateQa = async (newStatus: "RESPONSIVE_OK" | "NEEDS_FIX") => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/templates/${template.id}/qa`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qaStatus: newStatus,
          qaNote: newStatus === "NEEDS_FIX" ? (qaNote || "Perlu penyesuaian layout") : qaNote,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setTemplate({
        ...template,
        qaStatus: data.data.qaStatus,
        qaNote: data.data.qaNote,
        responsiveCheckedAt: data.data.responsiveCheckedAt,
        isActive: data.data.isActive,
      });

      setMessage({
        text:
          newStatus === "RESPONSIVE_OK"
            ? "Status berhasil ditandai RESPONSIVE_OK! Template kini memenuhi syarat untuk diaktifkan di katalog."
            : "Status template diubah ke NEEDS_FIX. Template otomatis dinonaktifkan.",
      });
    } catch (err: any) {
      setMessage({
        text: err.message || "Gagal memperbarui status QA",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async () => {
    if (template.qaStatus !== "RESPONSIVE_OK" && !template.isActive) {
      alert("Template belum lolos uji responsif (status harus RESPONSIVE_OK).");
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/templates/${template.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !template.isActive,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setTemplate({
        ...template,
        isActive: data.data.isActive,
      });

      setMessage({
        text: data.data.isActive
          ? "Template berhasil diaktifkan dan kini tayang di katalog & wizard."
          : "Template berhasil dinonaktifkan dari katalog publik.",
      });
    } catch (err: any) {
      setMessage({
        text: err.message || "Gagal mengubah status aktif template",
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D8]">
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
            <Link
              href={`/admin/templates/${template.id}`}
              className="hover:text-[#2A211B] font-medium transition-colors"
            >
              Kelola Template & Aset
            </Link>
            <span>/</span>
            <span className="text-[#2A211B] font-semibold">Uji Responsif</span>
          </div>

          <div className="flex items-center gap-3 pt-1 flex-wrap">
            <h1 className="text-2xl font-serif font-bold text-[#2A211B]">
              {template.name}
            </h1>
            <Badge variant="outline" className="text-xs border-[#EAE3D8] text-[#6B5E55]">
              {template.category.name}
            </Badge>

            {/* QA Status Badge */}
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

            {/* Active Status Badge */}
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

        {/* Action Toggle Aktif / External View */}
        <div className="flex items-center gap-2">
          <a
            href={`/admin/templates/${template.id}/render-preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#EAE3D8] text-xs text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Tab Penuh</span>
          </a>

          <Button
            variant={template.isActive ? "outline" : "gold"}
            size="sm"
            onClick={handleToggleActive}
            disabled={loading || (template.qaStatus !== "RESPONSIVE_OK" && !template.isActive)}
            className="text-xs"
            title={
              template.qaStatus !== "RESPONSIVE_OK" && !template.isActive
                ? "Harus lolos RESPONSIVE_OK sebelum dapat diaktifkan"
                : ""
            }
          >
            {template.isActive ? "Nonaktifkan Template" : "Aktifkan di Katalog"}
          </Button>
        </div>
      </div>

      {/* Alert Status Message */}
      {message && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center justify-between gap-3 ${
            message.isError
              ? "bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/30"
              : "bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/30"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage(null)}
            className="font-bold text-xs hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* Controls & Device Toolbar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE3D8] shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Device Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
          {DEVICE_PRESETS.map((device) => {
            const Icon = device.icon;
            const isSelected = selectedDevice === device.id;
            return (
              <button
                key={device.id}
                onClick={() => setSelectedDevice(device.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-[#2A211B] text-white shadow-sm"
                    : "bg-[#FAF7F2] text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB] border border-[#EAE3D8]"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{device.label}</span>
                <span
                  className={`text-[10px] ${
                    isSelected ? "text-stone-300" : "text-[#9C8E84]"
                  }`}
                >
                  ({device.sublabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* Orientation & Reload Toolbar */}
        <div className="flex items-center gap-2 self-end lg:self-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setOrientation(orientation === "portrait" ? "landscape" : "portrait")
            }
            className="text-xs border-[#EAE3D8] text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B] gap-1.5"
            title="Ubah Orientasi Layar"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="capitalize">{orientation}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIframeKey((prev) => prev + 1)}
            className="text-xs border-[#EAE3D8] text-[#6B5E55] hover:bg-[#FAF7F2] hover:text-[#2A211B] gap-1.5"
            title="Muat Ulang Halaman Iframe"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </Button>
        </div>
      </div>

      {/* Main Preview Container with Responsive Device Frame */}
      <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] flex flex-col items-center justify-center min-h-[600px] overflow-auto">
        <div className="text-center pb-3 text-xs text-[#6B5E55]">
          Resolusi Aktif: <strong className="text-[#2A211B]">{frameWidth}px</strong> ×{" "}
          <strong className="text-[#2A211B]">{frameHeight}px</strong>
        </div>

        {/* Realistic Device Frame */}
        <div
          style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
          className="relative max-w-full bg-white rounded-3xl border-8 border-[#2A211B] shadow-2xl overflow-hidden transition-all duration-300 flex flex-col"
        >
          {/* Mockup Device Top Bar */}
          <div className="h-6 bg-[#2A211B] flex items-center justify-center relative shrink-0">
            <div className="w-16 h-3 bg-black/40 rounded-full" />
          </div>

          {/* Iframe Viewport */}
          <iframe
            key={iframeKey}
            src={`/admin/templates/${template.id}/render-preview`}
            title={`Preview ${template.name}`}
            className="w-full h-full border-0 bg-[#FAF7F2]"
            loading="lazy"
          />
        </div>
      </div>

      {/* Gerbang QA Panel */}
      <div className="p-6 rounded-2xl bg-white border border-[#EAE3D8] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE3D8]">
          <div>
            <h2 className="text-base font-serif font-bold text-[#2A211B] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#4C6957]" />
              <span>Gerbang Kontrol Kualitas (QA Responsiveness)</span>
            </h2>
            <p className="text-xs text-[#6B5E55] mt-0.5">
              Template hanya dapat diaktifkan ke katalog umum jika telah diverifikasi rapi di seluruh 4 ukuran layar (375px hingga 1280px).
            </p>
          </div>
          {template.responsiveCheckedAt && (
            <span className="text-[11px] text-[#9C8E84]">
              Terakhir diperiksa: {formatDateIndonesia(template.responsiveCheckedAt)}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-medium text-[#2A211B]">
            Catatan Review / Instruksi Perbaikan:
          </label>
          <textarea
            value={qaNote}
            onChange={(e) => setQaNote(e.target.value)}
            placeholder="Misal: Spasi heading cover terlalu rapat di 375px; tombol RSVP berhimpitan di tablet..."
            rows={2}
            className="w-full px-3.5 py-2.5 bg-white border border-[#EAE3D8] rounded-xl text-xs text-[#2A211B] placeholder-[#9C8E84] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/20 focus:border-[#4C6957]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleUpdateQa("NEEDS_FIX")}
            disabled={loading}
            className="text-xs text-[#8C3A27] hover:text-[#8C3A27] hover:bg-[#8C3A27]/5 border-[#EAE3D8] hover:border-[#8C3A27]/30 gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Perlu Diperbaiki (NEEDS_FIX)</span>
          </Button>

          <Button
            variant="gold"
            size="sm"
            onClick={() => handleUpdateQa("RESPONSIVE_OK")}
            disabled={loading}
            className="text-xs gap-1.5 shadow-sm"
          >
            {loading ? (
              <RotateCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5" />
            )}
            <span>Tandai RESPONSIVE_OK</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
