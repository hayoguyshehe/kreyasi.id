// ============================================
// TypeScript Type Definitions — Kreyasi
// Kontrak tipe dari PRD bagian 5
// ============================================

/**
 * Konten undangan — disimpan di kolom `content` (Json) pada model Invitation.
 */
export interface InvitationContent {
  coverTitle: string;

  /** Khusus kategori PERNIKAHAN */
  couple?: {
    groomName: string; // Nama Mempelai Pria (*Beserta Gelar Jika Ada)
    groomNickname?: string;
    groomParents?: string; // Nama Orang Tua Mempelai Pria (*Beserta Gelar Jika Ada)
    brideName: string; // Nama Mempelai Wanita (*Beserta Gelar Jika Ada)
    brideNickname?: string;
    brideParents?: string; // Nama Orang Tua Mempelai Wanita (*Beserta Gelar Jika Ada)
  };

  /** Khusus ULANG_TAHUN / KHITANAN_AQIQAH / EVENT_UMUM */
  person?: {
    name: string;
    nickname?: string;
    parentsOrOrganizer?: string;
  };

  /** Link Google Maps Lokasi Acara */
  mapsUrl?: string;

  /** Request Backsound Lagu Undangan */
  requestMusic?: string;

  /** Rangkaian Acara (Akad, Resepsi, dsb.) */
  events: InvitationEvent[];
  sameLocationAsAkad?: boolean;

  /** Cerita Perjalanan Cinta (Love Story) */
  loveStory?: {
    stage: "PERTEMUAN" | "PENDEKATAN" | "LAMARAN" | "MENIKAH" | string;
    title?: string;
    body: string;
  }[];
  needsLoveStoryHelp?: boolean; // Pilihan "Boleh min" vs "Tidak min"

  /** Wedding Gift / Amplop & Kado Fisik */
  weddingGift?: {
    description?: string;
    accounts?: {
      bankName: string;
      accountNumber: string;
      accountName: string;
    }[];
    qrisImageUrl?: string;
    physicalGiftAddress?: string;
  };

  gallery: { mediaId: string; caption?: string; url?: string }[];
  galleryPhotos?: string[]; // Slot foto 1, 2, dst.

  backgroundMusicMediaId?: string;

  /** Ayat suci / kata mutiara */
  quote?: string;

  liveStreamingUrl?: string;

  theme: {
    primaryColor: string;
    fontFamily: string;
  };
}

export interface InvitationEvent {
  name: string; // "Akad Nikah", "Resepsi", "Tiup Lilin", dst.
  date: string; // ISO date
  startTime: string;
  endTime?: string;
  venueName: string;
  venueAddress: string;
  mapsUrl?: string;
  mapsLat?: number;
  mapsLng?: number;
}

export interface RsvpPayload {
  guestPersonalSlug?: string;
  guestNameFallback?: string;
  status: "HADIR" | "TIDAK_HADIR" | "RAGU";
  attendeeCount: number;
  message?: string;
}

export interface GuestImportRow {
  name: string;
  whatsapp?: string;
  invitedCount?: number;
}

export interface PackageFeatureFlags {
  activeDurationDays: number;
  maxGalleryPhotos: number;
  maxGalleryVideos: number;
  maxGuests: number | null;
  customDomainAllowed: boolean;
  watermark: boolean;
  qrCheckinAllowed: boolean;
  digitalGiftAllowed: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

/**
 * Template theme config — disimpan di kolom `themeConfig` (Json) pada model Template.
 */
export interface TemplateThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontDisplay: string;
  layout: "classic" | "modern" | "luxury" | "minimal";
  sections: string[];
}

/**
 * Session user yang di-extend dari NextAuth.
 */
export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
  image?: string | null;
}
