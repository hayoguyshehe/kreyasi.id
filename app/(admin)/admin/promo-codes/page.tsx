import React from "react";
import { prisma } from "@/lib/prisma";
import { PromoCodesManager } from "@/components/admin/promo-codes-manager";

export const metadata = {
  title: "Kode Promo | Admin Kreyasi.id",
};

export default async function AdminPromoCodesPage() {
  const rawCodes = await prisma.promoCode.findMany({
    orderBy: { validUntil: "desc" },
    include: {
      _count: {
        select: { orders: true },
      },
    },
  });

  const promoCodes = rawCodes.map((p) => ({
    ...p,
    validFrom: p.validFrom.toISOString(),
    validUntil: p.validUntil.toISOString(),
  }));

  return <PromoCodesManager initialPromoCodes={promoCodes} />;
}
