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
    groomName: string;
    groomNickname?: string;
    brideName: string;
    brideNickname?: string;
    groomParents?: string;
    brideParents?: string;
  };

  /** Khusus ULANG_TAHUN / KHITANAN_AQIQAH / EVENT_UMUM */
  person?: {
    name: string;
    nickname?: string;
  };

  events: InvitationEvent[];

  loveStory?: { title: string; body: string }[];

  gallery: { mediaId: string; caption?: string }[];

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
