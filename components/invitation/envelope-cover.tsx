"use client";

import React, { useState } from "react";
import { Heart, MailOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/utils";

interface EnvelopeCoverProps {
  coverTitle: string;
  eventDate: string | Date;
  guestName?: string | null;
  onOpen: () => void;
}

export function EnvelopeCover({
  coverTitle,
  eventDate,
  guestName,
  onOpen,
}: EnvelopeCoverProps) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
    }, 600); // Sinkron dengan durasi animasi slide
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#FAF7F2] text-[#2A211B] p-4 sm:p-6 transition-all duration-700 ease-in-out ${
        isOpening ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-[#C5A059]/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-87.5 h-62.5 bg-[#4C6957]/10 blur-[100px] pointer-events-none" />

      {/* Decorative Envelope Frame */}
      <div className="relative w-full max-w-md rounded-3xl p-8 sm:p-10 bg-white/90 backdrop-blur-sm border border-[#C5A059]/30 text-center space-y-8 shadow-xl shadow-[#C5A059]/5">
        {/* Top Monogram / Wax Seal */}
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-[#C5A059] to-[#8C6A28] mx-auto flex items-center justify-center text-white shadow-lg shadow-[#C5A059]/30">
          <Heart className="w-7 h-7 fill-white" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8C6A28] font-semibold font-serif">
            The Wedding of
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] leading-tight">
            {coverTitle}
          </h1>
          <p className="text-xs text-stone-500">
            {formatDateIndonesia(eventDate)}
          </p>
        </div>

        {/* Personal Guest Card */}
        <div className="p-4 rounded-2xl bg-[#F5EFEB] border border-[#C5A059]/20 text-xs space-y-1 shadow-inner">
          <span className="text-[11px] text-stone-500 block">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="text-sm font-bold text-[#8C6A28] font-serif">
            {guestName || "Tamu Undangan Terhormat"}
          </p>
          <span className="text-[10px] text-stone-400 block">
            Mohon maaf apabila ada kesalahan penulisan nama / gelar
          </span>
        </div>

        {/* Open Button */}
        <div className="pt-2">
          <Button
            variant="gold"
            size="lg"
            onClick={handleOpenClick}
            className="w-full gap-2 text-sm shadow-xl shadow-[#C5A059]/20 py-3.5 bg-linear-to-r from-[#C5A059] to-[#8C6A28] text-white hover:opacity-90 border-none"
          >
            <MailOpen className="w-4 h-4" />
            <span>Buka Undangan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
