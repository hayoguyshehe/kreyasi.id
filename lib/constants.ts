// ============================================
// Konstanta Aplikasi — Kreyasi
// ============================================

export const APP_NAME = "Kreyasi";
export const APP_DESCRIPTION =
  "Platform undangan digital modern untuk pernikahan, ulang tahun, khitanan, dan acara spesial lainnya.";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Prefix path undangan publik.
 * Undangan diakses di: {APP_URL}/u/{slug}
 */
export const INVITATION_PATH_PREFIX = "/u";

/**
 * Kategori acara — label tampilan.
 */
export const EVENT_CATEGORY_LABELS: Record<string, string> = {
  PERNIKAHAN: "Pernikahan",
  ULANG_TAHUN: "Ulang Tahun",
  KHITANAN_AQIQAH: "Khitanan & Aqiqah",
  EVENT_UMUM: "Event Umum",
};

/**
 * Status undangan — label + warna badge.
 */
export const INVITATION_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  DRAFT: { label: "Draft", color: "bg-yellow-100 text-yellow-800" },
  PUBLISHED: { label: "Dipublikasikan", color: "bg-green-100 text-green-800" },
  EXPIRED: { label: "Kedaluwarsa", color: "bg-gray-100 text-gray-800" },
  SUSPENDED: { label: "Ditangguhkan", color: "bg-red-100 text-red-800" },
};

/**
 * Status pesanan — label + warna badge.
 */
export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Menunggu Pembayaran", color: "bg-yellow-100 text-yellow-800" },
  PAID: { label: "Lunas", color: "bg-green-100 text-green-800" },
  FAILED: { label: "Gagal", color: "bg-red-100 text-red-800" },
  EXPIRED: { label: "Kedaluwarsa", color: "bg-gray-100 text-gray-800" },
  REFUNDED: { label: "Dikembalikan", color: "bg-blue-100 text-blue-800" },
};

/**
 * Status RSVP — label.
 */
export const RSVP_STATUS_LABELS: Record<string, string> = {
  HADIR: "Hadir",
  TIDAK_HADIR: "Tidak Hadir",
  RAGU: "Masih Ragu",
};

/**
 * Metode pembayaran — label.
 */
export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  QRIS: "QRIS",
  VIRTUAL_ACCOUNT: "Virtual Account",
  EWALLET: "E-Wallet",
  CREDIT_CARD: "Kartu Kredit",
};

/**
 * Batas upload file.
 */
export const UPLOAD_LIMITS = {
  MAX_IMAGE_SIZE_MB: 5,
  MAX_VIDEO_SIZE_MB: 50,
  MAX_AUDIO_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_VIDEO_TYPES: ["video/mp4", "video/webm"],
  ALLOWED_AUDIO_TYPES: ["audio/mpeg", "audio/mp3", "audio/wav"],
};

/**
 * Editor undangan — step definitions.
 */
export const EDITOR_STEPS = [
  { id: "info", label: "Info Acara", icon: "CalendarDays" },
  { id: "detail", label: "Detail", icon: "Users" },
  { id: "events", label: "Acara & Lokasi", icon: "MapPin" },
  { id: "gallery", label: "Galeri", icon: "Image" },
  { id: "gift", label: "Kado Digital", icon: "Gift" },
  { id: "theme", label: "Tema", icon: "Palette" },
] as const;

export type EditorStepId = (typeof EDITOR_STEPS)[number]["id"];
