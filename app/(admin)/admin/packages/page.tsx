import React from "react";
import { prisma } from "@/lib/prisma";
import { PackagesManager } from "@/components/admin/packages-manager";

export const metadata = {
  title: "Paket Harga | Admin Kreyasi.id",
};

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: { orders: true, invitations: true },
      },
    },
  });

  return <PackagesManager initialPackages={packages} />;
}
