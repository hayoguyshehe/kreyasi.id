import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ============================================
// Cloudflare R2 (S3-Compatible) Storage Helper
// ============================================

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || "";
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || "";
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || "";
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "kreyasi-media";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

/**
 * Cek apakah R2 sudah dikonfigurasi.
 * Jika belum, fallback ke local storage bisa diimplementasikan.
 */
export function isR2Configured(): boolean {
  return !!(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
}

/**
 * Buat S3Client yang terhubung ke Cloudflare R2.
 */
function getR2Client(): S3Client {
  return new S3Client({
    region: "auto",
    endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

/**
 * Generate presigned URL untuk upload langsung dari browser ke R2.
 * URL berlaku selama 10 menit.
 *
 * @param key - path di bucket (mis. "invitations/{invId}/photos/{fileId}.jpg")
 * @param contentType - MIME type file
 * @param maxSizeBytes - maksimum ukuran file (opsional)
 */
export async function generatePresignedUploadUrl(
  key: string,
  contentType: string,
  maxSizeBytes?: number
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const client = getR2Client();

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ...(maxSizeBytes && { ContentLength: maxSizeBytes }),
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: 600, // 10 menit
  });

  return {
    uploadUrl,
    publicUrl: getPublicUrl(key),
    key,
  };
}

/**
 * Hapus objek dari R2.
 */
export async function deleteObject(key: string): Promise<void> {
  const client = getR2Client();

  await client.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    })
  );
}

/**
 * Dapatkan URL publik untuk media.
 * R2 public URL harus sudah dikonfigurasi (custom domain atau r2.dev subdomain).
 */
export function getPublicUrl(key: string): string {
  if (R2_PUBLIC_URL) {
    return `${R2_PUBLIC_URL}/${key}`;
  }
  // Fallback: R2 dev URL (hanya untuk development)
  return `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.dev/${key}`;
}

/**
 * Generate presigned URL untuk download/baca file dari R2.
 * Berguna untuk file private yang perlu diakses sementara.
 */
export async function generatePresignedReadUrl(
  key: string
): Promise<string> {
  const client = getR2Client();

  const command = new GetObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
  });

  return getSignedUrl(client, command, {
    expiresIn: 3600, // 1 jam
  });
}

/**
 * Generate key path standar untuk media undangan.
 */
export function generateMediaKey(
  invitationId: string,
  type: "photos" | "videos" | "audio",
  filename: string
): string {
  return `invitations/${invitationId}/${type}/${filename}`;
}
