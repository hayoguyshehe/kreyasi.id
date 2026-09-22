import React from "react";
import { prisma } from "@/lib/prisma";
import { TemplatesManager } from "@/components/admin/templates-manager";

export const metadata = {
  title: "Template Desain | Admin Kreyasi.id",
};

export default async function AdminTemplatesPage() {
  const [templates, categories] = await Promise.all([
    prisma.template.findMany({
      orderBy: { minPackageTier: "asc" },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { invitations: true } },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  return (
    <TemplatesManager
      initialTemplates={templates}
      categories={categories}
    />
  );
}
