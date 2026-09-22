"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Layers,
  Heart,
  PartyPopper,
  Baby,
  Briefcase,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Package {
  id: string;
  name: string;
  slug: string;
  priceIdr: number;
  sortOrder: number;
  activeDurationDays: number;
  maxGalleryPhotos: number;
}

interface Template {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  minPackageTier: number;
  previewImageUrl: string;
}

interface WizardProps {
  categories: Category[];
  packages: Package[];
  templates: Template[];
}

export function WizardCreateInvitation({
  categories,
  packages,
  templates,
}: WizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);

  // Form State
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]?.id || ""
  );
  const [selectedPackage, setSelectedPackage] = useState<string>(
    packages[0]?.id || ""
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>(
    templates[0]?.id || ""
  );
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDate, setEventDate] = useState<string>("");
  const [customSlug, setCustomSlug] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Filter templates based on category & package tier
  const chosenPackage = packages.find((p) => p.id === selectedPackage);
  const currentTier = chosenPackage ? chosenPackage.sortOrder : 0;

  const availableTemplates = templates.filter(
    (t) => t.categoryId === selectedCategory && t.minPackageTier <= currentTier
  );

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case "pernikahan":
        return <Heart className="w-6 h-6 text-amber-400" />;
      case "ulang-tahun":
        return <PartyPopper className="w-6 h-6 text-amber-400" />;
      case "khitanan-aqiqah":
        return <Baby className="w-6 h-6 text-amber-400" />;
      default:
        return <Briefcase className="w-6 h-6 text-amber-400" />;
    }
  };

  const handleSubmit = async () => {
    if (!eventTitle.trim() || !eventDate) {
      setError("Judul acara dan tanggal acara wajib diisi.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const chosenCategory = categories.find((c) => c.id === selectedCategory);
    let eventCategoryEnum = "EVENT_UMUM";
    if (chosenCategory?.slug === "pernikahan") eventCategoryEnum = "PERNIKAHAN";
    else if (chosenCategory?.slug === "ulang-tahun") eventCategoryEnum = "ULANG_TAHUN";
    else if (chosenCategory?.slug === "khitanan-aqiqah") eventCategoryEnum = "KHITANAN_AQIQAH";

    try {
      const response = await fetch("/api/my/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplate,
          packageId: selectedPackage,
          eventCategory: eventCategoryEnum,
          eventTitle,
          eventDate,
          slug: customSlug || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Gagal membuat undangan.");
        setIsLoading(false);
        return;
      }

      router.push(`/dashboard/invitations/${data.data.id}`);
    } catch {
      setError("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Stepper Header */}
      <div className="flex items-center justify-between relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -translate-y-1/2 -z-0" />
        {[
          { num: 1, label: "Kategori Acara" },
          { num: 2, label: "Paket Harga" },
          { num: 3, label: "Template & Info" },
        ].map((s) => {
          const isDone = step > s.num;
          const isCurrent = step === s.num;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5 bg-[#0B0D11] px-3">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : isCurrent
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : s.num}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  isCurrent ? "text-amber-400 font-semibold" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400">
          {error}
        </div>
      )}

      {/* STEP 1: Pilih Kategori */}
      {step === 1 && (
        <Card variant="subtle" className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold font-serif text-white">Pilih Kategori Acara</h2>
            <p className="text-xs text-slate-400">Untuk acara apa undangan digital ini dibuat?</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-5 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                  selectedCategory === cat.id
                    ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10 text-white"
                    : "bg-[#14171F] border-slate-800 text-slate-300 hover:border-slate-700"
                }`}
              >
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  {getCategoryIcon(cat.slug)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{cat.name}</h3>
                  <span className="text-xs text-slate-500">Desain tematik khusus</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="gold"
              onClick={() => setStep(2)}
              className="gap-2"
            >
              <span>Lanjut: Pilih Paket</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: Pilih Paket */}
      {step === 2 && (
        <Card variant="subtle" className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold font-serif text-white">Pilih Paket Undangan</h2>
            <p className="text-xs text-slate-400">Sesuaikan paket dengan kebutuhan fitur acara Anda</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {packages.map((pkg) => {
              const isSelected = selectedPackage === pkg.id;
              return (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`p-5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10"
                      : "bg-[#14171F] border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="space-y-1">
                    <h3 className="font-bold text-white font-serif">{pkg.name}</h3>
                    <p className="text-lg font-bold text-amber-400 font-serif">
                      {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                    </p>
                    <span className="text-[11px] text-slate-400 block">
                      Aktif {pkg.activeDurationDays} hari • Max {pkg.maxGalleryPhotos} Foto
                    </span>
                  </div>
                  {isSelected && (
                    <Badge variant="gold" className="self-start text-[10px]">
                      Terpilih
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <Button variant="gold" onClick={() => setStep(3)} className="gap-2">
              <span>Lanjut: Info & Template</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: Template & Info Awal */}
      {step === 3 && (
        <Card variant="subtle" className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-xl font-bold font-serif text-white">Informasi Dasar & Template</h2>
            <p className="text-xs text-slate-400">Isi detail acara Anda dan pilih tampilan awal</p>
          </div>

          {/* Form Info Awal */}
          <div className="space-y-4">
            <Input
              label="Judul Acara / Nama Pasangan"
              placeholder="Contoh: Pernikahan Dimas & Amanda"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />

            <Input
              label="Tanggal Acara"
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />

            <Input
              label="Kustom URL Tautan (Opsional)"
              placeholder="Contoh: dimas-amanda"
              hint="Tautan publik Anda akan menjadi: kreyasi.id/u/dimas-amanda"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
            />
          </div>

          {/* Template Picker */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-200">
              Pilih Desain Template:
            </label>

            {availableTemplates.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-900 text-center text-xs text-slate-400">
                Template untuk kategori ini dengan paket terpilih akan menggunakan template default Kreyasi.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {availableTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplate(tpl.id)}
                    className={`p-3 rounded-xl border cursor-pointer text-center space-y-2 transition-all ${
                      selectedTemplate === tpl.id
                        ? "bg-amber-500/10 border-amber-500 shadow-md shadow-amber-500/10"
                        : "bg-[#14171F] border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="h-28 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-2">
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </div>
                    <p className="text-xs font-semibold text-white truncate">{tpl.name}</p>
                    {selectedTemplate === tpl.id && (
                      <span className="text-[10px] text-amber-400 font-bold block">✓ Terpilih</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-800">
            <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </Button>
            <Button
              variant="gold"
              onClick={handleSubmit}
              isLoading={isLoading}
              className="gap-2 shadow-lg"
            >
              <span>Buat Undangan Sekarang</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
