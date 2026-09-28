import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertInvitationAccess } from "@/lib/invitation-access";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    const session = await auth();
    const { id, guestId } = await context.params;

    const access = await assertInvitationAccess(id, session?.user);
    if (!access.authorized) {
      return access.response;
    }

    await prisma.guest.delete({
      where: { id: guestId, invitationId: id },
    });

    return NextResponse.json({
      success: true,
      message: "Tamu berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE guest error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus data tamu" },
      { status: 500 }
    );
  }
}
