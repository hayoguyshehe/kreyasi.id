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
        {filteredTemplates.map((template) => {
          const layout = template.themeConfig?.layout || "classic";
          const isMinimal = layout === "minimal" || template.slug === "modern-minimalist";
          const isNusantara = layout === "nusantara" || template.slug === "adat-nusantara";
          const isRustic = layout === "rustic" || template.slug === "botanical-rustic";
          const isIslamic = layout === "islamic" || template.slug === "geometris-islami";
          const isMidnight = template.slug === "midnight-gold" || layout === "luxury";
          const isRose = template.slug === "rose-garden" || layout === "modern";

          // Dynamic Thumbnail Container Background
          const thumbBg = isMinimal
            ? "from-[#F4F4F5] to-[#E4E4E7]"
            : isNusantara
            ? "from-[#F5E8D8] to-[#E8D4BE]"
            : isRustic
            ? "from-[#EAEFEA] to-[#DDE5DC]"
            : isIslamic
            ? "from-[#E3EDE7] to-[#D0DFD6]"
            : isMidnight
            ? "from-[#12131C] to-[#1E2030]"
            : isRose
            ? "from-[#FFF0EC] to-[#FCE2DC]"
            : "from-[#FAF8F5] to-[#EFE8DE]";

          // Dynamic Card Style
          const cardFrame = isMinimal
            ? "border-2 border-neutral-900 bg-white rounded-lg shadow-md"
            : isNusantara
            ? "border-2 border-[#B86F36] bg-[#FFFDF9] rounded-xl shadow-md shadow-[#B86F36]/15"
            : isRustic
            ? "border-2 border-[#4C6957]/40 bg-[#FAF8F3] rounded-2xl shadow-md shadow-[#4C6957]/10"
            : isIslamic
            ? "border-2 border-[#0F4C3A] bg-white rounded-xl shadow-md shadow-[#0F4C3A]/15"
            : isMidnight
            ? "border border-[#C9A84C]/60 bg-[#161726] rounded-xl text-white shadow-xl shadow-black/40"
            : isRose
            ? "border border-[#BC6C57]/40 bg-[#FFFBF9] rounded-xl shadow-md shadow-[#BC6C57]/10"
            : "border border-[#DFC798] bg-white rounded-xl shadow-xs";

          // Dynamic Description
          const descriptionText =
            template.themeConfig?.description ||
            (isMinimal
              ? "Tipografi editorial kontemporer dengan whitespace lega, garis bersih monokromatik, dan aksen modern tanpa ornamen floral."
              : isNusantara
              ? "Nuansa adat Indonesia yang megah dengan sentuhan motif songket & batik geometris, berbalut palet warna tanah terracotta hangat."
              : isRustic
              ? "Sentuhan dedaunan eucalyptus organik, tekstur kertas kraft alami, dan palet warna hijau-sage yang teduh untuk pesta kebun."
              : isIslamic
              ? "Pola simetris geometris arabesque islami, bingkai mihrab, dan tipografi kaligrafi suci nan anggun untuk akad dan walimah."
              : isMidnight
              ? "Kemewahan malam berbintang dengan palet hitam-navy malam dan aksen emas metalik bercahaya."
              : isRose
              ? "Romantisme kebun mawar dengan palet warna terakota lembut dan tipografi elegan berkelas."
              : "Tema elegan responsif dengan animasi transisi halus, galeri foto, RSVP WhatsApp, dan amplop digital.");

          return (
            <div
              key={template.id}
              className="paper-card rounded-2xl overflow-hidden group hover:border-[#4C6957] transition-all flex flex-col justify-between"
            >
              <div>
                {/* Preview Thumbnail Container */}
                <div className={`h-60 bg-linear-to-br ${thumbBg} relative overflow-hidden flex items-center justify-center border-b border-[#EAE3D8]`}>
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors" />

                  {/* Decorative stationery card frame */}
                  <div className={`w-36 h-48 p-3 text-center flex flex-col justify-between group-hover:scale-105 transition-transform duration-300 ${cardFrame}`}>
                    <div className={`border rounded p-1 ${
                      isMinimal
                        ? "border-neutral-200 bg-neutral-50"
                        : isNusantara
                        ? "border-[#B86F36]/30 bg-[#F5E8D8]/50"
                        : isRustic
                        ? "border-[#4C6957]/20 bg-[#EBF1EC]/60"
                        : isIslamic
                        ? "border-[#0F4C3A]/20 bg-[#E6F0EB]/50"
                        : isMidnight
                        ? "border-[#C9A84C]/30 bg-[#1A1A2E]"
                        : "border-[#DFC798]/40"
                    }`}>
                      <p className={`text-[7px] uppercase tracking-widest ${
                        isMinimal
                          ? "text-[#2563EB] font-sans font-bold"
                          : isNusantara
                          ? "text-[#8D4925] font-serif font-bold"
                          : isRustic
                          ? "text-[#4C6957] font-serif italic"
                          : isIslamic
                          ? "text-[#0F4C3A] font-serif font-bold"
                          : isMidnight
                          ? "text-[#C9A84C] font-serif"
                          : "text-[#8C6A28] font-serif"
                      }`}>
                        {template.category.name}
                      </p>
                      <p className={`text-[10px] font-bold mt-1 truncate ${
                        isMinimal
                          ? "text-neutral-900 font-sans tracking-tight"
                          : isMidnight
                          ? "text-[#E2C366] font-serif"
                          : isNusantara
                          ? "text-[#2C1D11] font-serif"
                          : isRustic
                          ? "text-[#1F2C20] font-serif italic"
                          : isIslamic
                          ? "text-[#0B1E15] font-serif"
                          : "text-[#2A211B] font-serif"
                      }`}>
                        {template.name}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                        isMinimal
                          ? "bg-neutral-100 border border-neutral-300 text-neutral-800"
                          : isNusantara
                          ? "bg-[#F5E8D8] border border-[#B86F36]/40 text-[#8D4925]"
                          : isRustic
                          ? "bg-[#EBF1EC] border border-[#4C6957]/30 text-[#3B5343]"
                          : isIslamic
                          ? "bg-[#E6F0EB] border border-[#0F4C3A]/30 text-[#0F4C3A]"
                          : isMidnight
                          ? "bg-[#1A1A2E] border border-[#C9A84C]/40 text-[#C9A84C]"
                          : "bg-[#FAF2E4]"
                      }`}>
                        {isMinimal ? (
                          <div className="w-2.5 h-2.5 bg-[#2563EB] rotate-45" />
                        ) : isNusantara ? (
                          <span className="text-xs font-serif font-bold">✦</span>
                        ) : isRustic ? (
                          <span className="text-xs font-serif">❦</span>
                        ) : isIslamic ? (
                          <span className="text-xs font-serif font-bold">۞</span>
                        ) : isMidnight ? (
                          <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                        ) : (
                          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                        )}
                      </div>
                      <p className={`text-[7px] truncate ${
                        isMinimal
                          ? "text-neutral-600 font-sans uppercase tracking-wider"
                          : isMidnight
                          ? "text-stone-300 font-serif"
                          : "text-[#7A6E65]"
                      }`}>
                        Dimas & Amanda
                      </p>
                    </div>

                    <span className={`text-[6px] block border-t pt-1 ${
                      isMidnight ? "border-stone-800 text-stone-400" : "border-[#EAE3D8] text-[#8E837B]"
                    }`}>
                      Kreyasi.id
                    </span>
                  </div>

                  {/* Tier Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <Badge variant={isMidnight ? "gold" : isMinimal ? "default" : isRustic || isIslamic ? "sage" : "gold"}>
                      {template.category.name}
                    </Badge>
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
                  <p className="text-xs text-[#6B5E55] leading-relaxed line-clamp-2">
                    {descriptionText}
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
          );
        })}
      </div>

      {/* Live Preview Modal */}
      {previewTemplate && (() => {
        const layout = previewTemplate.themeConfig?.layout || "classic";
        const isMinimal = layout === "minimal" || previewTemplate.slug === "modern-minimalist";
        const isNusantara = layout === "nusantara" || previewTemplate.slug === "adat-nusantara";
        const isRustic = layout === "rustic" || previewTemplate.slug === "botanical-rustic";
        const isIslamic = layout === "islamic" || previewTemplate.slug === "geometris-islami";
        const isMidnight = previewTemplate.slug === "midnight-gold" || layout === "luxury";

        const modalMockupFrame = isMinimal
          ? "border-2 border-neutral-300 bg-white"
          : isNusantara
          ? "border-2 border-[#B86F36]/40 bg-[#FFFDF9]"
          : isRustic
          ? "border border-[#4C6957]/30 bg-[#FAF8F3]"
          : isIslamic
          ? "border-2 border-[#0F4C3A]/30 bg-white"
          : isMidnight
          ? "border border-[#C9A84C]/50 bg-[#161726] text-white"
          : "border border-[#C5A059]/30 bg-white";

        const quoteBoxStyle = isMinimal
          ? "bg-neutral-50 border-neutral-200 text-neutral-700 font-sans"
          : isNusantara
          ? "bg-[#F5E8D8]/60 border-[#D6A97A]/40 text-[#4A3222] font-serif"
          : isRustic
          ? "bg-[#EBF1EC]/60 border-[#C2D6C6] text-[#3E5240] font-serif italic"
          : isIslamic
          ? "bg-[#E6F0EB]/60 border-[#A3C9B6] text-[#1E382C] font-serif"
          : isMidnight
          ? "bg-[#1A1A2E] border-[#C9A84C]/30 text-stone-200 font-serif"
          : "bg-[#FAF7F2] border-[#EAE3D8] text-[#52463E] font-serif";

        return (
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
              <div className="flex items-center justify-center gap-2 border-b border-[#EAE3D8] pb-4">
                <button
                  type="button"
                  onClick={() => setPreviewDevice("mobile")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    previewDevice === "mobile"
                      ? "bg-[#4C6957] text-white font-semibold shadow-xs"
                      : "text-[#6B5E55] hover:text-[#2A211B] bg-white border border-[#EAE3D8]"
                  }`}
                >
                  <Smartphone className="w-4 h-4" /> Tampilan Mobile
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice("desktop")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    previewDevice === "desktop"
                      ? "bg-[#4C6957] text-white font-semibold shadow-xs"
                      : "text-[#6B5E55] hover:text-[#2A211B] bg-white border border-[#EAE3D8]"
                  }`}
                >
                  <Monitor className="w-4 h-4" /> Tampilan Layar Penuh
                </button>
              </div>

              {/* Mockup Frame */}
              <div className="flex justify-center bg-[#F5EFEB]/50 p-4 sm:p-8 rounded-2xl border border-[#EAE3D8]">
                <div
                  className={`transition-all duration-300 rounded-2xl overflow-hidden shadow-xl p-6 text-center space-y-5 ${modalMockupFrame} ${
                    previewDevice === "mobile" ? "w-85" : "w-full max-w-lg"
                  }`}
                >
                  {isNusantara && (
                    <div className="text-[10px] text-[#8D4925] uppercase tracking-widest font-serif font-bold">
                      ✦ PAWIKAHAN ADAT NUSANTARA ✦
                    </div>
                  )}

                  {isIslamic && (
                    <div className="space-y-1">
                      <span className="text-xs text-[#0F4C3A] font-serif font-bold tracking-wider block">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </span>
                      <div className="w-12 h-0.5 bg-[#C5A059] mx-auto rounded-full" />
                    </div>
                  )}

                  {isMinimal && (
                    <div className="flex items-center justify-center gap-2 pb-1">
                      <div className="w-6 h-px bg-neutral-300" />
                      <div className="w-2 h-2 bg-[#2563EB] rotate-45" />
                      <div className="w-6 h-px bg-neutral-300" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <p className={`text-[10px] uppercase tracking-[0.25em] font-semibold ${
                      isMinimal
                        ? "text-[#2563EB] font-sans"
                        : isNusantara
                        ? "text-[#8D4925] font-serif"
                        : isRustic
                        ? "text-[#4C6957] font-serif italic"
                        : isIslamic
                        ? "text-[#0F4C3A] font-serif"
                        : isMidnight
                        ? "text-[#C9A84C] font-serif"
                        : "text-[#8C6A28] font-serif"
                    }`}>
                      {isIslamic ? "Walimatul 'Urs" : "The Wedding of"}
                    </p>
                    <h3 className={`text-2xl font-bold ${
                      isMinimal
                        ? "font-sans text-neutral-900 tracking-tight"
                        : isMidnight
                        ? "font-serif text-[#E2C366]"
                        : isRustic
                        ? "font-serif italic text-[#1F2C20]"
                        : isNusantara
                        ? "font-serif text-[#2C1D11]"
                        : isIslamic
                        ? "font-serif text-[#0B1E15]"
                        : "font-serif text-[#2A211B]"
                    }`}>
                      Dimas & Amanda
                    </h3>
                    <p className={`text-xs opacity-75 ${isMidnight ? "text-stone-300" : "text-[#7A6E65]"}`}>
                      Sabtu, 28 November 2026 • Grand Ballroom
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl border text-xs space-y-2 ${quoteBoxStyle}`}>
                    <p className="italic">
                      &quot;Dan di antara tanda-tanda kebesaran-Nya diciptakan-Nya untukmu pasangan hidup dari jenismu sendiri...&quot;
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className={`p-3 rounded-lg border text-xs font-medium ${
                      isMinimal
                        ? "bg-neutral-100 border-neutral-200 text-neutral-800"
                        : isNusantara
                        ? "bg-[#F5E8D8] border-[#D6A97A]/40 text-[#8D4925]"
                        : isRustic
                        ? "bg-[#EBF1EC] border-[#C2D6C6] text-[#3B5343]"
                        : isIslamic
                        ? "bg-[#E6F0EB] border-[#A3C9B6] text-[#0F4C3A]"
                        : isMidnight
                        ? "bg-[#1A1A2E] border-[#C9A84C]/30 text-[#C9A84C]"
                        : "bg-[#EEF3EF] border-[#C6D5C7] text-[#2C4A37]"
                    }`}>
                      ✨ Template ini mendukung: Countdown, Audio Otomatis, Galeri Foto, Google Maps & QRIS
                    </div>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/register?template=${previewTemplate.slug}`}
                      onClick={() => setPreviewTemplate(null)}
                    >
                      <Button
                        variant={isMidnight ? "gold" : isMinimal ? "primary" : isRustic || isIslamic ? "sage" : "gold"}
                        className="w-full gap-2 justify-center shadow-md cursor-pointer"
                      >
                        <span>Pilih Template Ini Sekarang</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        );
      })()}
    </div>
  );
}
