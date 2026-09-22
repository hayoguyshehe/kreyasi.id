import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string; guestId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id, guestId } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
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
