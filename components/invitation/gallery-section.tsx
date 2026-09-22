"use client";

import React, { useState } from "react";
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
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Potret Kenangan
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Galeri Foto
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
        {photos.map((photo, idx) => (
          <div
            key={photo.id || idx}
            onClick={() => setSelectedPhoto(photo.url)}
            className="aspect-square rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer group relative shadow-md"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.url}
              alt="Momen Bahagia"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
              <Camera className="w-6 h-6 text-amber-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-md"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-slate-800/80 text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selectedPhoto}
            alt="Preview"
            className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}
    </section>
  );
}
