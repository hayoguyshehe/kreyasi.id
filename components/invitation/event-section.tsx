import React from "react";
import { Calendar, Clock, MapPin, Navigation, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/utils";

interface EventItem {
  name: string;
  date: string;
  startTime: string;
  endTime?: string;
  venueName?: string;
  venueAddress: string;
  mapsUrl?: string;
}

export function EventSection({ events }: { events: EventItem[] }) {
  if (!events || events.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
          Rangkaian Waktu & Lokasi
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
          Agenda Acara
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {events.map((evt, idx) => {
          const mapsQuery = encodeURIComponent(
            `${evt.venueName || ""} ${evt.venueAddress}`
          );
          const finalMapsUrl = evt.mapsUrl?.trim()
            ? evt.mapsUrl
            : `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

          return (
            <div
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C5A059]/20 text-center space-y-5 shadow-md shadow-[#C5A059]/5 hover:border-[#C5A059]/50 transition-colors"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#F5EFEB] border border-[#C5A059]/30 text-xs font-bold text-[#8C6A28] font-serif">
                {evt.name}
              </div>

              <div className="space-y-2 text-xs text-stone-600">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-[#C5A059]" />
                  <span className="font-semibold text-[#2A211B]">
                    {formatDateIndonesia(evt.date)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059]" />
                  <span>
                    Pukul {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : "WIB"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#F5EFEB]">
                <p className="text-sm font-bold text-[#2A211B] font-serif">
                  {evt.venueName}
                </p>
                <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
                  {evt.venueAddress}
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={finalMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 text-xs text-stone-600 border-stone-200 hover:border-[#C5A059] hover:text-[#8C6A28] hover:bg-[#F5EFEB]/50"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Buka Petunjuk Arah Google Maps</span>
                  </Button>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
