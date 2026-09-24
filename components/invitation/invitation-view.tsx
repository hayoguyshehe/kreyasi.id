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
  const theme = content.theme || { primaryColor: "#D4AF37", fontFamily: "Plus Jakarta Sans" };

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
      className="min-h-screen bg-[#0B0D11] text-slate-100 relative selection:bg-amber-500 selection:text-slate-950 font-sans"
      style={{
        ["--primary-gold" as any]: theme.primaryColor || "#D4AF37",
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
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 space-y-20 relative z-10">
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <Heart className="w-6 h-6 fill-slate-950" />
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-amber-400 font-semibold font-serif">
              The Wedding of
            </p>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white leading-tight">
              {couple ? (
                <>
                  <span>{couple.groomNickname || couple.groomName}</span>
                  <span className="text-amber-400 font-sans mx-3">&</span>
                  <span>{couple.brideNickname || couple.brideName}</span>
                </>
              ) : (
                person?.name || invitation.eventTitle
              )}
            </h1>
            <p className="text-xs text-slate-400">
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
          <section className="text-center max-w-lg mx-auto p-6 rounded-3xl bg-slate-900/40 border border-slate-800 space-y-2">
            <p className="text-xs sm:text-sm text-slate-300 italic font-serif leading-relaxed">
              &quot;{content.quote}&quot;
            </p>
          </section>
        )}

        {/* BRIDE & GROOM PROFILES */}
        {couple && (
          <section className="space-y-8 text-center">
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
                Mempelai yang Berbahagia
              </p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                Kedua Mempelai
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Groom */}
              <div className="p-6 rounded-3xl bg-[#14171F]/80 border border-slate-800 space-y-3">
                <div className="w-20 h-20 rounded-full bg-slate-800 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {couple.groomName}
                </h3>
                {couple.groomParents && (
                  <p className="text-xs text-slate-400">
                    Putra tercinta dari: <br />
                    <strong className="text-slate-200">{couple.groomParents}</strong>
                  </p>
                )}
              </div>

              {/* Bride */}
              <div className="p-6 rounded-3xl bg-[#14171F]/80 border border-slate-800 space-y-3">
                <div className="w-20 h-20 rounded-full bg-slate-800 border border-amber-500/40 mx-auto flex items-center justify-center text-amber-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white">
                  {couple.brideName}
                </h3>
                {couple.brideParents && (
                  <p className="text-xs text-slate-400">
                    Putri tercinta dari: <br />
                    <strong className="text-slate-200">{couple.brideParents}</strong>
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
          <div className="text-center p-6 rounded-3xl glass-panel-gold space-y-3">
            <h3 className="text-base font-serif font-bold text-white">
              Siaran Langsung Acara (Live Streaming)
            </h3>
            <p className="text-xs text-slate-300">
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
        <footer className="text-center pt-12 pb-6 border-t border-slate-800/60 space-y-3">
          <p className="text-xs font-serif text-slate-400">
            Ungkapan terima kasih yang tulus dari keluarga besar kami.
          </p>
          <div className="pt-2">
            <a
              href="https://kreyasi.id"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-500 hover:text-amber-400 transition-colors"
            >
              <span>Powered by</span>
              <strong className="text-amber-400">Kreyasi.id</strong>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
