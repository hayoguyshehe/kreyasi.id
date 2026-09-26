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
        {/* HERO SECTION */}
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
                  <span>{couple.groomNickname || couple.groomName}</span>
                  <span className="text-[#8C6A28] font-sans mx-3">&</span>
                  <span>{couple.brideNickname || couple.brideName}</span>
                </>
              ) : (
                person?.name || invitation.eventTitle
              )}
            </h1>
            <p className="text-xs text-stone-500">
              {formatDateIndonesia(invitation.eventDate)}
            </p>
          </div>

          {/* Countdown Component */}
          <div className="pt-4">
            <CountdownTimer targetDate={invitation.eventDate} />
          </div>
        </section>

        {/* QUOTE SECTION */}
        {content.quote && (
          <section className="text-center max-w-lg mx-auto p-6 rounded-3xl bg-[#F5EFEB]/50 border border-[#C5A059]/20 space-y-2">
            <p className="text-xs sm:text-sm text-stone-600 italic font-serif leading-relaxed">
              &quot;{content.quote}&quot;
            </p>
          </section>
        )}

        {/* BRIDE & GROOM PROFILES */}
        {couple && (
          <section className="space-y-8 text-center">
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
        )}

        {/* EVENT AGENDA */}
        <EventSection events={content.events || []} />

        {/* LIVE STREAMING BUTTON IF ANY */}
        {content.liveStreamingUrl && (
          <div className="text-center p-6 rounded-3xl bg-white border border-[#C5A059]/30 shadow-md space-y-3">
            <h3 className="text-base font-serif font-bold text-[#2A211B]">
              Siaran Langsung Acara (Live Streaming)
            </h3>
            <p className="text-xs text-stone-600">
              Bagi keluarga & kerabat yang berhalangan hadir langsung, saksikan momen sakral kami melalui tayangan online:
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
        )}

        {/* LOVE STORY */}
        <LoveStorySection story={content.loveStory} />

        {/* GALLERY */}
        <GallerySection media={galleryMedia} />

        {/* DIGITAL GIFT */}
        <DigitalGiftSection
          accounts={giftAccounts}
          description={content.weddingGift?.description}
          physicalGiftAddress={content.weddingGift?.physicalGiftAddress}
        />

        {/* RSVP FORM */}
        <RsvpForm
          slug={invitation.slug}
          guestPersonalSlug={guestPersonalSlug}
          guestName={guestName}
        />

        {/* GUESTBOOK WISHES FEED */}
        <GuestbookSection
          slug={invitation.slug}
          initialMessages={invitation.guestbook || []}
          defaultSenderName={guestName}
        />

        {/* FOOTER & WATERMARK */}
        <footer className="text-center pt-12 pb-6 border-t border-[#F5EFEB] space-y-3">
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
      </div>
    </div>
  );
}
