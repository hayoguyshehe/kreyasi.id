import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ============================================
// S3-Compatible Storage Helper
// Mendukung:
// 1. IDCloudHost Object Storage (https://is3.cloudhost.id)
// 2. Cloudflare R2
// 3. Backblaze B2
// ============================================

const S3_ENDPOINT =
  process.env.S3_ENDPOINT ||
  (process.env.R2_ACCOUNT_ID
    ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
    : "");
const S3_ACCESS_KEY_ID =
  process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY =
  process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "";
const S3_BUCKET_NAME =
  process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";
const S3_PUBLIC_URL =
  process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL || "";
const S3_REGION = process.env.S3_REGION;

/**
 * Cek apakah storage S3/R2/B2/IDCloudHost sudah dikonfigurasi.
 */
export function isR2Configured(): boolean {
  const endpoint = process.env.S3_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : "");
  const accessKey = process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY;
  return !!(endpoint && accessKey && secretKey);
}

/**
 * Buat S3Client yang terhubung ke IDCloudHost, Cloudflare R2, atau Backblaze B2.
 */
export function getS3Client(): S3Client {
  const endpoint =
    process.env.S3_ENDPOINT ||
    (process.env.R2_ACCOUNT_ID
      ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
      : undefined);

  // Ceph S3 (IDCloudHost is3.cloudhost.id) memerlukan forcePathStyle: true
  const isIdCloudHost = endpoint?.includes("cloudhost.id") || false;
  const forcePathStyle =
    process.env.S3_FORCE_PATH_STYLE !== undefined
      ? process.env.S3_FORCE_PATH_STYLE === "true"
      : isIdCloudHost;

  const region = S3_REGION || (isIdCloudHost ? "us-east-1" : "auto");

  return new S3Client({
    region,
    endpoint,
    forcePathStyle,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID || "",
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY || "",
    },
  });
}

export const getR2Client = getS3Client;

/**
 * Generate presigned URL untuk upload langsung dari browser ke R2/S3.
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
  const client = getS3Client();
  const bucketName = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";

  const command = new PutObjectCommand({
    Bucket: bucketName,
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
 * Hapus objek dari R2/S3.
 */
export async function deleteObject(key: string): Promise<void> {
  const client = getS3Client();
  const bucketName = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })
  );
}

/**
 * Dapatkan URL publik untuk media.
 * Public URL harus sudah dikonfigurasi (custom domain atau r2.dev subdomain).
 */
export function getPublicUrl(key: string): string {
  const publicUrl = process.env.S3_PUBLIC_URL || process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (publicUrl) {
    return `${publicUrl.replace(/\/$/, "")}/${key}`;
  }

  // IDCloudHost path-style: https://is3.cloudhost.id/{bucket}/{key}
  const endpoint = process.env.S3_ENDPOINT;
  const bucketName = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";
  if (endpoint?.includes("cloudhost.id")) {
    return `${endpoint.replace(/\/$/, "")}/${bucketName}/${key}`;
  }

  // Cloudflare R2 fallback
  const accountId = process.env.R2_ACCOUNT_ID || "account";
  return `https://${bucketName}.${accountId}.r2.dev/${key}`;
}

/**
 * Generate presigned URL untuk download/baca file dari R2/S3.
 * Berguna untuk file private yang perlu diakses sementara.
 */
export async function generatePresignedReadUrl(
  key: string
): Promise<string> {
  const client = getS3Client();
  const bucketName = process.env.S3_BUCKET_NAME || process.env.R2_BUCKET_NAME || "kreyasi-media";

  const command = new GetObjectCommand({
    Bucket: bucketName,
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
