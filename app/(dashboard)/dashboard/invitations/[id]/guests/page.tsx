import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitationNav } from "@/components/dashboard/invitation-nav";
import { GuestManager } from "@/components/dashboard/guest-manager";

export default async function InvitationGuestsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await props.params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      package: true,
      guests: {
        include: { rsvp: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  if (
    invitation.userId !== session.user.id &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPERADMIN"
  ) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <InvitationNav
        id={invitation.id}
        slug={invitation.slug}
        title={invitation.eventTitle}
      />

      <GuestManager
        invitationId={invitation.id}
        slug={invitation.slug}
        initialGuests={invitation.guests.map((g) => ({
          ...g,
          openedAt: g.openedAt ? g.openedAt.toISOString() : null,
          createdAt: g.createdAt.toISOString(),
        }))}
        maxGuests={invitation.package.maxGuests}
      />
    </div>
  );
}
