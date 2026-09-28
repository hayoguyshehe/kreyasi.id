import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TemplateResponsivePreview } from "@/components/admin/template-responsive-preview";

export const metadata = {
  title: "Uji Responsif Template | Admin Kreyasi.id",
};

interface PreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTemplatePreviewPage(props: PreviewPageProps) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/login?callbackUrl=/admin");
  }

  const { id } = await props.params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
    },
  });

  if (!template) {
    notFound();
  }

  const serializedTemplate = {
    id: template.id,
    name: template.name,
    slug: template.slug,
    qaStatus: template.qaStatus,
    qaNote: template.qaNote,
    responsiveCheckedAt: template.responsiveCheckedAt ? template.responsiveCheckedAt.toISOString() : null,
    isActive: template.isActive,
    minPackageTier: template.minPackageTier,
    category: template.category,
  };

  return <TemplateResponsivePreview template={serializedTemplate} />;
}
