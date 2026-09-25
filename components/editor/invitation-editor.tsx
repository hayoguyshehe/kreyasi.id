"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Music,
  Palette,
  Gift,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  Info,
  Clock,
  MessageCircle,
  Share2,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/utils";

interface InvitationData {
  id: string;
  slug: string;
  eventTitle: string;
  eventDate: string;
  eventCategory: string; // PERNIKAHAN | ULANG_TAHUN | KHITANAN_AQIQAH | EVENT_UMUM
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "SUSPENDED";
  content: any;
  package: {
    id: string;
    name: string;
    priceIdr: number;
    activeDurationDays: number;
    maxGalleryPhotos: number;
    digitalGiftAllowed?: boolean;
  };
  template: {
    name: string;
    slug: string;
  };
}

export function InvitationEditor({
  initialData,
}: {
  initialData: InvitationData;
}) {
  const router = useRouter();
  const isWedding = initialData.eventCategory === "PERNIKAHAN";
  const content = initialData.content || {};
  const adminWaNumber = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP_NUMBER || "6281234567890";

  // Active section tab
  const [activeSection, setActiveSection] = useState<
    "couple" | "events" | "music" | "story" | "gift" | "gallery" | "settings"
  >("couple");

  // SECTION 1: Mempelai & Keluarga / Tokoh
  const [groomName, setGroomName] = useState(
    content.couple?.groomName || ""
  );
  const [groomNickname, setGroomNickname] = useState(
    content.couple?.groomNickname || ""
  );
  const [groomParents, setGroomParents] = useState(
    content.couple?.groomParents || ""
  );

  const [brideName, setBrideName] = useState(
    content.couple?.brideName || ""
  );
  const [brideNickname, setBrideNickname] = useState(
    content.couple?.brideNickname || ""
  );
  const [brideParents, setBrideParents] = useState(
    content.couple?.brideParents || ""
  );

  const [personName, setPersonName] = useState(
    content.person?.name || ""
  );
  const [parentsOrOrganizer, setParentsOrOrganizer] = useState(
    content.person?.parentsOrOrganizer || ""
  );

  // SECTION 2: Waktu & Lokasi Acara (Akad & Resepsi + Maps)
  const [eventDate, setEventDate] = useState(
    initialData.eventDate
      ? new Date(initialData.eventDate).toISOString().split("T")[0]
      : ""
  );
  const [mapsUrl, setMapsUrl] = useState(
    content.mapsUrl || ""
  );

  // Initial event items lookup
  const initialEvents = Array.isArray(content.events) ? content.events : [];
  const akadEvt = initialEvents.find(
    (e: any) =>
      e.name?.toLowerCase().includes("akad") ||
      e.name?.toLowerCase().includes("utama")
  ) || initialEvents[0] || {};
  const resepsiEvt = initialEvents.find(
    (e: any) =>
      e.name?.toLowerCase().includes("resepsi") ||
      e.name?.toLowerCase().includes("syukuran")
  ) || initialEvents[1] || {};

  const [akadDate, setAkadDate] = useState(
    akadEvt.date
      ? new Date(akadEvt.date).toISOString().split("T")[0]
      : eventDate
  );
  const [akadStartTime, setAkadStartTime] = useState(
    akadEvt.startTime || "08:00 WIB"
  );
  const [akadEndTime, setAkadEndTime] = useState(
    akadEvt.endTime || "10:00 WIB"
  );
  const [akadVenueName, setAkadVenueName] = useState(
    akadEvt.venueName || ""
  );
  const [akadVenueAddress, setAkadVenueAddress] = useState(
    akadEvt.venueAddress || ""
  );

  const [resepsiDate, setResepsiDate] = useState(
    resepsiEvt.date
      ? new Date(resepsiEvt.date).toISOString().split("T")[0]
      : eventDate
  );
  const [resepsiStartTime, setResepsiStartTime] = useState(
    resepsiEvt.startTime || "11:00 WIB"
  );
  const [resepsiEndTime, setResepsiEndTime] = useState(
    resepsiEvt.endTime || "Selesai"
  );
  const [resepsiVenueName, setResepsiVenueName] = useState(
    resepsiEvt.venueName || ""
  );
  const [resepsiVenueAddress, setResepsiVenueAddress] = useState(
    resepsiEvt.venueAddress || ""
  );
  const [sameLocationAsAkad, setSameLocationAsAkad] = useState(
    Boolean(content.sameLocationAsAkad)
  );

  // SECTION 3: Musik & Suasana
  const [requestMusic, setRequestMusic] = useState(
    content.requestMusic || ""
  );
  const [quote, setQuote] = useState(content.quote || "");
  const [liveStreamingUrl, setLiveStreamingUrl] = useState(
    content.liveStreamingUrl || ""
  );

  // SECTION 4: Love Story (4 Fase + Bantuan)
  const initialStory = Array.isArray(content.loveStory) ? content.loveStory : [];
  const getStoryByStage = (stage: string) => {
    const item = initialStory.find((s: any) => s.stage === stage);
    return item ? item.body : "";
  };

  const [storyPertemuan, setStoryPertemuan] = useState(
    getStoryByStage("PERTEMUAN")
  );
  const [storyPendekatan, setStoryPendekatan] = useState(
    getStoryByStage("PENDEKATAN")
  );
  const [storyLamaran, setStoryLamaran] = useState(
    getStoryByStage("LAMARAN")
  );
  const [storyMenikah, setStoryMenikah] = useState(
    getStoryByStage("MENIKAH")
  );
  const [needsLoveStoryHelp, setNeedsLoveStoryHelp] = useState<boolean>(
    content.needsLoveStoryHelp === true
  );

  // SECTION 5: Wedding Gift (Amplop Digital & Kado Fisik)
  const giftData = content.weddingGift || {};
  const giftAccountsList = Array.isArray(giftData.accounts) ? giftData.accounts : [];

  const [giftDescription, setGiftDescription] = useState(
    giftData.description || ""
  );
  const [bank1Name, setBank1Name] = useState(giftAccountsList[0]?.bankName || "BCA");
  const [bank1Number, setBank1Number] = useState(giftAccountsList[0]?.accountNumber || "");
  const [bank1Holder, setBank1Holder] = useState(giftAccountsList[0]?.accountName || "");

  const [bank2Name, setBank2Name] = useState(giftAccountsList[1]?.bankName || "Mandiri");
  const [bank2Number, setBank2Number] = useState(giftAccountsList[1]?.accountNumber || "");
  const [bank2Holder, setBank2Holder] = useState(giftAccountsList[1]?.accountName || "");

  const [bank3Name, setBank3Name] = useState(giftAccountsList[2]?.bankName || "BRI");
  const [bank3Number, setBank3Number] = useState(giftAccountsList[2]?.accountNumber || "");
  const [bank3Holder, setBank3Holder] = useState(giftAccountsList[2]?.accountName || "");

  const [qrisImageUrl, setQrisImageUrl] = useState(giftData.qrisImageUrl || "");
  const [physicalGiftAddress, setPhysicalGiftAddress] = useState(
    giftData.physicalGiftAddress || ""
  );

  // SECTION 6: Galeri Photo
  const maxPhotos = initialData.package.maxGalleryPhotos || 5;
  const initialPhotos: string[] = Array.isArray(content.galleryPhotos)
    ? content.galleryPhotos
    : [];

  const [galleryPhotos, setGalleryPhotos] = useState<string[]>(() => {
    const arr = [...initialPhotos];
    while (arr.length < maxPhotos) {
      arr.push("");
    }
    return arr.slice(0, maxPhotos);
  });

  // SECTION 7: Tautan URL & Pengaturan Publikasi
  const [eventTitle, setEventTitle] = useState(initialData.eventTitle || "");
  const [slug, setSlug] = useState(initialData.slug || "");
  const [primaryColor, setPrimaryColor] = useState(
    content.theme?.primaryColor || "#4C6957"
  );
  const [fontFamily, setFontFamily] = useState(
    content.theme?.fontFamily || "Playfair Display"
  );

  // Status & Feedback
  const [status, setStatus] = useState(initialData.status);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | "warning";
    text: string;
    details?: string[];
  } | null>(null);

  // Handler sama seperti lokasi akad
  const handleToggleSameLocation = (checked: boolean) => {
    setSameLocationAsAkad(checked);
    if (checked) {
      setResepsiVenueName(akadVenueName);
      setResepsiVenueAddress(akadVenueAddress);
    }
  };

  // Compile full content JSON payload
  const buildContentPayload = () => {
    const finalEvents = [
      {
        name: isWedding ? "Akad Nikah" : "Acara Utama",
        date: akadDate || eventDate,
        startTime: akadStartTime,
        endTime: akadEndTime,
        venueName: akadVenueName,
        venueAddress: akadVenueAddress,
        mapsUrl: mapsUrl,
      },
      {
        name: isWedding ? "Resepsi Pernikahan" : "Ramah Tamah / Syukuran",
        date: resepsiDate || eventDate,
        startTime: resepsiStartTime,
        endTime: resepsiEndTime,
        venueName: sameLocationAsAkad ? akadVenueName : resepsiVenueName,
        venueAddress: sameLocationAsAkad ? akadVenueAddress : resepsiVenueAddress,
        mapsUrl: mapsUrl,
      },
    ];

    const finalAccounts = [
      { bankName: bank1Name, accountNumber: bank1Number, accountName: bank1Holder },
      { bankName: bank2Name, accountNumber: bank2Number, accountName: bank2Holder },
      { bankName: bank3Name, accountNumber: bank3Number, accountName: bank3Holder },
    ].filter((acc) => acc.accountNumber?.trim().length > 0);

    const finalLoveStory = [
      { stage: "PERTEMUAN", title: "Pertemuan", body: storyPertemuan },
      { stage: "PENDEKATAN", title: "Pendekatan", body: storyPendekatan },
      { stage: "LAMARAN", title: "Lamaran", body: storyLamaran },
      { stage: "MENIKAH", title: "Menikah", body: storyMenikah },
    ].filter((s) => s.body?.trim().length > 0);

    const finalGalleryPhotos = galleryPhotos.filter(
      (url) => url && url.trim().length > 0
    );

    return {
      ...content,
      coverTitle: eventTitle,
      couple: isWedding
        ? {
            groomName,
            groomNickname,
            groomParents,
            brideName,
            brideNickname,
            brideParents,
          }
        : undefined,
      person: !isWedding
        ? {
            name: personName,
            parentsOrOrganizer,
          }
        : undefined,
      mapsUrl,
      requestMusic,
      events: finalEvents,
      sameLocationAsAkad,
      loveStory: finalLoveStory,
      needsLoveStoryHelp,
      weddingGift: {
        description: giftDescription,
        accounts: finalAccounts,
        qrisImageUrl: qrisImageUrl.trim() || undefined,
        physicalGiftAddress: physicalGiftAddress.trim() || undefined,
      },
      galleryPhotos: finalGalleryPhotos,
      quote,
      liveStreamingUrl,
      theme: {
        primaryColor,
        fontFamily,
      },
    };
  };

  // 1. SIMPAN DRAFT (Bisa disimpan kapan saja walaupun data belum lengkap)
  const handleSaveDraft = async () => {
    setIsSaving(true);
    setFeedback(null);

    const updatedContent = buildContentPayload();

    try {
      const response = await fetch(`/api/my/invitations/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: eventTitle || (isWedding ? `${groomNickname || "Mempelai"} & ${brideNickname || "Mempelai"}` : personName),
          eventDate: eventDate || akadDate || new Date().toISOString(),
          slug,
          content: updatedContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Gagal menyimpan draft undangan.",
        });
        setIsSaving(false);
        return;
      }

      setFeedback({
        type: "success",
        text: "Draft berhasil disimpan! Anda dapat melanjutkan pengisian data kapan saja.",
      });
      setIsSaving(false);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi gangguan koneksi saat menyimpan draft.",
      });
      setIsSaving(false);
    }
  };

  // 2. PUBLIKASIKAN UNDANGAN (Validasi ketat: Data utama wajib terisi, data pendukung opsional)
  const handlePublish = async () => {
    setIsPublishing(true);
    setFeedback(null);

    const missingFields: string[] = [];

    // Validasi Tokoh / Mempelai
    if (isWedding) {
      if (!groomName.trim()) missingFields.push("Nama Mempelai Pria (*Beserta Gelar Jika Ada)");
      if (!brideName.trim()) missingFields.push("Nama Mempelai Wanita (*Beserta Gelar Jika Ada)");
    } else {
      if (!personName.trim()) missingFields.push("Nama Tokoh / Yang Berbahagia (*Beserta Gelar Jika Ada)");
    }

    // Tanggal Acara
    if (!eventDate) missingFields.push("Tanggal Acara");

    // Link Google Maps
    if (!mapsUrl.trim()) missingFields.push("Link Google Maps Lokasi Acara");

    // Rincian Akad
    if (!akadDate) missingFields.push("Tanggal Akad");
    if (!akadStartTime.trim()) missingFields.push("Waktu Akad");
    if (!akadVenueAddress.trim()) missingFields.push("Lokasi Akad");

    // Rincian Resepsi
    if (!resepsiDate) missingFields.push("Tanggal Resepsi");
    if (!resepsiStartTime.trim()) missingFields.push("Waktu Resepsi");
    const actualResepsiAddress = sameLocationAsAkad ? akadVenueAddress : resepsiVenueAddress;
    if (!actualResepsiAddress.trim()) missingFields.push("Lokasi Resepsi");

    // Jika ada field utama yang kosong
    if (missingFields.length > 0) {
      setIsPublishing(false);
      setFeedback({
        type: "warning",
        text: "Sebelum dipublikasikan menjadi undangan aktif, mohon lengkapi data utama berikut:",
        details: missingFields,
      });
      return;
    }

    // First auto-save the latest values
    const updatedContent = buildContentPayload();

    try {
      const saveRes = await fetch(`/api/my/invitations/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle: eventTitle || (isWedding ? `${groomNickname || groomName} & ${brideNickname || brideName}` : personName),
          eventDate: eventDate,
          slug,
          content: updatedContent,
        }),
      });

      if (!saveRes.ok) {
        const err = await saveRes.json();
        setFeedback({
          type: "error",
          text: err.error || "Gagal menyimpan perubahan sebelum publikasi.",
        });
        setIsPublishing(false);
        return;
      }

      // Proceed to publish
      const pubRes = await fetch(`/api/my/invitations/${initialData.id}/publish`, {
        method: "POST",
      });

      const pubData = await pubRes.json();

      if (!pubRes.ok) {
        setFeedback({
          type: "error",
          text: pubData.error || "Gagal mempublikasikan undangan.",
          details: pubData.missingFields,
        });
        setIsPublishing(false);
        return;
      }

      setStatus("PUBLISHED");
      setFeedback({
        type: "success",
        text: "Selamat! Undangan digital Anda telah aktif dan siap dibagikan kepada para tamu undangan.",
      });
      setIsPublishing(false);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi gangguan saat mempublikasikan undangan.",
      });
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAE3D8]">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invitations"
            className="p-2 rounded-xl text-[#7A6D63] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold font-serif text-[#2A211B] truncate max-w-md">
                {eventTitle || (isWedding ? "Undangan Pernikahan" : "Editor Undangan")}
              </h1>
              <Badge
                variant={
                  status === "PUBLISHED"
                    ? "success"
                    : status === "DRAFT"
                    ? "warning"
                    : "default"
                }
              >
                {status}
              </Badge>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Paket: <strong className="text-[#2A211B]">{initialData.package.name}</strong> • Template:{" "}
              <strong className="text-[#2A211B]">{initialData.template.name}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`/u/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="outline" size="sm" className="gap-1.5 hover:border-[#4C6957] hover:text-[#4C6957]">
              <ExternalLink className="w-4 h-4" />
              <span>Preview Undangan</span>
            </Button>
          </a>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            isLoading={isSaving}
            className="gap-1.5 border-[#DFC798] hover:border-[#C5A059] text-[#2A211B]"
          >
            <Save className="w-4 h-4 text-[#C5A059]" />
            <span>Simpan Draft</span>
          </Button>

          {status === "DRAFT" && (
            <Button
              variant="sage"
              size="sm"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="gap-1.5 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publikasikan Undangan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs space-y-2 animate-in fade-in duration-200 ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : feedback.type === "warning"
              ? "bg-[#FFF9ED] border border-[#DFC798] text-[#8C6D2B]"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          <div className="flex items-center gap-2 font-semibold">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : feedback.type === "warning" ? (
              <AlertCircle className="w-4 h-4 text-[#C5A059] shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>

          {feedback.details && feedback.details.length > 0 && (
            <ul className="list-disc list-inside space-y-1 pl-6 pt-1 text-[11px] font-medium">
              {feedback.details.map((field, idx) => (
                <li key={idx} className="text-[#8C6D2B]">{field}</li>
              ))}
              <li className="text-[#6B5E55] italic list-none pt-1">
                Catatan: Data pendukung seperti Love Story, Galeri Foto, dan Amplop Kado bersifat opsional dan dapat Anda lengkapi nanti.
              </li>
            </ul>
          )}
        </div>
      )}

      {/* Section Navigators */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EAE3D8]">
        {[
          { id: "couple", label: isWedding ? "1. Data Mempelai" : "1. Data Tokoh", icon: <Heart className="w-3.5 h-3.5" /> },
          { id: "events", label: "2. Waktu & Lokasi Acara", icon: <MapPin className="w-3.5 h-3.5" /> },
          { id: "music", label: "3. Musik & Suasana", icon: <Music className="w-3.5 h-3.5" /> },
          { id: "story", label: "4. Love Story", icon: <Sparkles className="w-3.5 h-3.5" />, badge: "Opsional" },
          { id: "gift", label: "5. Wedding Gift", icon: <Gift className="w-3.5 h-3.5" />, badge: initialData.package.digitalGiftAllowed ? "Aktif" : "Sesuai Paket" },
          { id: "gallery", label: "6. Galeri Photo", icon: <ImageIcon className="w-3.5 h-3.5" />, badge: `${maxPhotos} Foto` },
          { id: "settings", label: "7. Tautan & Publikasi", icon: <Palette className="w-3.5 h-3.5" /> },
        ].map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setActiveSection(sec.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSection === sec.id
                ? "bg-white text-[#4C6957] border border-[#DFC798] shadow-xs"
                : "text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4]"
            }`}
          >
            {sec.icon}
            <span>{sec.label}</span>
            {sec.badge && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FAF7F2] border border-[#EAE3D8] text-[#7A6D63]">
                {sec.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* SECTION 1: DATA MEMPELAI / TOKOH */}
      {activeSection === "couple" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <h2 className="text-lg font-bold font-serif text-[#2A211B]">
              {isWedding ? "Data Mempelai & Keluarga" : "Data Tokoh / Penyelenggara Acara"}
            </h2>
            <p className="text-xs text-[#6B5E55]">
              {isWedding
                ? "Masukkan nama lengkap mempelai pria dan wanita beserta gelar kehormatan / akademis."
                : "Masukkan nama tokoh atau anak yang merayakan acara beserta gelar jika ada."}
            </p>
          </div>

          {isWedding ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mempelai Pria */}
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4C6957]">
                    Mempelai Pria
                  </span>
                  <span className="text-[10px] text-red-600 font-semibold">* Wajib diisi</span>
                </div>

                <div className="space-y-1.5">
                  <Input
                    label="Nama Mempelai Pria (*Beserta Gelar Jika Ada)"
                    placeholder="Contoh: Raden Arya Pratama, S.T., M.Kom"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-[#7A6D63]">
                    Cantumkan gelar akademis, bangsawan, atau keagamaan jika ada.
                  </p>
                </div>

                <Input
                  label="Nama Panggilan Pria"
                  placeholder="Contoh: Arya"
                  value={groomNickname}
                  onChange={(e) => setGroomNickname(e.target.value)}
                />

                <div className="space-y-1.5">
                  <Input
                    label="Nama Orang Tua Mempelai Pria (*Beserta Gelar Jika Ada)"
                    placeholder="Contoh: Bpk. Prof. Dr. Ir. H. Bambang Hartono, M.Eng & Ibu Hj. Siti Aminah, S.Pd"
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                  />
                  <p className="text-[11px] text-[#7A6D63]">
                    Contoh: Bpk. ... & Ibu ... (Beserta gelar jika ada)
                  </p>
                </div>
              </div>

              {/* Mempelai Wanita */}
              <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D8]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4C6957]">
                    Mempelai Wanita
                  </span>
                  <span className="text-[10px] text-red-600 font-semibold">* Wajib diisi</span>
                </div>

                <div className="space-y-1.5">
                  <Input
                    label="Nama Mempelai Wanita (*Beserta Gelar Jika Ada)"
                    placeholder="Contoh: drg. Annisa Larasati Putri, Sp.Ort"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                    required
                  />
                  <p className="text-[11px] text-[#7A6D63]">
                    Cantumkan gelar akademis, bangsawan, atau keagamaan jika ada.
                  </p>
                </div>

                <Input
                  label="Nama Panggilan Wanita"
                  placeholder="Contoh: Annisa"
                  value={brideNickname}
                  onChange={(e) => setBrideNickname(e.target.value)}
                />

                <div className="space-y-1.5">
                  <Input
                    label="Nama Orang Tua Mempelai Wanita (*Beserta Gelar Jika Ada)"
                    placeholder="Contoh: Bpk. H. Ahmad Fauzi, S.E., M.M & Ibu Hj. Nur Aisyah, S.Ag"
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                  />
                  <p className="text-[11px] text-[#7A6D63]">
                    Contoh: Bpk. ... & Ibu ... (Beserta gelar jika ada)
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-xl space-y-4">
              <Input
                label="Nama Tokoh / Yang Berbahagia (*Beserta Gelar Jika Ada)"
                placeholder="Contoh: Muhammad Rayyan Alfatih, B.A."
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                required
              />
              <Input
                label="Nama Orang Tua / Penyelenggara (*Beserta Gelar Jika Ada)"
                placeholder="Contoh: Bpk. H. Ahmad & Ibu Hj. Aminah"
                value={parentsOrOrganizer}
                onChange={(e) => setParentsOrOrganizer(e.target.value)}
              />
            </div>
          )}

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
              <Save className="w-4 h-4 text-[#C5A059]" />
              <span>Simpan Draft</span>
            </Button>
            <Button variant="sage" size="sm" onClick={() => setActiveSection("events")}>
              <span>Lanjut: Waktu & Lokasi Acara</span>
            </Button>
          </div>
        </Card>
      )}

      {/* SECTION 2: WAKTU & LOKASI ACARA */}
      {activeSection === "events" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <h2 className="text-lg font-bold font-serif text-[#2A211B]">
              Waktu, Lokasi Acara & Google Maps
            </h2>
            <p className="text-xs text-[#6B5E55]">
              Atur tanggal acara utama, link navigasi peta lokasi Google Maps, serta detail rangkaian Akad & Resepsi.
            </p>
          </div>

          {/* Tanggal Acara Utama & Link Google Maps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8]">
            <div className="space-y-1.5">
              <Input
                label="Tanggal Acara Utama"
                type="date"
                value={eventDate}
                onChange={(e) => {
                  setEventDate(e.target.value);
                  if (!akadDate) setAkadDate(e.target.value);
                  if (!resepsiDate) setResepsiDate(e.target.value);
                }}
                required
              />
              <p className="text-[11px] text-[#7A6D63]">
                Tanggal ini akan menjadi patokan hitung mundur (countdown) di undangan.
              </p>
            </div>

            <div className="space-y-1.5">
              <Input
                label="Link Google Maps Lokasi Acara"
                placeholder="https://maps.app.goo.gl/... atau https://google.com/maps/..."
                value={mapsUrl}
                onChange={(e) => setMapsUrl(e.target.value)}
                required
              />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-[11px]">
                <span className="text-[#6B5E55]">
                  chat admin jika terkendala dalam mengambil link dari google maps
                </span>
                <a
                  href={`https://wa.me/${adminWaNumber}?text=${encodeURIComponent("Halo Admin Kreyasi, saya terkendala mengambil link Google Maps untuk undangan saya. Mohon bantuannya.")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#4C6957] font-semibold hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat Admin WA</span>
                </a>
              </div>
            </div>
          </div>

          {/* Rangkaian Akad & Resepsi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Rincian Akad */}
            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D8] space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4C6957]">
                  {isWedding ? "Rangkaian Akad Nikah" : "Rangkaian Acara Utama"}
                </span>
                <span className="text-[10px] text-red-600 font-semibold">* Wajib diisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Tanggal Akad"
                  type="date"
                  value={akadDate}
                  onChange={(e) => setAkadDate(e.target.value)}
                  required
                />
                <Input
                  label="Waktu Akad"
                  placeholder="Contoh: 08:00 WIB"
                  value={akadStartTime}
                  onChange={(e) => setAkadStartTime(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Nama Tempat / Gedung Akad"
                placeholder="Contoh: Masjid Agung Kalianda / Kediaman Mempelai"
                value={akadVenueName}
                onChange={(e) => {
                  setAkadVenueName(e.target.value);
                  if (sameLocationAsAkad) setResepsiVenueName(e.target.value);
                }}
              />

              <div className="space-y-1.5">
                <Textarea
                  label="Lokasi Akad (Alamat Lengkap)"
                  placeholder="contoh : Ragom Mufakat III, Kel. Way Urang, Kec. Kalianda, Kab. Lampung Selatan, Lampung"
                  value={akadVenueAddress}
                  onChange={(e) => {
                    setAkadVenueAddress(e.target.value);
                    if (sameLocationAsAkad) setResepsiVenueAddress(e.target.value);
                  }}
                  required
                />
                <p className="text-[11px] text-[#7A6D63]">
                  contoh : Ragom Mufakat III, Kel. Way Urang, Kec. Kalianda, Kab. Lampung Selatan, Lampung
                </p>
              </div>
            </div>

            {/* Rincian Resepsi */}
            <div className="p-6 rounded-2xl bg-white border border-[#EAE3D8] space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE3D8]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4C6957]">
                  {isWedding ? "Rangkaian Resepsi" : "Ramah Tamah / Syukuran"}
                </span>
                <span className="text-[10px] text-red-600 font-semibold">* Wajib diisi</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Tanggal Resepsi"
                  type="date"
                  value={resepsiDate}
                  onChange={(e) => setResepsiDate(e.target.value)}
                  required
                />
                <Input
                  label="Waktu Resepsi"
                  placeholder="Contoh: 11:00 WIB - Selesai"
                  value={resepsiStartTime}
                  onChange={(e) => setResepsiStartTime(e.target.value)}
                  required
                />
              </div>

              {/* Checkbox sama seperti lokasi akad */}
              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#DFC798] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="sameLocationCheck"
                    checked={sameLocationAsAkad}
                    onChange={(e) => handleToggleSameLocation(e.target.checked)}
                    className="w-4 h-4 text-[#4C6957] rounded border-[#DFC798] focus:ring-[#4C6957] cursor-pointer"
                  />
                  <label
                    htmlFor="sameLocationCheck"
                    className="text-xs font-semibold text-[#2A211B] cursor-pointer"
                  >
                    sama seperti lokasi akad
                  </label>
                </div>
                <span className="text-[10px] text-[#7A6D63]">Otomatis salin dari akad</span>
              </div>

              <Input
                label="Nama Tempat / Gedung Resepsi"
                placeholder="Contoh: Gedung Serba Guna / Sesuai Lokasi Akad"
                value={sameLocationAsAkad ? akadVenueName : resepsiVenueName}
                onChange={(e) => setResepsiVenueName(e.target.value)}
                disabled={sameLocationAsAkad}
              />

              <div className="space-y-1.5">
                <Textarea
                  label="Lokasi Resepsi (Alamat Lengkap)"
                  placeholder="contoh : Ragom Mufakat III, Kel. Way Urang, Kec. Kalianda, Kab. Lampung Selatan, Lampung"
                  value={sameLocationAsAkad ? akadVenueAddress : resepsiVenueAddress}
                  onChange={(e) => setResepsiVenueAddress(e.target.value)}
                  disabled={sameLocationAsAkad}
                  required
                />
                <p className="text-[11px] text-[#7A6D63]">
                  contoh : Ragom Mufakat III, Kel. Way Urang, Kec. Kalianda, Kab. Lampung Selatan, Lampung
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={() => setActiveSection("couple")}>
              <span>Kembali</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>
              <Button variant="sage" size="sm" onClick={() => setActiveSection("music")}>
                <span>Lanjut: Musik & Suasana</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 3: MUSIK & SUASANA */}
      {activeSection === "music" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <h2 className="text-lg font-bold font-serif text-[#2A211B]">
              Musik Latar & Suasana Undangan
            </h2>
            <p className="text-xs text-[#6B5E55]">
              Sampaikan lagu favorit pilihan Anda untuk dipasang sebagai musik latar (backsound) saat tamu membuka undangan.
            </p>
          </div>

          <div className="space-y-6 max-w-2xl">
            <div className="space-y-2">
              <Input
                label="Request Backsound Lagu Undangan"
                placeholder="Contoh: Kahitna - Menikahimu / Payung Teduh - Akad / Ed Sheeran - Perfect"
                value={requestMusic}
                onChange={(e) => setRequestMusic(e.target.value)}
              />
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] text-xs text-[#6B5E55] flex items-start gap-2.5">
                <Music className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                <p>
                  Tuliskan judul lagu & nama artis, atau tempel tautan Spotify / YouTube. Tim Kreyasi akan menyesuaikan audio pengiring terbaik untuk undangan Anda.
                </p>
              </div>
            </div>

            <Textarea
              label="Ayat Suci / Kutipan Mutiara (Quotes)"
              placeholder="Contoh: Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri... (QS. Ar-Rum: 21)"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />

            <Input
              label="Link Siaran Langsung / Live Streaming (Opsional)"
              placeholder="https://youtube.com/live/... atau https://zoom.us/j/..."
              value={liveStreamingUrl}
              onChange={(e) => setLiveStreamingUrl(e.target.value)}
            />
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={() => setActiveSection("events")}>
              <span>Kembali</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>
              <Button variant="sage" size="sm" onClick={() => setActiveSection("story")}>
                <span>Lanjut: Love Story</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 4: LOVE STORY (4 FASE + BANTUAN PENULISAN) */}
      {activeSection === "story" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-[#2A211B]">
                Love Story (Cerita Perjalanan Cinta)
              </h2>
              <Badge variant="outline" className="text-[10px]">
                Data Pendukung / Opsional
              </Badge>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Berikan cerita perjalanan cinta kalian. Bagikan kenangan indah dari pertama kali bertemu hingga pelaminan.
            </p>
          </div>

          <div className="space-y-6">
            {/* 4 Fase Cerita */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-2">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  Love Story PERTEMUAN
                </span>
                <Textarea
                  placeholder="Ceritakan momen pertama kali kalian saling mengenal atau bertatap muka..."
                  value={storyPertemuan}
                  onChange={(e) => setStoryPertemuan(e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-2">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  Love Story PENDEKATAN
                </span>
                <Textarea
                  placeholder="Ceritakan masa-masa pendekatan, suka duka, dan keyakinan dalam menjalin hubungan..."
                  value={storyPendekatan}
                  onChange={(e) => setStoryPendekatan(e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-2">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  Love Story LAMARAN
                </span>
                <Textarea
                  placeholder="Ceritakan momen sakral pertunangan atau lamaran resmi di hadapan keluarga..."
                  value={storyLamaran}
                  onChange={(e) => setStoryLamaran(e.target.value)}
                />
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-2">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  Love Story MENIKAH
                </span>
                <Textarea
                  placeholder="Ungkapkan harapan, doa, dan lembaran baru kehidupan berumah tangga kalian..."
                  value={storyMenikah}
                  onChange={(e) => setStoryMenikah(e.target.value)}
                />
              </div>
            </div>

            {/* Bantuan Penulisan Love Story */}
            <div className="p-5 rounded-2xl bg-white border border-[#DFC798] space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C5A059]" />
                <h3 className="text-xs font-bold text-[#2A211B] uppercase tracking-wider">
                  Perlu Bantuan Dalam Menulis Love Story ?
                </h3>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 text-xs text-[#2A211B] cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="loveStoryHelp"
                    checked={needsLoveStoryHelp === true}
                    onChange={() => setNeedsLoveStoryHelp(true)}
                    className="w-4 h-4 text-[#4C6957] border-[#DFC798] focus:ring-[#4C6957]"
                  />
                  <span>Boleh min</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-[#2A211B] cursor-pointer font-medium">
                  <input
                    type="radio"
                    name="loveStoryHelp"
                    checked={needsLoveStoryHelp === false}
                    onChange={() => setNeedsLoveStoryHelp(false)}
                    className="w-4 h-4 text-[#4C6957] border-[#DFC798] focus:ring-[#4C6957]"
                  />
                  <span>Tidak min</span>
                </label>
              </div>

              {needsLoveStoryHelp && (
                <div className="p-3.5 rounded-xl bg-[#FFF9ED] border border-[#DFC798]/60 text-xs text-[#8C6D2B] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    ❤️ <strong>Bagus sekali!</strong> Tuliskan saja poin-poin cerita singkat di atas, tim penulis profesional Kreyasi akan membantu merangkai kalimatnya menjadi narasi yang puitis dan berkesan.
                  </div>
                  <a
                    href={`https://wa.me/${adminWaNumber}?text=${encodeURIComponent("Halo Admin Kreyasi, saya ingin dibantu merangkai Love Story untuk undangan pernikahan saya. Mohon arahannya.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4C6957] text-white text-xs font-semibold hover:bg-[#385041] transition-colors shrink-0 shadow-xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Hubungi Penulis Kreyasi</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={() => setActiveSection("music")}>
              <span>Kembali</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>
              <Button variant="sage" size="sm" onClick={() => setActiveSection("gift")}>
                <span>Lanjut: Wedding Gift</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 5: WEDDING GIFT (AMPLOP DIGITAL & KADO FISIK) */}
      {activeSection === "gift" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-[#2A211B]">
                Wedding Gift (Amplop Digital & Kado Fisik)
              </h2>
              <Badge variant="outline" className="text-[10px]">
                Data Pendukung / Opsional
              </Badge>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Kelola nomor rekening bank, QRIS digital, dan alamat penerimaan kado fisik untuk tamu.
            </p>
          </div>

          {/* Package Limit Check */}
          {!initialData.package.digitalGiftAllowed && (
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#DFC798] flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#2A211B]">
                  Fitur Amplop Digital Terkunci pada Paket {initialData.package.name}
                </p>
                <p className="text-[11px] text-[#6B5E55] leading-relaxed">
                  Fitur amplop digital dan QRIS hanya aktif pada paket yang mendukung (Paket Premium / Eksklusif). Anda tetap dapat mengisi data ini untuk persiapan jika nanti meng-upgrade paket Anda.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Description (optional) */}
            <Textarea
              label="Description (optional)"
              placeholder="Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, dapat melalui rekening berikut:"
              value={giftDescription}
              onChange={(e) => setGiftDescription(e.target.value)}
            />

            {/* Rekening 1, 2, 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* No Rekening 1 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-3">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  No Rekening 1
                </span>
                <Input
                  label="Nama Bank / E-Wallet"
                  placeholder="Contoh: BCA / Mandiri / GoPay"
                  value={bank1Name}
                  onChange={(e) => setBank1Name(e.target.value)}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="Contoh: 1234567890"
                  value={bank1Number}
                  onChange={(e) => setBank1Number(e.target.value)}
                />
                <Input
                  label="Atas Nama (Pemilik Rekening)"
                  placeholder="Contoh: Raden Arya Pratama"
                  value={bank1Holder}
                  onChange={(e) => setBank1Holder(e.target.value)}
                />
              </div>

              {/* No Rekening 2 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-3">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  No Rekening 2
                </span>
                <Input
                  label="Nama Bank / E-Wallet"
                  placeholder="Contoh: Mandiri / BNI / OVO"
                  value={bank2Name}
                  onChange={(e) => setBank2Name(e.target.value)}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="Contoh: 0987654321"
                  value={bank2Number}
                  onChange={(e) => setBank2Number(e.target.value)}
                />
                <Input
                  label="Atas Nama (Pemilik Rekening)"
                  placeholder="Contoh: Annisa Larasati"
                  value={bank2Holder}
                  onChange={(e) => setBank2Holder(e.target.value)}
                />
              </div>

              {/* No Rekening 3 */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-3">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  No Rekening 3
                </span>
                <Input
                  label="Nama Bank / E-Wallet"
                  placeholder="Contoh: BRI / BSI / Dana"
                  value={bank3Name}
                  onChange={(e) => setBank3Name(e.target.value)}
                />
                <Input
                  label="Nomor Rekening"
                  placeholder="Contoh: 5432167890"
                  value={bank3Number}
                  onChange={(e) => setBank3Number(e.target.value)}
                />
                <Input
                  label="Atas Nama (Pemilik Rekening)"
                  placeholder="Contoh: Pasangan Mempelai"
                  value={bank3Holder}
                  onChange={(e) => setBank3Holder(e.target.value)}
                />
              </div>
            </div>

            {/* QRIS & Alamat Pengiriman Hadiah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-3">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  QRIS (Pembayaran Digital)
                </span>
                <Input
                  label="Tautan Gambar QRIS"
                  placeholder="https://.../qris.jpg"
                  value={qrisImageUrl}
                  onChange={(e) => setQrisImageUrl(e.target.value)}
                />
                <p className="text-[11px] text-[#7A6D63]">
                  Masukkan link gambar QRIS statis dari M-Banking atau dompet digital Anda.
                </p>
                {qrisImageUrl && (
                  <div className="p-2 rounded-xl bg-white border border-[#EAE3D8] inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={qrisImageUrl}
                      alt="Preview QRIS"
                      className="w-32 h-32 object-contain rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-3">
                <span className="text-xs font-bold text-[#4C6957] font-serif uppercase tracking-wider block">
                  Alamat Pengiriman Hadiah (Kado Fisik)
                </span>
                <Textarea
                  placeholder="Contoh: Jl. Melati No. 45, RT 02/RW 04, Kel. Way Urang, Kalianda, Lampung Selatan (Penerima: Annisa / Arya - 08123456789)"
                  value={physicalGiftAddress}
                  onChange={(e) => setPhysicalGiftAddress(e.target.value)}
                />
                <p className="text-[11px] text-[#7A6D63]">
                  Alamat pengiriman fisik untuk tamu yang ingin mengirimkan kado/parsel secara langsung.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={() => setActiveSection("story")}>
              <span>Kembali</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>
              <Button variant="sage" size="sm" onClick={() => setActiveSection("gallery")}>
                <span>Lanjut: Galeri Photo</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 6: GALERI PHOTO */}
      {activeSection === "gallery" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-serif text-[#2A211B]">
                Galeri Photo Acara
              </h2>
              <Badge variant="outline" className="text-[10px]">
                Data Pendukung / Opsional • Kuota: {maxPhotos} Foto
              </Badge>
            </div>
            <p className="text-xs text-[#6B5E55]">
              Kirimkan foto-foto kenangan terbaik Anda untuk menghiasi galeri undangan.
            </p>
          </div>

          {/* Hint WhatsApp Warning */}
          <div className="p-4 rounded-2xl bg-[#FFF9ED] border border-[#DFC798] flex items-start gap-3">
            <Info className="w-5 h-5 text-[#8C6D2B] shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-[#2A211B]">
                Usahakan File foto besar bukan hasil download dari whatsapp
              </p>
              <p className="text-[11px] text-[#6B5E55] leading-relaxed">
                Foto yang diunduh dari WhatsApp sudah terkompresi resolusinya sehingga tampak buram/pecah saat dibuka di layar laptop atau tablet tamu. Gunakan file asli dari kamera/Google Drive.
              </p>
            </div>
          </div>

          {/* Photo Slots */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {galleryPhotos.map((photoUrl, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] space-y-2"
                >
                  <label className="block text-xs font-bold text-[#2A211B]">
                    Silahkan Kirim Foto-foto yang akan digunakan {idx + 1}
                  </label>
                  <Input
                    placeholder="Masukkan URL foto (https://.../foto.jpg)"
                    value={photoUrl}
                    onChange={(e) => {
                      const updated = [...galleryPhotos];
                      updated[idx] = e.target.value;
                      setGalleryPhotos(updated);
                    }}
                  />
                  {photoUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-[#EAE3D8] bg-white">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photoUrl}
                        alt={`Foto slot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-[#EAE3D8]">
            <Button variant="outline" size="sm" onClick={() => setActiveSection("gift")}>
              <span>Kembali</span>
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleSaveDraft} isLoading={isSaving}>
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>
              <Button variant="sage" size="sm" onClick={() => setActiveSection("settings")}>
                <span>Lanjut: Tautan & Publikasi</span>
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* SECTION 7: TAUTAN & PUBLIKASI */}
      {activeSection === "settings" && (
        <Card variant="default" className="p-6 md:p-8 space-y-6 border-[#EAE3D8] shadow-xs">
          <div className="border-b border-[#EAE3D8] pb-4 space-y-1">
            <h2 className="text-lg font-bold font-serif text-[#2A211B]">
              Tautan URL & Pengaturan Publikasi
            </h2>
            <p className="text-xs text-[#6B5E55]">
              Atur tautan kustom undangan Anda dan terapkan warna tema favorit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
            <Input
              label="Judul Resmi Undangan"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              required
            />

            <div className="space-y-1.5">
              <Input
                label="Tautan URL Undangan"
                hint="kreyasi.id/u/..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <p className="text-[11px] text-[#7A6D63]">
                Tautan publik: <strong>kreyasi.id/u/{slug}</strong>
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2A211B]">
                Warna Aksen Primer
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-[#6B5E55]">
                  {primaryColor}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#2A211B]">
                Pilihan Gaya Tipografi
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full rounded-xl bg-white border border-[#EAE3D8] p-2.5 text-xs text-[#2A211B]"
              >
                <option value="Playfair Display">Playfair Display (Klasik Elegan & Romantis)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                <option value="Cinzel">Cinzel (Royal Luxury)</option>
                <option value="Great Vibes">Great Vibes (Kaligrafi Tradisi)</option>
              </select>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#EAE3D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-[#2A211B]">
                Status Undangan Saat Ini: <span className="uppercase text-[#4C6957]">{status}</span>
              </p>
              <p className="text-[11px] text-[#6B5E55] mt-0.5">
                {status === "PUBLISHED"
                  ? "Undangan sudah aktif dan dapat diakses oleh publik serta tamu."
                  : "Undangan masih berstatus Draft dan belum dapat dilihat tamu hingga Anda klik Publikasikan."}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveDraft}
                isLoading={isSaving}
                className="border-[#DFC798] text-[#2A211B]"
              >
                <Save className="w-4 h-4 text-[#C5A059]" />
                <span>Simpan Draft</span>
              </Button>

              {status === "DRAFT" && (
                <Button
                  variant="sage"
                  size="sm"
                  onClick={handlePublish}
                  isLoading={isPublishing}
                  className="gap-2 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Publikasikan Sekarang</span>
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 rounded-2xl bg-white border border-[#EAE3D8] shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-[#6B5E55]">
          💡 Tips: Anda dapat menyimpan draft kapan saja dan melengkapinya bertahap.
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleSaveDraft}
            isLoading={isSaving}
            className="gap-2 border-[#DFC798] text-[#2A211B]"
          >
            <Save className="w-4 h-4 text-[#C5A059]" />
            <span>Simpan Seluruh Perubahan (Draft)</span>
          </Button>

          {status === "DRAFT" && (
            <Button
              variant="sage"
              size="md"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Publikasikan Undangan</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
