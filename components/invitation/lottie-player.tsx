"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// Dynamic import DotLottieReact with SSR disabled
const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-30 flex items-center justify-center animate-pulse opacity-40">
        <div className="w-8 h-8 rounded-full border-2 border-[#C5A059]/40 border-t-[#C5A059] animate-spin" />
      </div>
    ),
  }
);

interface LottiePlayerProps {
  src: string;
  loop?: boolean;
  autoplay?: boolean;
  speed?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function LottiePlayer({
  src,
  loop = true,
  autoplay = true,
  speed = 1,
  className = "w-full max-w-xs mx-auto",
  style,
}: LottiePlayerProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setReducedMotion(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, []);

  if (!src) return null;

  // Render static placeholder during SSR
  if (!isClient) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={style}
        aria-hidden="true"
      />
    );
  }

  // If user requests reduced motion, disable autoplay & loop (render first frame statically)
  const shouldAutoplay = reducedMotion ? false : autoplay;
  const shouldLoop = reducedMotion ? false : loop;

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={style}
      aria-label="Animasi Dekorasi Template"
      role="img"
    >
      <DotLottieReact
        src={src}
        loop={shouldLoop}
        autoplay={shouldAutoplay}
        speed={speed}
        className="w-full h-full object-contain"
      />
      {reducedMotion && (
        <span className="sr-only">Animasi dinonaktifkan karena prefers-reduced-motion aktif.</span>
      )}
    </div>
  );
}
