import React from "react";
import { prisma } from "@/lib/prisma";
import { CategoriesManager } from "@/components/admin/categories-manager";

export const metadata = {
  title: "Kategori Acara | Admin Kreyasi.id",
};

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { templates: true },
      },
    },
  });

  return <CategoriesManager initialCategories={categories} />;
}
