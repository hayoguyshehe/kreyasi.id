"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Heart, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/utils";
import { LottiePlayer } from "@/components/invitation/lottie-player";

interface EnvelopeCoverProps {
  coverTitle: string;
  eventDate: string | Date;
  guestName?: string | null;
  sealLottieUrl?: string | null;
  sealImageUrl?: string | null;
  layout?: string;
  primaryColor?: string;
  accentColor?: string;
  onOpen: () => void;
}

export function EnvelopeCover({
  coverTitle,
  eventDate,
  guestName,
  sealLottieUrl,
  sealImageUrl,
  layout = "classic",
  primaryColor,
  accentColor,
  onOpen,
}: EnvelopeCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600); // Sinkron dengan durasi animasi slide
  };

  const isMinimal = layout === "minimal";
  const isNusantara = layout === "nusantara";
  const isRustic = layout === "rustic";
  const isIslamic = layout === "islamic";

  // Dynamic theme variables based on layout
  const bgContainer = isMinimal
    ? "bg-[#FAFAFA] text-[#18181B]"
    : isNusantara
    ? "bg-[#FAF6F0] text-[#332219]"
    : isRustic
    ? "bg-[#F5F2EB] text-[#2C3E2D]"
    : isIslamic
    ? "bg-[#F8F9F6] text-[#142A20]"
    : "bg-[#FAF7F2] text-[#2A211B]";

  const frameBorder = isMinimal
    ? "border-neutral-300 bg-white/95 rounded-2xl shadow-xl shadow-black/5"
    : isNusantara
    ? "border-2 border-[#B86F36]/40 bg-[#FFFDF9]/95 rounded-3xl shadow-xl shadow-[#B86F36]/10"
    : isRustic
    ? "border border-[#4C6957]/30 bg-[#FAF8F3]/95 rounded-3xl shadow-xl shadow-[#4C6957]/10"
    : isIslamic
    ? "border-2 border-[#0F4C3A]/30 bg-[#FFFFFF]/95 rounded-3xl shadow-xl shadow-[#0F4C3A]/10"
    : "border border-[#C5A059]/30 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl shadow-[#C5A059]/5";

  const titleFont = isMinimal
    ? "font-sans font-bold text-[#09090B] tracking-tight"
    : isRustic
    ? "font-serif italic font-normal text-[#1F2C20]"
    : isNusantara
    ? "font-serif font-bold text-[#2C1D11]"
    : isIslamic
    ? "font-serif font-bold text-[#0B1E15]"
    : "font-serif font-bold text-[#2A211B]";

  const subtitleStyle = isMinimal
    ? "text-[10px] uppercase tracking-[0.35em] text-neutral-500 font-sans font-semibold"
    : isNusantara
    ? "text-[11px] uppercase tracking-[0.3em] text-[#8D4925] font-serif font-bold"
    : isRustic
    ? "text-[11px] uppercase tracking-[0.25em] text-[#4C6957] font-serif italic"
    : isIslamic
    ? "text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-serif font-semibold"
    : "text-[11px] uppercase tracking-[0.3em] text-[#8C6A28] font-semibold font-serif";

  const guestCardStyle = isMinimal
    ? "bg-neutral-50 border border-neutral-200 text-neutral-800"
    : isNusantara
    ? "bg-[#F5E8D8] border border-[#D6A97A]/50 text-[#332219]"
    : isRustic
    ? "bg-[#EBF1EC] border border-[#C2D6C6] text-[#2C3E2D]"
    : isIslamic
    ? "bg-[#E6F0EB] border border-[#A3C9B6] text-[#142A20]"
    : "bg-[#F5EFEB] border border-[#C5A059]/20";

  const guestNameColor = isMinimal
    ? "text-neutral-900 font-sans"
    : isNusantara
    ? "text-[#8D4925] font-serif"
    : isRustic
    ? "text-[#3B5343] font-serif"
    : isIslamic
    ? "text-[#0F4C3A] font-serif"
    : "text-[#8C6A28] font-serif";

  const buttonStyle = isMinimal
    ? "bg-[#18181B] hover:bg-neutral-800 text-white shadow-lg"
    : isNusantara
    ? "bg-linear-to-r from-[#8D4925] to-[#B86F36] text-white shadow-xl shadow-[#8D4925]/25"
    : isRustic
    ? "bg-[#4C6957] hover:bg-[#3B5343] text-white shadow-xl shadow-[#4C6957]/20"
    : isIslamic
    ? "bg-linear-to-r from-[#0F4C3A] to-[#16654F] text-white shadow-xl shadow-[#0F4C3A]/25"
    : "bg-linear-to-r from-[#C5A059] to-[#8C6A28] text-white shadow-xl shadow-[#C5A059]/20";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${bgContainer} p-4 sm:p-6 transition-all duration-700 ease-in-out ${
        isOpening ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Ambient Lighting Background */}
      {!isMinimal && (
        <>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-[#C5A059]/15 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-87.5 h-62.5 bg-[#4C6957]/10 blur-[100px] pointer-events-none" />
        </>
      )}

      {/* Decorative Envelope Frame */}
      <div className={`relative w-full max-w-md p-8 sm:p-10 text-center space-y-8 ${frameBorder}`}>
        {/* Cultural / Motif Top Border for Nusantara */}
        {isNusantara && (
          <div className="flex items-center justify-center gap-1 text-[#B86F36]/60 text-[10px] tracking-widest uppercase font-serif pb-1">
            <span>◆</span>
            <span>━━━━━</span>
            <span className="text-[#8D4925] font-bold">KOLABORASI ADAT</span>
            <span>━━━━━</span>
            <span>◆</span>
          </div>
        )}

        {/* Islamic Basmalah / Arch Top for Islamic */}
        {isIslamic && (
          <div className="space-y-1 pb-1">
            <span className="text-xs text-[#0F4C3A] font-serif font-bold tracking-widest block">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </span>
            <div className="w-16 h-0.5 bg-[#C5A059] mx-auto rounded-full" />
          </div>
        )}

        {/* Top Monogram / Wax Seal / Modern Icon */}
        {sealLottieUrl ? (
          <div className="w-18 h-18 mx-auto -my-2">
            <LottiePlayer src={sealLottieUrl} loop autoplay className="w-full h-full" />
          </div>
        ) : sealImageUrl ? (
          <div className="w-14 h-14 relative mx-auto">
            <Image src={sealImageUrl} alt="Wax Seal" fill className="object-contain" />
          </div>
        ) : isMinimal ? (
          <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-100 mx-auto flex items-center justify-center text-neutral-800">
            <div className="w-3 h-3 bg-[#2563EB] rotate-45" />
          </div>
        ) : isNusantara ? (
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#8D4925] to-[#B86F36] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#8D4925]/30">
            <span className="text-lg font-serif font-bold">✦</span>
          </div>
        ) : isRustic ? (
          <div className="w-14 h-14 rounded-full bg-[#EBF1EC] border border-[#C2D6C6] mx-auto flex items-center justify-center text-[#3B5343] shadow-md">
            <span className="text-lg font-serif">❦</span>
          </div>
        ) : isIslamic ? (
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#0F4C3A] to-[#16654F] mx-auto flex items-center justify-center text-[#C5A059] shadow-lg shadow-[#0F4C3A]/30">
            <span className="text-lg font-serif font-bold">۞</span>
          </div>
        ) : (
          <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#C5A059] to-[#8C6A28] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/30">
            <Heart className="w-7 h-7 fill-white" />
          </div>
        )}

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <p className={subtitleStyle}>
            {isIslamic ? "Walimatul 'Urs" : "The Wedding of"}
          </p>
          <h1 className={`text-3xl sm:text-4xl leading-tight ${titleFont}`}>
            {coverTitle}
          </h1>
          <p className="text-xs opacity-75">
            {formatDateIndonesia(eventDate)}
          </p>
        </div>

        {/* Personal Guest Card */}
        <div className={`p-4 rounded-2xl text-xs space-y-1 shadow-inner ${guestCardStyle}`}>
          <span className="text-[11px] opacity-75 block">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className={`text-sm font-bold ${guestNameColor}`}>
            {guestName || "Tamu Undangan Terhormat"}
          </p>
          <span className="text-[10px] opacity-60 block">
            Mohon maaf apabila ada kesalahan penulisan nama / gelar
          </span>
        </div>

        {/* Open Button */}
        <div className="pt-2">
          <Button
            size="lg"
            onClick={handleOpenClick}
            className={`w-full gap-2 text-sm py-3.5 hover:opacity-90 border-none transition-all cursor-pointer ${buttonStyle}`}
          >
            <MailOpen className="w-4 h-4" />
            <span>Buka Undangan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
