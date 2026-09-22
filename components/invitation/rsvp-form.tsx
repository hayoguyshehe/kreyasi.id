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
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-semibold">
          Konfirmasi Kehadiran
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          RSVP Tamu Undangan
        </h2>
        <p className="text-xs text-slate-400">
          Mohon konfirmasi kehadiran Anda untuk membantu persiapan jamuan acara kami.
        </p>
      </div>

      <div className="p-6 sm:p-8 rounded-3xl bg-[#14171F]/90 border border-slate-800 shadow-2xl">
        {feedback && (
          <div
            className={`p-4 rounded-xl text-xs flex items-center gap-2.5 mb-6 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
                : "bg-red-500/10 border border-red-500/30 text-red-400"
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
            <label className="block text-xs font-semibold text-slate-300">
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
                      ? "bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20"
                      : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {status === "HADIR" && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Jumlah Hadirin
              </label>
              <select
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(parseInt(e.target.value, 10))}
                className="w-full rounded-xl bg-slate-900 border border-slate-800 p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
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
            className="w-full gap-2 shadow-xl mt-2"
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
