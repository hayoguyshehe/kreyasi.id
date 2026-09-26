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

interface InvitationViewProps {
  invitation: any;
  guestName?: string | null;
  guestPersonalSlug?: string | null;
}

export function InvitationView({
  invitation,
  guestName,
  guestPersonalSlug,
}: InvitationViewProps) {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const content = invitation.content || {};
  const couple = content.couple;
  const person = content.person;
  const theme = content.theme || { primaryColor: "#C5A059", fontFamily: "Plus Jakarta Sans" };
  const templateTheme = invitation.template?.themeConfig || {};

  // Section order from template config, or fallback to default
  const sectionOrder: string[] = templateTheme.sections || [
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

  // Section renderers
  const renderSection = (sectionId: string) => {
    switch (sectionId) {
      case "cover":
        // Cover is rendered as the envelope overlay, not inside the main flow
        return null;

      case "quote":
        if (!content.quote) return null;
        return (
          <section key="quote" className="text-center max-w-lg mx-auto p-6 rounded-3xl bg-[#F5EFEB]/50 border border-[#C5A059]/20 space-y-2">
            <p className="text-xs sm:text-sm text-stone-600 italic font-serif leading-relaxed">
              &quot;{content.quote}&quot;
            </p>
          </section>
        );

      case "couple":
        if (!couple) return null;
        return (
          <section key="couple" className="space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
                Mempelai yang Berbahagia
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
                Kedua Mempelai
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Groom */}
              <div className="p-6 rounded-3xl bg-white border border-[#C5A059]/20 shadow-sm space-y-3">
                <div className="w-20 h-20 rounded-full bg-[#F5EFEB] border border-[#C5A059]/40 mx-auto flex items-center justify-center text-[#8C6A28]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[#2A211B]">
                  {couple.groomName}
                </h3>
                {couple.groomParents && (
                  <p className="text-xs text-stone-500">
                    Putra tercinta dari: <br />
                    <strong className="text-stone-600">{couple.groomParents}</strong>
                  </p>
                )}
              </div>

              {/* Bride */}
              <div className="p-6 rounded-3xl bg-white border border-[#C5A059]/20 shadow-sm space-y-3">
                <div className="w-20 h-20 rounded-full bg-[#F5EFEB] border border-[#C5A059]/40 mx-auto flex items-center justify-center text-[#8C6A28]">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[#2A211B]">
                  {couple.brideName}
                </h3>
                {couple.brideParents && (
                  <p className="text-xs text-stone-500">
                    Putri tercinta dari: <br />
                    <strong className="text-stone-600">{couple.brideParents}</strong>
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
              <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
                Menghitung Hari
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
                Hitung Mundur
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
          <div key="live-streaming" className="text-center p-6 rounded-3xl bg-white border border-[#C5A059]/30 shadow-md space-y-3">
            <h3 className="text-base font-serif font-bold text-[#2A211B]">
              Siaran Langsung Acara (Live Streaming)
            </h3>
            <p className="text-xs text-stone-600">
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
            <div className="p-8 rounded-3xl bg-white border border-[#C5A059]/20 shadow-md space-y-4 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C5A059] to-[#8C6A28] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/20">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
                Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu
                kepada kami.
              </p>
              <div className="pt-2 space-y-1">
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8C6A28] font-semibold">
                  Kami yang berbahagia
                </p>
                <h3 className="text-xl font-serif font-bold text-[#2A211B]">
                  {couple
                    ? `${groomDisplayName} & ${brideDisplayName}`
                    : person?.name || invitation.eventTitle}
                </h3>
              </div>
            </div>

            {/* Footer Branding */}
            <footer className="pt-4 pb-6 border-t border-[#F5EFEB] space-y-3">
              <p className="text-xs font-serif text-stone-500">
                Ungkapan terima kasih yang tulus dari keluarga besar kami.
              </p>
              <div className="pt-2">
                <a
                  href="https://kreyasi.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-stone-400 hover:text-[#8C6A28] transition-colors"
                >
                  <span>Powered by</span>
                  <strong className="text-[#8C6A28]">Kreyasi.id</strong>
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

  return (
    <div
      className="min-h-screen bg-[#FAF7F2] text-[#2A211B] relative selection:bg-[#C5A059] selection:text-white font-sans"
      style={{
        ["--primary-gold" as any]: theme.primaryColor || "#C5A059",
      }}
    >
      {/* 1. Envelope Cover Modal */}
      {!isEnvelopeOpen && (
        <EnvelopeCover
          coverTitle={invitation.eventTitle}
          eventDate={invitation.eventDate}
          guestName={guestName}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* Floating Background Music Player */}
      <MusicPlayer shouldPlay={isEnvelopeOpen} />

      {/* Ambient Lighting Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059]/15 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-20 relative z-10">
        {/* HERO SECTION — always rendered first */}
        <section className="text-center space-y-6 pt-4">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#C5A059] to-[#8C6A28] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/20">
            <Heart className="w-6 h-6 fill-white" />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8C6A28] font-semibold font-serif">
              The Wedding of
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-[#2A211B] leading-tight">
              {couple ? (
                <>
                  <span>{groomDisplayName}</span>
                  <span className="text-[#8C6A28] font-sans mx-3">&</span>
                  <span>{brideDisplayName}</span>
                </>
              ) : (
                person?.name || invitation.eventTitle
              )}
            </h1>
            <p className="text-xs text-stone-500">
              {formatDateIndonesia(invitation.eventDate)}
            </p>
          </div>
        </section>

        {/* Render sections in template-defined order */}
        {sectionOrder.map((sectionId) => renderSection(sectionId))}
      </div>
    </div>
  );
}
