import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface InvitationAccessUser {
  id: string;
  role?: string | null;
  email?: string | null;
}

export interface InvitationAccessSuccess<T = any> {
  authorized: true;
  invitation: T;
  isOwner: boolean;
  isAdmin: boolean;
}

export interface InvitationAccessFailure {
  authorized: false;
  response: NextResponse;
  status: 401 | 403 | 404;
  error: string;
}

export type InvitationAccessResult<T = any> =
  | InvitationAccessSuccess<T>
  | InvitationAccessFailure;

/**
 * Helper otorisasi akses undangan untuk route API /api/my/invitations/[id]/**
 * Mengizinkan pemilik undangan ATAU admin/superadmin (untuk keperluan support & kelola undangan kerjasama).
 * Menjaga isolasi antar-customer: customer A yang mencoba akses customer B otomatis ditolak.
 */
export async function assertInvitationAccess<T = any>(
  invitationId: string,
  user: InvitationAccessUser | undefined | null,
  options?: {
    include?: any;
    select?: any;
  }
): Promise<InvitationAccessResult<T>> {
  if (!user?.id) {
    return {
      authorized: false,
      status: 401,
      error: "Unauthorized",
      response: NextResponse.json(
        { success: false, error: "Unauthorized: Silakan masuk terlebih dahulu" },
        { status: 401 }
      ),
    };
  }

  const queryArgs: any = {
    where: { id: invitationId },
  };

  if (options?.include) {
    queryArgs.include = options.include;
  } else if (options?.select) {
    queryArgs.select = options.select;
  }

  const invitation = await (prisma.invitation.findUnique(queryArgs) as Promise<T | null>);

  if (!invitation) {
    return {
      authorized: false,
      status: 404,
      error: "Undangan tidak ditemukan",
      response: NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      ),
    };
  }

  const invUserId = (invitation as any).userId;
  const isOwner = invUserId === user.id;
  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  if (!isOwner && !isAdmin) {
    return {
      authorized: false,
      status: 404,
      error: "Undangan tidak ditemukan",
      response: NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      ),
    };
  }

  return {
    authorized: true,
    invitation,
    isOwner,
    isAdmin,
  };
}
