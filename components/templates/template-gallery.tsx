"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Eye, Smartphone, Monitor, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";

interface TemplateItem {
  id: string;
  name: string;
  slug: string;
  minPackageTier: number;
  previewImageUrl: string;
  themeConfig: any;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface TemplateGalleryProps {
  initialTemplates: TemplateItem[];
  categories: CategoryItem[];
}

export function TemplateGallery({
  initialTemplates,
  categories,
}: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<TemplateItem | null>(null);
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");

  const filteredTemplates = initialTemplates.filter((t) => {
    if (selectedCategory === "all") return true;
    return t.category.slug === selectedCategory;
  });

  const getTierName = (tier: number) => {
    switch (tier) {
      case 0:
        return "Gratis";
      case 1:
        return "Basic";
      case 2:
        return "Standar";
      case 3:
        return "Premium";
      case 4:
        return "Eksklusif";
      default:
        return "Basic";
    }
  };

  return (
    <div className="space-y-10">
      {/* Category Tabs Filter */}
      <div className="flex items-center justify-center flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory("all")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            selectedCategory === "all"
              ? "bg-[#4C6957] text-white shadow-sm shadow-[#4C6957]/25"
              : "bg-white text-[#6B5E55] hover:text-[#2A211B] border border-[#EAE3D8]"
          }`}
        >
          Semua Kategori ({initialTemplates.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-[#4C6957] text-white shadow-sm shadow-[#4C6957]/25"
                : "bg-white text-[#6B5E55] hover:text-[#2A211B] border border-[#EAE3D8]"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="paper-card rounded-2xl overflow-hidden group hover:border-[#4C6957] transition-all flex flex-col justify-between"
          >
            <div>
              {/* Preview Thumbnail Container */}
              <div className="h-60 bg-linear-to-br from-[#FAF8F5] to-[#EFE8DE] relative overflow-hidden flex items-center justify-center border-b border-[#EAE3D8]">
                <div className="absolute inset-0 bg-[#4C6957]/5 group-hover:bg-[#4C6957]/10 transition-colors" />

                {/* Decorative stationery card frame */}
                <div className="w-36 h-48 rounded-xl border border-[#DFC798] bg-white p-3 text-center flex flex-col justify-between shadow-xs group-hover:scale-105 transition-transform duration-300">
                  <div className="border border-[#DFC798]/40 rounded p-1">
                    <p className="text-[7px] text-[#8C6A28] font-serif uppercase tracking-widest">
                      {template.category.name}
                    </p>
                    <p className="text-[10px] font-bold text-[#2A211B] font-serif mt-1">
                      {template.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-[#FAF2E4] mx-auto flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    </div>
                    <p className="text-[7px] text-[#7A6E65]">Dimas & Amanda</p>
                  </div>
                  <span className="text-[6px] text-[#8E837B] block border-t border-[#EAE3D8] pt-1">
                    Kreyasi.id
                  </span>
                </div>

                {/* Tier Badge */}
                <div className="absolute top-3.5 left-3.5">
                  <Badge variant="gold">{template.category.name}</Badge>
                </div>

                {/* Quick preview overlay on hover */}
                <div className="absolute inset-0 bg-[#2A211B]/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="gap-1.5 text-xs shadow-md bg-white hover:bg-[#FAF7F2]"
                    onClick={() => setPreviewTemplate(template)}
                  >
                    <Eye className="w-3.5 h-3.5 text-[#4C6957]" />
                    <span>Live Preview</span>
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-[#2A211B] text-base group-hover:text-[#4C6957] transition-colors">
                    {template.name}
                  </h3>
                  <span className="text-[11px] font-medium text-[#4C6957] bg-[#EEF3EF] px-2.5 py-0.5 rounded-full border border-[#C6D5C7]">
                    Mulai {getTierName(template.minPackageTier)}
                  </span>
                </div>
                <p className="text-xs text-[#6B5E55] leading-relaxed">
                  Tema elegan responsif dengan animasi transisi halus, galeri foto, RSVP WhatsApp, dan amplop digital.
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-5 pt-0 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => setPreviewTemplate(template)}
              >
                Pratinjau
              </Button>
              <Link
                href={`/register?template=${template.slug}`}
                className="flex-1"
              >
                <Button variant="sage" size="sm" className="w-full text-xs gap-1.5 justify-center">
                  <span>Pilih Desain</span>
                  <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={`Preview Template: ${previewTemplate.name}`}
          description={`Kategori: ${previewTemplate.category.name} • Paket Minimum: ${getTierName(
            previewTemplate.minPackageTier
          )}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            {/* Viewport switch: Mobile or Desktop */}
            <div className="flex items-center justify-center gap-2 border-b border-slate-800 pb-4">
              <button
                type="button"
                onClick={() => setPreviewDevice("mobile")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  previewDevice === "mobile"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-4 h-4" /> Tampilan Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewDevice("desktop")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                  previewDevice === "desktop"
                    ? "bg-amber-500 text-slate-950 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Monitor className="w-4 h-4" /> Tampilan Layar Penuh
              </button>
            </div>

            {/* Mockup Frame */}
            <div className="flex justify-center bg-[#090B0E] p-4 sm:p-8 rounded-2xl border border-slate-800">
              <div
                className={`transition-all duration-300 rounded-2xl overflow-hidden border border-slate-700 bg-[#12151D] shadow-2xl p-6 text-center space-y-5 ${
                  previewDevice === "mobile" ? "w-85" : "w-full max-w-lg"
                }`}
              >
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-amber-400 font-semibold">
                    The Wedding of
                  </p>
                  <h3 className="text-2xl font-serif text-white font-bold">
                    Dimas & Amanda
                  </h3>
                  <p className="text-xs text-slate-400">
                    Sabtu, 28 November 2026 • Grand Ballroom
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <p className="italic font-serif text-amber-200">
                    &quot;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri...&quot;
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-medium">
                    ✨ Template ini mendukung: Countdown, Audio Otomatis, Galeri Foto, Google Maps & QRIS
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/register?template=${previewTemplate.slug}`}
                    onClick={() => setPreviewTemplate(null)}
                  >
                    <Button variant="gold" className="w-full gap-2 justify-center">
                      <span>Pilih Template Ini Sekarang</span>
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
