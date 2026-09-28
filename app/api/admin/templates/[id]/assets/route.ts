import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { getS3Client, getPublicUrl, deleteObject } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Maksimum ukuran Lottie 500KB sesuai PRD bagian 2.2
const MAX_LOTTIE_SIZE = 500 * 1024;
// Maksimum ukuran gambar 5MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const FORBIDDEN_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".php",
  ".phtml",
  ".pl",
  ".py",
  ".cgi",
  ".jar",
  ".dll",
  ".scr",
  ".msi",
  ".vbs",
  ".js",
  ".mjs",
];

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const assets = await prisma.templateAsset.findMany({
      where: { templateId: id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: assets,
    });
  } catch (error) {
    console.error("GET /api/admin/templates/[id]/assets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar aset template" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Verifikasi template eksis
    const template = await prisma.template.findUnique({
      where: { id },
    });
    if (!template) {
      return NextResponse.json(
        { success: false, error: "Template tidak ditemukan" },
        { status: 404 }
      );
    }

    const contentTypeHeader = request.headers.get("content-type") || "";

    // 1. Upload via multipart/form-data
    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const keyInput = (formData.get("key") as string) || "";
      const customType = formData.get("type") as string | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: "File tidak ditemukan dalam unggahan" },
          { status: 400 }
        );
      }

      const fileName = file.name.toLowerCase();
      const fileSize = file.size;
      const mimeType = file.type || "application/octet-stream";

      // Validasi ekstensi terlarang
      const hasForbiddenExt = FORBIDDEN_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      if (hasForbiddenExt) {
        return NextResponse.json(
          {
            success: false,
            error: "Format file berbahaya dan tidak diizinkan (.exe, .bat, skrip, dsb.)",
          },
          { status: 400 }
        );
      }

      // Deteksi tipe aset
      let assetType: "IMAGE" | "VIDEO" | "LOTTIE" | "FONT" = "IMAGE";
      const isLottie = fileName.endsWith(".json") || fileName.endsWith(".lottie") || customType === "LOTTIE";
      const isImage =
        fileName.endsWith(".jpg") ||
        fileName.endsWith(".jpeg") ||
        fileName.endsWith(".png") ||
        fileName.endsWith(".webp") ||
        fileName.endsWith(".avif") ||
        mimeType.startsWith("image/");
      const isVideo =
        fileName.endsWith(".mp4") || fileName.endsWith(".webm") || mimeType.startsWith("video/");
      const isFont =
        fileName.endsWith(".woff") ||
        fileName.endsWith(".woff2") ||
        fileName.endsWith(".ttf") ||
        fileName.endsWith(".otf");

      if (isLottie) {
        assetType = "LOTTIE";
      } else if (isImage) {
        assetType = "IMAGE";
      } else if (isVideo) {
        assetType = "VIDEO";
      } else if (isFont) {
        assetType = "FONT";
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Format file tidak didukung. Unggah gambar (jpg, png, webp), animasi Lottie (.json, .lottie), video, atau font.",
          },
          { status: 400 }
        );
      }

      // Validasi batas ukuran
      if (assetType === "LOTTIE" && fileSize > MAX_LOTTIE_SIZE) {
        const sizeKb = Math.round(fileSize / 1024);
        return NextResponse.json(
          {
            success: false,
            error: `Ukuran file animasi Lottie (${sizeKb} KB) melebihi batas maksimal 500 KB demi performa undangan.`,
          },
          { status: 400 }
        );
      }

      if (assetType === "IMAGE" && fileSize > MAX_IMAGE_SIZE) {
        const sizeMb = (fileSize / (1024 * 1024)).toFixed(1);
        return NextResponse.json(
          {
            success: false,
            error: `Ukuran file gambar (${sizeMb} MB) melebihi batas maksimal 5 MB.`,
          },
          { status: 400 }
        );
      }

      // Sanitasi Key
      let assetKey = keyInput
        ? keyInput.trim().toLowerCase().replace(/[^a-z0-9-_]+/g, "-")
        : fileName.replace(/\.[^/.]+$/, "").replace(/[^a-z0-9-_]+/g, "-");

      if (!assetKey) assetKey = `asset-${Date.now()}`;

      // Validasi konten file Lottie JSON jika ekstensi .json
      let metadata: any = null;
      const buffer = Buffer.from(await file.arrayBuffer());

      if (assetType === "LOTTIE" && fileName.endsWith(".json")) {
        try {
          const jsonText = buffer.toString("utf-8");
          const parsed = JSON.parse(jsonText);
          if (!parsed || (typeof parsed !== "object")) {
            throw new Error("Invalid json");
          }
          metadata = {
            version: parsed.v,
            frameRate: parsed.fr,
            width: parsed.w,
            height: parsed.h,
            inPoint: parsed.ip,
            outPoint: parsed.op,
          };
        } catch {
          return NextResponse.json(
            { success: false, error: "File Lottie JSON tidak valid atau rusak" },
            { status: 400 }
          );
        }
      }

      // Upload ke S3/R2
      const extension = fileName.split(".").pop() || "bin";
      const s3StorageKey = `templates/${template.slug}/assets/${assetKey}.${extension}`;

      const client = getS3Client();
      const bucketName = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";

      await client.send(
        new PutObjectCommand({
          Bucket: bucketName,
          Key: s3StorageKey,
          Body: buffer,
          ContentType: mimeType,
        })
      );

      const publicUrl = getPublicUrl(s3StorageKey);

      // Simpan atau perbarui di database TemplateAsset
      const assetRecord = await prisma.templateAsset.upsert({
        where: {
          templateId_key: {
            templateId: id,
            key: assetKey,
          },
        },
        create: {
          templateId: id,
          type: assetType,
          key: assetKey,
          url: publicUrl,
          fileSize,
          mimeType,
          metadata,
        },
        update: {
          type: assetType,
          url: publicUrl,
          fileSize,
          mimeType,
          metadata,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Aset berhasil diunggah",
        data: assetRecord,
      });
    }

    return NextResponse.json(
      { success: false, error: "Content-Type multipart/form-data diperlukan" },
      { status: 400 }
    );
  } catch (error) {
    console.error("POST /api/admin/templates/[id]/assets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses unggahan aset template" },
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
    if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
      return NextResponse.json(
        { success: false, error: "Akses ditolak" },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const assetId = searchParams.get("assetId");
    const key = searchParams.get("key");

    if (!assetId && !key) {
      return NextResponse.json(
        { success: false, error: "Parameter assetId atau key diperlukan" },
        { status: 400 }
      );
    }

    const asset = await prisma.templateAsset.findFirst({
      where: {
        templateId: id,
        ...(assetId ? { id: assetId } : { key: key! }),
      },
      include: {
        template: { select: { slug: true } },
      },
    });

    if (!asset) {
      return NextResponse.json(
        { success: false, error: "Aset tidak ditemukan" },
        { status: 404 }
      );
    }

    // Ekstrak storage key dari url jika mungkin
    try {
      const urlParts = asset.url.split("/");
      const filename = urlParts[urlParts.length - 1];
      const s3StorageKey = `templates/${asset.template.slug}/assets/${filename}`;
      await deleteObject(s3StorageKey);
    } catch (e) {
      console.warn("Gagal menghapus file dari S3 storage:", e);
    }

    // Hapus dari database
    await prisma.templateAsset.delete({
      where: { id: asset.id },
    });

    return NextResponse.json({
      success: true,
      message: `Aset "${asset.key}" berhasil dihapus`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/templates/[id]/assets error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus aset template" },
      { status: 500 }
    );
  }
}
