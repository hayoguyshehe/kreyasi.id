"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertCircle, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface RsvpFormProps {
  slug: string;
  guestPersonalSlug?: string | null;
  guestName?: string | null;
  maxAttendees?: number;
}

export function RsvpForm({
  slug,
  guestPersonalSlug,
  guestName,
  maxAttendees = 2,
}: RsvpFormProps) {
  const [name, setName] = useState(guestName || "");
  const [status, setStatus] = useState<"HADIR" | "TIDAK_HADIR" | "RAGU">("HADIR");
  const [attendeeCount, setAttendeeCount] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/invitations/${slug}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestPersonalSlug: guestPersonalSlug || undefined,
          guestNameFallback: name || undefined,
          status,
          attendeeCount: Number(attendeeCount),
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Gagal mengirimkan konfirmasi kehadiran",
        });
        setIsLoading(false);
        return;
      }

      setFeedback({
        type: "success",
        text: data.message || "Konfirmasi kehadiran Anda berhasil dikirim!",
      });
      setIsLoading(false);
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan koneksi saat mengirimkan konfirmasi",
      });
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
          Konfirmasi Kehadiran
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
          RSVP Tamu Undangan
        </h2>
        <p className="text-xs text-stone-500">
          Mohon konfirmasi kehadiran Anda untuk membantu persiapan jamuan acara kami.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#C5A059]/20 shadow-xl shadow-[#C5A059]/5">
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 mb-6 ${
              feedback.type === "success"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!guestPersonalSlug && (
            <Input
              label="Nama Lengkap Anda"
              placeholder="Masukkan nama lengkap Anda..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-600">
              Apakah Anda Berkenan Hadir?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "HADIR", label: "Hadir" },
                { val: "RAGU", label: "Masih Ragu" },
                { val: "TIDAK_HADIR", label: "Berhalangan" },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setStatus(opt.val as any)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold transition-all border ${
                    status === opt.val
                      ? "bg-[#C5A059] text-white border-[#C5A059] shadow-md shadow-[#C5A059]/20"
                      : "bg-[#F5EFEB] text-stone-500 border-transparent hover:text-[#2A211B] hover:border-[#C5A059]/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {status === "HADIR" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-stone-600">
                Jumlah Hadirin
              </label>
              <select
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl bg-white border border-stone-200 p-2.5 text-xs text-[#2A211B] focus:outline-none focus:ring-2 focus:ring-[#4C6957]/50 focus:border-transparent transition-all"
              >
                {Array.from({ length: maxAttendees }, (_, i) => i + 1).map(
                  (num) => (
                    <option key={num} value={num}>
                      {num} Orang
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          <Textarea
            label="Pesan / Doa Restu (Opsional)"
            placeholder="Tuliskan doa dan harapan terbaik Anda untuk mempelai..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Button
            type="submit"
            variant="gold"
            className="w-full gap-2 shadow-xl shadow-[#C5A059]/20 mt-2 bg-linear-to-r from-[#C5A059] to-[#8C6A28] text-white hover:opacity-90 border-none"
            isLoading={isLoading}
          >
            <Send className="w-4 h-4" />
            <span>Kirim Konfirmasi Kehadiran</span>
          </Button>
        </form>
      </div>
    </section>
  );
}
