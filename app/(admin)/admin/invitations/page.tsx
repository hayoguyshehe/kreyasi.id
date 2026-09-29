import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitationsManager, AdminInvitationItem } from "@/components/admin/invitations-manager";

export const metadata = {
  title: "Undangan & Kerjasama | Admin Kreyasi.id",
};

export default async function AdminInvitationsPage() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const [invitations, users, packages, templates] = await Promise.all([
    prisma.invitation.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        package: { select: { id: true, name: true, slug: true, priceIdr: true, maxGuests: true } },
        template: { select: { id: true, name: true, slug: true, previewImageUrl: true } },
        grantedBy: { select: { id: true, name: true, email: true } },
        _count: {
          select: { guests: true, rsvps: true, guestbook: true },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
    prisma.package.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true, priceIdr: true },
    }),
    prisma.template.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, categoryId: true },
    }),
  ]);

  const serializedInvitations: AdminInvitationItem[] = invitations.map((inv) => ({
    id: inv.id,
    slug: inv.slug,
    eventTitle: inv.eventTitle,
    eventDate: inv.eventDate.toISOString(),
    eventCategory: inv.eventCategory,
    status: inv.status,
    isComplimentary: inv.isComplimentary,
    complimentaryNote: inv.complimentaryNote,
    createdAt: inv.createdAt.toISOString(),
    user: inv.user,
    package: inv.package,
    template: inv.template,
    grantedBy: inv.grantedBy,
    _count: inv._count,
  }));

  return (
    <InvitationsManager
      initialInvitations={serializedInvitations}
      users={users}
      packages={packages}
      templates={templates}
    />
  );
}
