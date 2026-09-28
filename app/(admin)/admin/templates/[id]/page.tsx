import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { TemplateDetailAndAssets } from "@/components/admin/template-detail-and-assets";

export const metadata = {
  title: "Kelola Template & Aset | Admin Kreyasi.id",
};

interface TemplateDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminTemplateDetailPage(props: TemplateDetailPageProps) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/login?callbackUrl=/admin");
  }

  const { id } = await props.params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      category: { select: { id: true, name: true } },
      assets: {
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: { invitations: true },
      },
    },
  });

  if (!template) {
    notFound();
  }

  const serializedTemplate = {
    ...template,
    responsiveCheckedAt: template.responsiveCheckedAt ? template.responsiveCheckedAt.toISOString() : null,
    createdAt: template.createdAt.toISOString(),
    assets: template.assets.map((a) => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
  };

  return <TemplateDetailAndAssets template={serializedTemplate} />;
}
