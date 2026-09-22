import { z } from "zod/v4";

// ============================================
// Validasi Konten Undangan
// ============================================

const invitationEventSchema = z.object({
  name: z.string().min(1, "Nama acara wajib diisi"),
  date: z.string().min(1, "Tanggal acara wajib diisi"),
  startTime: z.string().min(1, "Waktu mulai wajib diisi"),
  endTime: z.string().optional(),
  venueName: z.string().min(1, "Nama tempat wajib diisi"),
  venueAddress: z.string().min(1, "Alamat wajib diisi"),
  mapsLat: z.number().optional(),
  mapsLng: z.number().optional(),
});

const coupleSchema = z.object({
  groomName: z.string().min(1, "Nama mempelai pria wajib diisi"),
  groomNickname: z.string().optional(),
  brideName: z.string().min(1, "Nama mempelai wanita wajib diisi"),
  brideNickname: z.string().optional(),
  groomParents: z.string().optional(),
  brideParents: z.string().optional(),
});

const personSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  nickname: z.string().optional(),
});

const galleryItemSchema = z.object({
  mediaId: z.string(),
  caption: z.string().optional(),
});

const loveStoryItemSchema = z.object({
  title: z.string().min(1, "Judul cerita wajib diisi"),
  body: z.string().min(1, "Isi cerita wajib diisi"),
});

const themeSchema = z.object({
  primaryColor: z.string().min(1, "Warna primer wajib diisi"),
  fontFamily: z.string().min(1, "Font wajib dipilih"),
});

export const invitationContentSchema = z.object({
  coverTitle: z.string().min(1, "Judul cover wajib diisi"),
  couple: coupleSchema.optional(),
  person: personSchema.optional(),
  events: z.array(invitationEventSchema).min(1, "Minimal 1 acara"),
  loveStory: z.array(loveStoryItemSchema).optional(),
  gallery: z.array(galleryItemSchema),
  backgroundMusicMediaId: z.string().optional(),
  quote: z.string().optional(),
  liveStreamingUrl: z.url("Format URL tidak valid").optional(),
  theme: themeSchema,
});

/**
 * Validasi saat membuat undangan baru (data awal minimal).
 */
export const createInvitationSchema = z.object({
  templateId: z.string().min(1, "Template wajib dipilih"),
  packageId: z.string().min(1, "Paket wajib dipilih"),
  eventCategory: z.enum(["PERNIKAHAN", "ULANG_TAHUN", "KHITANAN_AQIQAH", "EVENT_UMUM"]),
  eventTitle: z.string().min(1, "Judul acara wajib diisi").max(200),
  eventDate: z.string().min(1, "Tanggal acara wajib diisi"),
  slug: z.string().optional(), // Auto-generate jika tidak diisi
});

/**
 * Validasi saat update konten undangan.
 */
export const updateInvitationSchema = z.object({
  eventTitle: z.string().min(1).max(200).optional(),
  eventDate: z.string().optional(),
  content: invitationContentSchema.optional(),
});

export type InvitationContentInput = z.infer<typeof invitationContentSchema>;
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
export type UpdateInvitationInput = z.infer<typeof updateInvitationSchema>;
