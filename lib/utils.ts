import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DOMPurify from "isomorphic-dompurify";
import { nanoid } from "nanoid";

/**
 * Merge Tailwind CSS classes tanpa konflik.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Sanitasi HTML input untuk mencegah XSS.
 * Aman dipakai di server-side (API route) maupun client-side.
 */
export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip semua HTML tags
    ALLOWED_ATTR: [], // Strip semua atribut
  });
}

/**
 * Format angka ke format Rupiah Indonesia.
 * Contoh: 35000 → "Rp35.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Buat slug URL-safe dari judul acara.
 * Contoh: "Pernikahan Budi & Ani" → "pernikahan-budi-ani"
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Hapus karakter non-alfanumerik
    .replace(/\s+/g, "-") // Ganti spasi dengan dash
    .replace(/-+/g, "-") // Collapse multiple dashes
    .replace(/^-|-$/g, "") // Trim dashes di awal/akhir
    .slice(0, 60); // Batasi panjang
}

/**
 * Generate slug unik untuk link personal tamu.
 * Contoh: "aBcD1234" (8 karakter, URL-safe)
 */
export function generatePersonalSlug(): string {
  return nanoid(8);
}

/**
 * Generate unique slug untuk undangan dengan suffix random.
 * Contoh: "pernikahan-budi-ani-x7k2m"
 */
export function generateInvitationSlug(title: string): string {
  const base = generateSlug(title);
  const suffix = nanoid(5);
  return `${base}-${suffix}`;
}

/**
 * Format tanggal ke format Indonesia.
 * Contoh: "2026-12-25" → "Kamis, 25 Desember 2026"
 */
export function formatDateIndonesia(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format waktu ke format "HH:MM WIB".
 */
export function formatTime(time: string): string {
  return `${time} WIB`;
}
