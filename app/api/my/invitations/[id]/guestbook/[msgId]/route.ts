import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { assertInvitationAccess } from "@/lib/invitation-access";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; msgId: string }> }
) {
  try {
    const session = await auth();
    const { id, msgId } = await context.params;

    const access = await assertInvitationAccess(id, session?.user);
    if (!access.authorized) {
      return access.response;
    }

    await prisma.guestbookMessage.delete({
      where: { id: msgId, invitationId: id },
    });

    return NextResponse.json({
      success: true,
      message: "Ucapan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE guestbook message error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus ucapan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string; msgId: string }> }
) {
  try {
    const session = await auth();
    const { id, msgId } = await context.params;

    const access = await assertInvitationAccess(id, session?.user);
    if (!access.authorized) {
      return access.response;
    }

    const body = await request.json();
    const { isApproved } = body;

    const updated = await prisma.guestbookMessage.update({
      where: { id: msgId, invitationId: id },
      data: { isApproved: typeof isApproved === "boolean" ? isApproved : true },
    });

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PATCH guestbook message error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status ucapan" },
      { status: 500 }
    );
  }
}
