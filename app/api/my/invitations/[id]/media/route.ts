import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  isR2Configured,
  generatePresignedUploadUrl,
  generateMediaKey,
} from "@/lib/r2";
import { nanoid } from "nanoid";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const invitation = await prisma.invitation.findUnique({
      where: { id },
      include: { package: true },
    });

    if (!invitation || invitation.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Undangan tidak ditemukan" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { filename, contentType, type = "PHOTO" } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { success: false, error: "Nama file dan contentType wajib disertakan" },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop() || "jpg";
    const mediaId = nanoid(10);
    const mediaTypeDir =
      type === "VIDEO" ? "videos" : type === "AUDIO" ? "audio" : "photos";
    const key = generateMediaKey(id, mediaTypeDir, `${mediaId}.${ext}`);

    let uploadUrl = "";
    let publicUrl = "";

    if (isR2Configured()) {
      const presigned = await generatePresignedUploadUrl(key, contentType);
      uploadUrl = presigned.uploadUrl;
      publicUrl = presigned.publicUrl;
    } else {
      // Fallback lokal development
      publicUrl = `/uploads/${key}`;
      uploadUrl = `/api/upload/local?key=${encodeURIComponent(key)}`;
    }

    // Catat ke model Media
    const media = await prisma.media.create({
      data: {
        id: mediaId,
        invitationId: id,
        type,
        url: publicUrl,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        mediaId: media.id,
        uploadUrl,
        publicUrl,
        key,
      },
    });
  } catch (error) {
    console.error("POST /api/my/invitations/[id]/media error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menyiapkan upload media" },
      { status: 500 }
    );
  }
}
