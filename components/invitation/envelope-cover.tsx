"use client";

import React, { useState } from "react";
import { Sparkles, Heart, MailOpen } from "lucide-react";
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
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#0B0D11] text-white p-4 sm:p-6 transition-all duration-700 ease-in-out ${
        isOpening ? "-translate-y-full opacity-0 pointer-events-none" : "translate-y-0 opacity-100"
      }`}
    >
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-87.5 bg-amber-500/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-87.5 h-62.5 bg-[#E0A899]/10 blur-[100px] pointer-events-none" />

      {/* Decorative Envelope Frame */}
      <div className="relative w-full max-w-md rounded-3xl p-8 sm:p-10 glass-panel-gold border border-amber-500/40 text-center space-y-8 shadow-2xl">
        {/* Top Monogram */}
        <div className="w-14 h-14 rounded-full bg-linear-to-br from-amber-300 via-amber-500 to-amber-700 mx-auto flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25">
          <Heart className="w-7 h-7 fill-slate-950" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <p className="text-[11px] uppercase tracking-[0.3em] text-amber-300 font-semibold font-serif">
            The Wedding of
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
            {coverTitle}
          </h1>
          <p className="text-xs text-slate-400">
            {formatDateIndonesia(eventDate)}
          </p>
        </div>

        {/* Personal Guest Card */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs space-y-1">
          <span className="text-[11px] text-slate-400 block">
            Kepada Yth. Bapak/Ibu/Saudara/i:
          </span>
          <p className="text-sm font-bold text-amber-300 font-serif">
            {guestName || "Tamu Undangan Terhormat"}
          </p>
          <span className="text-[10px] text-slate-500 block">
            Mohon maaf apabila ada kesalahan penulisan nama / gelar
          </span>
        </div>

        {/* Open Button with Wax Seal style */}
        <div className="pt-2">
          <Button
            variant="gold"
            size="lg"
            onClick={handleOpenClick}
            className="w-full gap-2 text-sm shadow-2xl py-3.5"
          >
            <MailOpen className="w-4 h-4" />
            <span>Buka Undangan</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
