import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitationEditor } from "@/components/editor/invitation-editor";

export default async function InvitationDetailPage(props: {
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
      template: true,
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
    <InvitationEditor
      initialData={{
        ...invitation,
        eventDate: invitation.eventDate.toISOString(),
      }}
    />
  );
}
