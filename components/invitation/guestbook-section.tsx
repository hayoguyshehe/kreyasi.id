"use client";

import React, { useState } from "react";
import { MessageSquare, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatDateIndonesia } from "@/lib/utils";

interface GuestbookMessage {
  id: string;
  name: string;
  message: string;
  createdAt: string | Date;
}

export function GuestbookSection({
  slug,
  initialMessages,
  defaultSenderName,
}: {
  slug: string;
  initialMessages: GuestbookMessage[];
  defaultSenderName?: string | null;
}) {
  const [messages, setMessages] = useState<GuestbookMessage[]>(initialMessages);
  const [name, setName] = useState(defaultSenderName || "");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/invitations/${slug}/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([data.data, ...messages]);
        setMessage("");
        setFeedback("Doa dan ucapan Anda telah berhasil disampaikan!");
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <section className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
          Doa & Restu
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
          Buku Tamu & Ucapan
        </h2>
        <p className="text-xs text-stone-500">
          Sampaikan doa hangat dan ucapan selamat untuk kedua mempelai.
        </p>
      </div>

      {/* Form Input Ucapan */}
      <div className="p-6 rounded-3xl bg-white border border-[#C5A059]/20 shadow-xl shadow-[#C5A059]/5 space-y-4">
        {feedback && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{feedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <Input
            placeholder="Nama Anda..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Textarea
            placeholder="Tuliskan pesan doa & ucapan selamat Anda di sini..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button
            type="submit"
            variant="gold"
            size="sm"
            className="w-full gap-2 shadow-xl shadow-[#C5A059]/20 bg-linear-to-r from-[#C5A059] to-[#8C6A28] text-white hover:opacity-90 border-none"
            isLoading={isLoading}
          >
            <Send className="w-4 h-4" />
            <span>Kirim Ucapan</span>
          </Button>
        </form>
      </div>

      {/* Feed Ucapan */}
      <div className="space-y-3 max-h-112.5 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <p className="text-center text-xs text-stone-500 py-6">
            Belum ada ucapan. Jadilah yang pertama memberikan ucapan selamat!
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl bg-white border border-[#C5A059]/20 space-y-1.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2A211B] font-serif">
                  {m.name}
                </span>
                <span className="text-[10px] text-stone-400">
                  {formatDateIndonesia(m.createdAt)}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed italic">
                &quot;{m.message}&quot;
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
