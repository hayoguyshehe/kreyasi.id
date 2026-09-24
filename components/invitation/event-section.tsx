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
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Rangkaian Waktu & Lokasi
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
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
              className="p-6 sm:p-8 rounded-3xl bg-[#14171F]/90 border border-slate-800 text-center space-y-5 shadow-xl hover:border-amber-500/40 transition-colors"
            >
              <div className="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-bold text-amber-300 font-serif">
                {evt.name}
              </div>

              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="font-semibold text-white">
                    {formatDateIndonesia(evt.date)}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>
                    Pukul {evt.startTime} {evt.endTime ? `- ${evt.endTime}` : "WIB"}
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-slate-800/80">
                <p className="text-sm font-bold text-white font-serif">
                  {evt.venueName}
                </p>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
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
                    className="w-full gap-2 text-xs hover:border-amber-500 hover:text-amber-300"
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
