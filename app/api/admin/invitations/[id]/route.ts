import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        package: true,
        template: true,
        grantedBy: { select: { id: true, name: true, email: true } },
        order: { select: { id: true, status: true, amountIdr: true } },
        _count: {
          select: { guests: true, rsvps: true, guestbook: true, media: true },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: invitation,
    });
  } catch (error) {
    console.error("GET /api/admin/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil detail undangan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const body = await request.json();
    const { isComplimentary, complimentaryNote, packageId, status, expiresAt } = body;

    const existing = await prisma.invitation.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (typeof isComplimentary === "boolean") {
      updateData.isComplimentary = isComplimentary;
      if (isComplimentary) {
        updateData.grantedById = session.user.id;
      }
    }

    if (complimentaryNote !== undefined) {
      updateData.complimentaryNote = complimentaryNote ? complimentaryNote.trim() : null;
    }

    if (packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: packageId } });
      if (pkg) {
        updateData.packageId = packageId;
      }
    }

    if (status && ["DRAFT", "PUBLISHED", "EXPIRED", "SUSPENDED"].includes(status)) {
      updateData.status = status;
    }

    if (expiresAt !== undefined) {
      updateData.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    const updated = await prisma.invitation.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: { select: { id: true, name: true, slug: true } },
        grantedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Status undangan berhasil diperbarui",
      data: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui status undangan" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (
      !session?.user?.id ||
      (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")
    ) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    await prisma.invitation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Undangan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/admin/invitations/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus undangan" },
      { status: 500 }
    );
  }
}
