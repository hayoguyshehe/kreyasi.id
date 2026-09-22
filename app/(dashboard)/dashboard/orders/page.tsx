import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrdersManager } from "@/components/dashboard/orders-manager";

export const metadata = {
  title: "Riwayat Transaksi | Kreyasi.id",
};

export default async function DashboardOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const rawOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      package: {
        select: { name: true, slug: true, activeDurationDays: true },
      },
      invitation: {
        select: { id: true, eventTitle: true, slug: true, status: true },
      },
      payment: {
        select: { method: true, gatewayRef: true },
      },
    },
  });

  const orders = rawOrders.map((o) => ({
    id: o.id,
    midtransOrderId: o.midtransOrderId,
    amountIdr: o.amountIdr,
    status: o.status,
    createdAt: o.createdAt.toISOString(),
    paidAt: o.paidAt ? o.paidAt.toISOString() : null,
    package: o.package,
    invitation: o.invitation,
    payment: o.payment,
  }));

  const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return (
    <OrdersManager
      orders={orders}
      midtransClientKey={midtransClientKey}
      isProduction={isProduction}
    />
  );
}
