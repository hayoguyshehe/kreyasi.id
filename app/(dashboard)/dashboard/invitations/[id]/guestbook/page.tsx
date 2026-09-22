import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitationNav } from "@/components/dashboard/invitation-nav";
import { GuestbookManager } from "@/components/dashboard/guestbook-manager";

export default async function InvitationGuestbookPage(props: {
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
      guestbook: {
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

      <GuestbookManager
        invitationId={invitation.id}
        initialMessages={invitation.guestbook.map((m) => ({
          ...m,
          createdAt: m.createdAt.toISOString(),
        }))}
      />
    </div>
  );
}
