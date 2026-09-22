import React from "react";
import { prisma } from "@/lib/prisma";
import { WizardCreateInvitation } from "@/components/dashboard/wizard-create-invitation";

export default async function NewInvitationPage() {
  const [categories, packages, templates] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.template.findMany({
      where: { isActive: true },
      orderBy: { minPackageTier: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
          Buat Undangan Digital Baru
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Ikuti 3 langkah mudah berikut untuk mulai merancang undangan Anda
        </p>
      </div>

      <WizardCreateInvitation
        categories={categories}
        packages={packages}
        templates={templates}
      />
    </div>
  );
}
