"use client";

import React, { useState, useEffect } from "react";
import { EnvelopeCover } from "@/components/invitation/envelope-cover";
import { MusicPlayer } from "@/components/invitation/music-player";
import { CountdownTimer } from "@/components/invitation/countdown-timer";
import { EventSection } from "@/components/invitation/event-section";
import { GallerySection } from "@/components/invitation/gallery-section";
import { RsvpForm } from "@/components/invitation/rsvp-form";
import { GuestbookSection } from "@/components/invitation/guestbook-section";
import { DigitalGiftSection } from "@/components/invitation/digital-gift-section";
import { LoveStorySection } from "@/components/invitation/love-story-section";
import { Heart, Sparkles, Video } from "lucide-react";
import { formatDateIndonesia } from "@/lib/utils";
import { LottiePlayer } from "@/components/invitation/lottie-player";
import type { TemplateSectionConfig } from "@/types";

interface InvitationViewProps {
  invitation: any;
  guestName?: string | null;
  guestPersonalSlug?: string | null;
  initialOpen?: boolean;
}

export function InvitationView({
  invitation,
  guestName,
  guestPersonalSlug,
  initialOpen = false,
}: InvitationViewProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(initialOpen);
  const content = invitation.content || {};
  const couple = content.couple;
  const person = content.person;
  const theme = content.theme || { primaryColor: "#C5A059", fontFamily: "Plus Jakarta Sans" };
  const templateTheme = invitation.template?.themeConfig || {};
  const templateAssets: any[] = invitation.template?.assets || [];

  const getAssetUrlByKey = (key?: string): string | null => {
    if (!key) return null;
    const found = templateAssets.find((a) => a.key === key);
    return found?.url || null;
  };

  const heroLottieUrl =
    getAssetUrlByKey("hero-animation") ||
    getAssetUrlByKey("cover-animation") ||
    getAssetUrlByKey("header-animation");

  const sealLottieUrl =
    getAssetUrlByKey("envelope-seal") ||
    getAssetUrlByKey("wax-seal");
  const sealImageUrl =
    getAssetUrlByKey("seal-image") ||
    getAssetUrlByKey("monogram-seal");

  // Section order from template config, or fallback to default
  const rawSections: (string | TemplateSectionConfig)[] = templateTheme.sections || [
    "cover",
    "quote",
    "couple",
    "countdown",
    "events",
    "love-story",
    "gallery",
    "gift",
    "rsvp",
    "guestbook",
    "closing",
  ];

  // Combine media from DB with galleryPhotos in content
  const dbMedia = (invitation.media || []).map((m: any) => ({
    id: m.id,
    url: m.fileUrl || m.url,
    type: m.mediaType || m.type || "PHOTO",
  }));
  const contentMedia = (content.galleryPhotos || [])
    .filter(Boolean)
    .map((url: string, idx: number) => ({
      id: `content-photo-${idx}`,
      url,
      type: "PHOTO",
    }));
  const galleryMedia = dbMedia.length > 0 ? dbMedia : contentMedia;

  // Combine gift accounts from DB with weddingGift in content
  const dbAccounts = invitation.giftAccounts || [];
  const contentAccounts = (content.weddingGift?.accounts || [])
    .filter((a: any) => a.accountNumber || a.bankName)
    .map((a: any, idx: number) => ({
      id: `gift-${idx}`,
      type: "BANK",
      bankName: a.bankName,
      accountNumber: a.accountNumber,
      accountName: a.accountName,
      qrisImageUrl: idx === 0 ? content.weddingGift?.qrisImageUrl : null,
    }));
  const giftAccounts = dbAccounts.length > 0 ? dbAccounts : contentAccounts;

  // Increment view counter once per load
  useEffect(() => {
    fetch(`/api/invitations/${invitation.slug}/view`, { method: "POST" }).catch(() => {});
  }, [invitation.slug]);

  // Helper: get couple display names
  const groomDisplayName = couple?.groomNickname || couple?.groomName || "";
  const brideDisplayName = couple?.brideNickname || couple?.brideName || "";

  // Layout Theme Determinators
  const layout = templateTheme.layout || "classic";
  const isMinimal = layout === "minimal";
  const isNusantara = layout === "nusantara";
  const isRustic = layout === "rustic";
  const isIslamic = layout === "islamic";

  // Dynamic Theme Styling Tokens
  const themeCard = isMinimal
    ? "bg-white border border-neutral-200 rounded-xl shadow-xs"
    : isNusantara
    ? "bg-[#FFFDF9] border border-[#B86F36]/30 rounded-2xl shadow-sm shadow-[#B86F36]/10"
    : isRustic
    ? "bg-[#FAF8F3] border border-[#4C6957]/20 rounded-3xl shadow-xs shadow-[#4C6957]/5"
    : isIslamic
    ? "bg-white border border-[#0F4C3A]/25 rounded-2xl shadow-md shadow-[#0F4C3A]/5"
    : "bg-white border border-[#C5A059]/20 rounded-3xl shadow-sm";

  const themeHeading = isMinimal
    ? "font-sans font-bold text-[#09090B] tracking-tight"
    : isRustic
    ? "font-serif italic font-normal text-[#1F2C20]"
    : isNusantara
    ? "font-serif font-bold text-[#2C1D11]"
    : isIslamic
    ? "font-serif font-bold text-[#0B1E15]"
    : "font-serif font-bold text-[#2A211B]";

  const themeSubheading = isMinimal
    ? "text-xs uppercase tracking-[0.35em] text-[#2563EB] font-sans font-semibold"
    : isNusantara
    ? "text-xs uppercase tracking-[0.25em] text-[#8D4925] font-serif font-bold"
    : isRustic
    ? "text-xs uppercase tracking-[0.25em] text-[#4C6957] font-serif italic"
    : isIslamic
    ? "text-xs uppercase tracking-[0.25em] text-[#0F4C3A] font-serif font-semibold"
    : "text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold";

  const themeBadge = isMinimal
    ? "bg-neutral-100 text-neutral-800 border-neutral-200"
    : isNusantara
    ? "bg-[#F5E8D8] text-[#8D4925] border-[#D6A97A]/40"
    : isRustic
    ? "bg-[#EBF1EC] text-[#3B5343] border-[#C2D6C6]"
    : isIslamic
    ? "bg-[#E6F0EB] text-[#0F4C3A] border-[#A3C9B6]"
    : "bg-[#F5EFEB] text-[#8C6A28] border-[#C5A059]/30";

  // Section renderers
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "cover":
        // Cover is rendered as the envelope overlay, not inside the main flow
        return null;

      case "quote":
        if (!content.quote) return null;
        return (
          <section key="quote" className={`text-center max-w-lg mx-auto p-6 sm:p-8 space-y-3 ${themeCard}`}>
            {isIslamic && (
              <div className="pb-1 text-center">
                <span className="text-xs text-[#0F4C3A] font-serif font-bold tracking-wider block">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <div className="w-12 h-0.5 bg-[#C5A059] mx-auto mt-1 rounded-full" />
              </div>
            )}
            {isNusantara && (
              <div className="text-[10px] text-[#B86F36] uppercase tracking-widest font-serif font-semibold">
                ✦ UNGKAPAN DOA & RESTU ✦
              </div>
            )}
            {isRustic && (
              <div className="text-xs text-[#4C6957] font-serif italic">
                ❦ Kata Mutiara Kasih ❦
              </div>
            )}
            <p className={`text-xs sm:text-sm leading-relaxed ${isMinimal ? "text-neutral-600 font-sans" : isRustic ? "text-[#3E5240] font-serif italic" : isNusantara ? "text-[#4A3222] font-serif italic" : isIslamic ? "text-[#1E382C] font-serif" : "text-stone-600 italic font-serif"}`}>
              &quot;{content.quote}&quot;
            </p>
          </section>
        );

      case "couple":
        if (!couple) return null;
        return (
          <section key="couple" className="space-y-8 text-center">
            <div className="space-y-2">
              <p className={themeSubheading}>
                {isIslamic ? "Mempelai Walimah" : "Mempelai yang Berbahagia"}
              </p>
              <h2 className={`text-2xl sm:text-3xl ${themeHeading}`}>
                Kedua Mempelai
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Groom */}
              <div className={`p-6 sm:p-8 space-y-3 ${themeCard}`}>
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isMinimal ? "bg-neutral-100 border border-neutral-200 text-neutral-800" : isNusantara ? "bg-[#F5E8D8] border border-[#D6A97A]/50 text-[#8D4925]" : isRustic ? "bg-[#EBF1EC] border border-[#C2D6C6] text-[#3B5343]" : isIslamic ? "bg-[#E6F0EB] border border-[#A3C9B6] text-[#0F4C3A]" : "bg-[#F5EFEB] border border-[#C5A059]/40 text-[#8C6A28]"}`}>
                  {isMinimal ? (
                    <div className="w-4 h-4 bg-[#2563EB] rotate-45" />
                  ) : isNusantara ? (
                    <span className="text-xl font-serif">✦</span>
                  ) : isRustic ? (
                    <span className="text-xl font-serif">❦</span>
                  ) : isIslamic ? (
                    <span className="text-xl font-serif">۞</span>
                  ) : (
                    <Sparkles className="w-8 h-8" />
                  )}
                </div>
                <h3 className={`text-lg font-bold ${themeHeading}`}>
                  {couple.groomName}
                </h3>
                {couple.groomParents && (
                  <p className="text-xs opacity-75">
                    Putra tercinta dari: <br />
                    <strong className="opacity-90">{couple.groomParents}</strong>
                  </p>
                )}
              </div>

              {/* Bride */}
              <div className={`p-6 sm:p-8 space-y-3 ${themeCard}`}>
                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${isMinimal ? "bg-neutral-100 border border-neutral-200 text-neutral-800" : isNusantara ? "bg-[#F5E8D8] border border-[#D6A97A]/50 text-[#8D4925]" : isRustic ? "bg-[#EBF1EC] border border-[#C2D6C6] text-[#3B5343]" : isIslamic ? "bg-[#E6F0EB] border border-[#A3C9B6] text-[#0F4C3A]" : "bg-[#F5EFEB] border border-[#C5A059]/40 text-[#8C6A28]"}`}>
                  {isMinimal ? (
                    <div className="w-4 h-4 bg-[#2563EB] rotate-45" />
                  ) : isNusantara ? (
                    <span className="text-xl font-serif">✦</span>
                  ) : isRustic ? (
                    <span className="text-xl font-serif">❦</span>
                  ) : isIslamic ? (
                    <span className="text-xl font-serif">۞</span>
                  ) : (
                    <Sparkles className="w-8 h-8" />
                  )}
                </div>
                <h3 className={`text-lg font-bold ${themeHeading}`}>
                  {couple.brideName}
                </h3>
                {couple.brideParents && (
                  <p className="text-xs opacity-75">
                    Putri tercinta dari: <br />
                    <strong className="opacity-90">{couple.brideParents}</strong>
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      case "countdown":
        return (
          <section key="countdown" className="text-center space-y-4">
            <div className="space-y-2">
              <p className={themeSubheading}>
                Menghitung Hari
              </p>
              <h2 className={`text-2xl sm:text-3xl ${themeHeading}`}>
                Hitung Mundur Acara
              </h2>
            </div>
            <CountdownTimer targetDate={invitation.eventDate} />
          </section>
        );

      case "events":
        return <EventSection key="events" events={content.events || []} />;

      case "live-streaming":
        if (!content.liveStreamingUrl) return null;
        return (
          <div key="live-streaming" className={`text-center p-6 sm:p-8 space-y-3 ${themeCard}`}>
            <h3 className={`text-base font-bold ${themeHeading}`}>
              Siaran Langsung Acara (Live Streaming)
            </h3>
            <p className="text-xs opacity-75">
              Bagi keluarga &amp; kerabat yang berhalangan hadir langsung, saksikan momen sakral kami melalui tayangan online:
            </p>
            <a
              href={content.liveStreamingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition-colors"
            >
              <Video className="w-4 h-4" />
              <span>Tonton Siaran Langsung</span>
            </a>
          </div>
        );

      case "love-story":
        return <LoveStorySection key="love-story" story={content.loveStory} />;

      case "gallery":
        return <GallerySection key="gallery" media={galleryMedia} />;

      case "gift":
        return (
          <DigitalGiftSection
            key="gift"
            accounts={giftAccounts}
            description={content.weddingGift?.description}
            physicalGiftAddress={content.weddingGift?.physicalGiftAddress}
          />
        );

      case "rsvp":
        return (
          <RsvpForm
            key="rsvp"
            slug={invitation.slug}
            guestPersonalSlug={guestPersonalSlug}
            guestName={guestName}
          />
        );

      case "guestbook":
        return (
          <GuestbookSection
            key="guestbook"
            slug={invitation.slug}
            initialMessages={invitation.guestbook || []}
            defaultSenderName={guestName}
          />
        );

      case "closing":
        return (
          <section key="closing" className="text-center space-y-8 pt-8">
            {/* Closing personal message */}
            <div className={`p-8 space-y-4 max-w-md mx-auto ${themeCard}`}>
              <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${isMinimal ? "bg-[#18181B] text-white shadow-black/10" : isNusantara ? "bg-linear-to-br from-[#8D4925] to-[#B86F36] shadow-[#8D4925]/20" : isRustic ? "bg-[#4C6957] shadow-[#4C6957]/20" : isIslamic ? "bg-linear-to-br from-[#0F4C3A] to-[#16654F] shadow-[#0F4C3A]/20" : "bg-linear-to-br from-[#C5A059] to-[#8C6A28] shadow-[#C5A059]/20"}`}>
                {isMinimal ? (
                  <div className="w-3 h-3 bg-[#2563EB] rotate-45" />
                ) : isNusantara ? (
                  <span className="text-base font-serif">✦</span>
                ) : isRustic ? (
                  <span className="text-base font-serif">❦</span>
                ) : isIslamic ? (
                  <span className="text-base font-serif">۞</span>
                ) : (
                  <Heart className="w-6 h-6 fill-white" />
                )}
              </div>
              <p className="text-xs opacity-75 leading-relaxed">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                kepada kami.
              </p>
              <div className="pt-2 space-y-1">
                <p className={themeSubheading}>
                  Kami yang berbahagia
                </p>
                <h3 className={`text-xl font-bold ${themeHeading}`}>
                  {couple
                    ? `${groomDisplayName} & ${brideDisplayName}`
                    : person?.name || invitation.eventTitle}
                </h3>
              </div>
            </div>

            {/* Footer Branding */}
            <footer className="pt-4 pb-6 border-t border-black/5 space-y-3">
              <p className="text-xs opacity-60">
                Ungkapan terima kasih yang tulus dari keluarga besar kami.
              </p>
              <div className="pt-2">
                <a
                  href="https://kreyasi.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] opacity-50 hover:opacity-100 transition-opacity"
                >
                  <span>Powered by</span>
                  <strong className={isMinimal ? "text-neutral-900" : isNusantara ? "text-[#8D4925]" : isRustic ? "text-[#4C6957]" : isIslamic ? "text-[#0F4C3A]" : "text-[#8C6A28]"}>
                    Kreyasi.id
                  </strong>
                </a>
              </div>
            </footer>
          </section>
        );

      // Legacy fallback for old templates — "footer" maps to closing
      case "footer":
        return renderSection("closing");

      case "video":
        return renderSection("live-streaming");

      default:
        return null;
    }
  };

  const renderSectionWithAnimation = (sectionItem: string | TemplateSectionConfig) => {
    const sectionId = typeof sectionItem === "string" ? sectionItem : sectionItem.id;
    const animConfig = typeof sectionItem === "object" ? sectionItem.animation : undefined;
    const lottieUrl = animConfig?.assetKey ? getAssetUrlByKey(animConfig.assetKey) : null;
    const rendered = renderSection(sectionId);

    if (!rendered) return null;
    if (!lottieUrl) return rendered;

    return (
      <div key={`sec-wrap-${sectionId}`} className="relative space-y-4">
        {animConfig?.position !== "bottom" && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto -mb-2">
            <LottiePlayer
              src={lottieUrl}
              loop={animConfig?.loop ?? true}
              speed={animConfig?.speed ?? 1}
              className="w-full h-full"
            />
          </div>
        )}
        {rendered}
        {animConfig?.position === "bottom" && (
          <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto -mt-2">
            <LottiePlayer
              src={lottieUrl}
              loop={animConfig?.loop ?? true}
              speed={animConfig?.speed ?? 1}
              className="w-full h-full"
            />
          </div>
        )}
      </div>
    );
  };

  const containerBg = isMinimal
    ? "bg-[#FAFAFA] text-[#18181B]"
    : isNusantara
    ? "bg-[#FAF6F0] text-[#332219]"
    : isRustic
    ? "bg-[#F5F2EB] text-[#2C3E2D]"
    : isIslamic
    ? "bg-[#F8F9F6] text-[#142A20]"
    : "bg-[#FAF7F2] text-[#2A211B]";

  return (
    <div
      className={`min-h-screen ${containerBg} relative selection:bg-[#C5A059] selection:text-white font-sans`}
      style={{
        ["--primary-gold" as any]: theme.primaryColor || (isMinimal ? "#2563EB" : isNusantara ? "#8D4925" : isRustic ? "#4C6957" : isIslamic ? "#0F4C3A" : "#C5A059"),
      }}
    >
      {/* 1. Envelope Cover Modal */}
      {!isEnvelopeOpen && (
        <EnvelopeCover
          coverTitle={invitation.eventTitle}
          eventDate={invitation.eventDate}
          guestName={guestName}
          sealLottieUrl={sealLottieUrl}
          sealImageUrl={sealImageUrl}
          layout={layout}
          primaryColor={templateTheme.primaryColor}
          accentColor={templateTheme.accentColor}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Floating Background Music Player */}
      <MusicPlayer shouldPlay={isEnvelopeOpen} />

      {/* Ambient Lighting Glows */}
      {!isMinimal && (
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 blur-[150px] pointer-events-none ${
            isNusantara
              ? "bg-[#8D4925]/15"
              : isRustic
              ? "bg-[#4C6957]/15"
              : isIslamic
              ? "bg-[#0F4C3A]/15"
              : "bg-[#C5A059]/15"
          }`}
        />
      )}

      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-20 relative z-10">
        {/* HERO SECTION — always rendered first */}
        <section className="text-center space-y-6 pt-4">
          {/* Nusantara Cultural Header */}
          {isNusantara && (
            <div className="flex items-center justify-center gap-2 text-[#B86F36]/80 text-[11px] tracking-widest uppercase font-serif pb-2">
              <span>✦</span>
              <span>━━━━━━━━</span>
              <span className="font-bold text-[#8D4925]">PAWIKAHAN ADAT</span>
              <span>━━━━━━━━</span>
              <span>✦</span>
            </div>
          )}

          {/* Islamic Basmalah Banner */}
          {isIslamic && (
            <div className="space-y-1.5 pb-2">
              <span className="text-sm sm:text-base text-[#0F4C3A] font-serif font-bold tracking-widest block">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </span>
              <div className="w-20 h-0.5 bg-[#C5A059] mx-auto rounded-full" />
            </div>
          )}

          {/* Minimalist Top Architectural Accent */}
          {isMinimal && (
            <div className="flex items-center justify-center gap-3 pb-2">
              <div className="w-8 h-px bg-neutral-300" />
              <div className="w-2 h-2 bg-[#2563EB] rotate-45" />
              <div className="w-8 h-px bg-neutral-300" />
            </div>
          )}

          {/* Rustic Botanical Laurel Header */}
          {isRustic && (
            <div className="flex items-center justify-center gap-2 text-[#4C6957] text-xs font-serif italic pb-1">
              <span>❦</span>
              <span>━━━━━━━━</span>
              <span>A Garden of Love</span>
              <span>━━━━━━━━</span>
              <span>❦</span>
            </div>
          )}

          {heroLottieUrl ? (
            <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto -my-4">
              <LottiePlayer src={heroLottieUrl} loop autoplay className="w-full h-full" />
            </div>
          ) : isMinimal ? (
            <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-100 mx-auto flex items-center justify-center text-neutral-800">
              <div className="w-3 h-3 bg-[#2563EB] rotate-45" />
            </div>
          ) : isNusantara ? (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#8D4925] to-[#B86F36] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#8D4925]/30">
              <span className="text-base font-serif font-bold">✦</span>
            </div>
          ) : isRustic ? (
            <div className="w-12 h-12 rounded-full bg-[#EBF1EC] border border-[#C2D6C6] mx-auto flex items-center justify-center text-[#3B5343] shadow-md">
              <span className="text-base font-serif">❦</span>
            </div>
          ) : isIslamic ? (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0F4C3A] to-[#16654F] mx-auto flex items-center justify-center text-[#C5A059] shadow-lg shadow-[#0F4C3A]/30">
              <span className="text-base font-serif font-bold">۞</span>
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C5A059] to-[#8C6A28] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/20">
              <Heart className="w-6 h-6 fill-white" />
            </div>
          )}

          <div className="space-y-2">
            <p className={themeSubheading}>
              {isIslamic ? "Walimatul 'Urs" : "The Wedding of"}
            </p>
            <h1 className={`text-4xl sm:text-5xl leading-tight ${themeHeading}`}>
              {couple ? (
                <>
                  <span>{groomDisplayName}</span>
                  <span className={`${isMinimal ? "text-[#2563EB] font-sans font-light" : isNusantara ? "text-[#B86F36] font-serif" : isRustic ? "text-[#4C6957] font-serif" : isIslamic ? "text-[#C5A059] font-serif" : "text-[#8C6A28] font-sans"} mx-3`}>
                    &
                  </span>
                  <span>{brideDisplayName}</span>
                </>
              ) : (
                person?.name || invitation.eventTitle
              )}
            </h1>
            <p className="text-xs opacity-75">
              {formatDateIndonesia(invitation.eventDate)}
            </p>
          </div>
        </section>

        {/* Render sections in template-defined order */}
        {rawSections.map((sectionItem, idx) => {
          const key = typeof sectionItem === "string" ? sectionItem : (sectionItem.id || `sec-${idx}`);
          return (
            <React.Fragment key={key}>
              {renderSectionWithAnimation(sectionItem)}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

