import { z } from "zod/v4";

// ============================================
// Validasi Tamu / Guest
// ============================================

/**
 * Validasi tambah tamu manual (satu per satu).
 */
export const addGuestSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tamu wajib diisi")
    .max(100, "Nama maksimal 100 karakter"),
  whatsapp: z
    .string()
    .regex(
      /^(\+62|62|08)\d{8,13}$/,
      "Format nomor WhatsApp tidak valid (contoh: 08123456789)"
    )
    .optional(),
  invitedCount: z
    .number()
    .int()
    .min(1, "Minimal 1 undangan")
    .max(10, "Maksimal 10 undangan per tamu")
    .default(1),
});

/**
 * Validasi import massal tamu (per baris CSV/Excel).
 */
export const guestImportRowSchema = z.object({
  name: z.string().min(1, "Nama tamu wajib diisi"),
  whatsapp: z.string().optional(),
  invitedCount: z.number().int().min(1).max(10).optional(),
});

/**
 * Validasi batch import (array of rows).
 */
export const guestImportBatchSchema = z.object({
  guests: z
    .array(guestImportRowSchema)
    .min(1, "Minimal 1 tamu")
    .max(500, "Maksimal 500 tamu per import"),
});

export type AddGuestInput = z.infer<typeof addGuestSchema>;
export type GuestImportRowInput = z.infer<typeof guestImportRowSchema>;
export type GuestImportBatchInput = z.infer<typeof guestImportBatchSchema>;
