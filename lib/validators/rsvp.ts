import { z } from "zod/v4";

// ============================================
// Validasi RSVP
// ============================================

export const rsvpSchema = z.object({
  guestPersonalSlug: z.string().optional(),
  guestNameFallback: z.string().max(100).optional(),
  status: z.enum(["HADIR", "TIDAK_HADIR", "RAGU"]),
  attendeeCount: z
    .number()
    .int("Jumlah tamu harus bilangan bulat")
    .min(1, "Minimal 1 orang")
    .max(20, "Maksimal 20 orang"),
  message: z.string().max(500, "Pesan maksimal 500 karakter").optional(),
});

/**
 * Validasi untuk ucapan / buku tamu.
 */
export const guestbookSchema = z.object({
  name: z
    .string()
    .min(1, "Nama wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  message: z
    .string()
    .min(1, "Ucapan wajib diisi")
    .max(1000, "Ucapan maksimal 1000 karakter"),
});

export type RsvpInput = z.infer<typeof rsvpSchema>;
export type GuestbookInput = z.infer<typeof guestbookSchema>;
