"use client";

import React, { useEffect, useRef, useState } from "react";
import { Music, VolumeX, Volume2 } from "lucide-react";

interface MusicPlayerProps {
  audioUrl?: string | null;
  shouldPlay: boolean;
}

export function MusicPlayer({ audioUrl, shouldPlay }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fallbackAudio =
    "https://assets.mixkit.co/music/preview/mixkit-wedding-day-543.mp3";
  const source = audioUrl || fallbackAudio;

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio(source);
      audio.loop = true;
      audioRef.current = audio;
    }

    if (shouldPlay && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.warn("Autoplay was prevented by browser gesture policy:", err);
        });
    }
  }, [shouldPlay, source]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        type="button"
        onClick={togglePlay}
        title={isPlaying ? "Jeda Musik" : "Putar Musik"}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-slate-950 shadow-2xl transition-all duration-300 ${
          isPlaying
            ? "gold-gradient-bg animate-spin-slow ring-4 ring-amber-500/30"
            : "bg-slate-800 text-slate-300 border border-slate-700"
        }`}
        style={{ animationDuration: "8s" }}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}
