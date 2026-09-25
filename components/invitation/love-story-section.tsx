"use client";

import React from "react";
import { Heart, Sparkles, Gem, Clock } from "lucide-react";

interface LoveStoryData {
  pertemuan?: string;
  pendekatan?: string;
  lamaran?: string;
  menikah?: string;
  needsHelp?: boolean;
}

export function LoveStorySection({ story }: { story?: LoveStoryData }) {
  if (!story) return null;

  const milestones = [
    {
      title: "Love Story PERTEMUAN",
      label: "Pertemuan",
      story: story.pertemuan,
      icon: Clock,
    },
    {
      title: "Love Story PENDEKATAN",
      label: "Pendekatan",
      story: story.pendekatan,
      icon: Sparkles,
    },
    {
      title: "Love Story LAMARAN",
      label: "Lamaran",
      story: story.lamaran,
      icon: Gem,
    },
    {
      title: "Love Story MENIKAH",
      label: "Menikah",
      story: story.menikah,
      icon: Heart,
    },
  ].filter((item) => item.story && item.story.trim().length > 0);

  if (milestones.length === 0) return null;

  return (
    <section className="space-y-8 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold font-serif">
          Perjalanan Cinta
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Love Story
        </h2>
        <p className="text-xs text-slate-400">
          Setiap babak kisah kami adalah anugerah terindah.
        </p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-amber-500/30 space-y-8 ml-4 sm:ml-6">
        {milestones.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-8.75 sm:-left-10.75 top-1.5 w-8 h-8 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-md shadow-amber-500/20 group-hover:scale-110 transition-transform">
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Story Card */}
              <div className="p-5 rounded-2xl bg-linear-to-br from-[#1C212C] to-[#12151D] border border-slate-800 shadow-lg space-y-2">
                <span className="text-[11px] uppercase tracking-wider font-bold text-amber-400 font-serif">
                  {m.label}
                </span>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-line">
                  {m.story}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
