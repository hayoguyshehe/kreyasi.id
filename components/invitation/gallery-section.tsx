"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X } from "lucide-react";

interface MediaItem {
  id: string;
  url: string;
  type: string;
}

export function GallerySection({ media }: { media: MediaItem[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const photos = media.filter((m) => m.type === "PHOTO" || !m.type);

  if (!photos || photos.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
          Potret Kenangan
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
          Galeri Foto
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => setSelectedPhoto(photo.url)}
            className="aspect-square rounded-2xl overflow-hidden bg-[#F5EFEB] border border-[#C5A059]/20 cursor-pointer group relative shadow-md shadow-[#C5A059]/5"
          >
            <Image
              src={photo.url}
              alt="Momen Bahagia"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[#2A211B] z-10">
              <Camera className="w-6 h-6 text-[#8C6A28]" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full max-w-4xl h-[80vh] flex items-center justify-center">
            <Image
              src={selectedPhoto}
              alt="Preview Foto"
              fill
              className="rounded-xl object-contain shadow-2xl"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      )}
    </section>
  );
}
