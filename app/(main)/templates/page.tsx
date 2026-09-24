import React from "react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { TemplateGallery } from "@/components/templates/template-gallery";

export const revalidate = 3600; // Cache 1 jam

export default async function TemplatesPage() {
  const [templates, categories] = await Promise.all([
    prisma.template.findMany({
      where: { isActive: true },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="sage">Koleksi Desain Eksklusif</Badge>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#2A211B] tracking-tight">
          Katalog Template Undangan Digital
        </h1>
        <p className="text-sm sm:text-base text-[#6B5E55] max-w-2xl mx-auto">
          Temukan ragam pilihan desain undangan mulai dari adat tradisional, minimalis modern, hingga floral romantis yang dapat disesuaikan sesuka hati.
        </p>
      </div>

      <TemplateGallery
        initialTemplates={templates}
        categories={categories}
      />
    </div>
  );
}
