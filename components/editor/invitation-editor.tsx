"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Save,
  Send,
  ExternalLink,
  ArrowLeft,
  Calendar,
  Heart,
  MapPin,
  Music,
  Palette,
  Gift,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface InvitationData {
  id: string;
  slug: string;
  eventTitle: string;
  eventDate: string;
  eventCategory: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "SUSPENDED";
  content: any;
  package: {
    id: string;
    name: string;
    priceIdr: number;
    activeDurationDays: number;
    maxGalleryPhotos: number;
  };
  template: {
    name: string;
    slug: string;
  };
}

export function InvitationEditor({
  initialData,
}: {
  initialData: InvitationData;
}) {
  const router = useRouter();

  // Core fields
  const [eventTitle, setEventTitle] = useState(initialData.eventTitle || "");
  const [eventDate, setEventDate] = useState(
    initialData.eventDate
      ? new Date(initialData.eventDate).toISOString().split("T")[0]
      : ""
  );
  const [slug, setSlug] = useState(initialData.slug || "");

  // Content JSON states
  const content = initialData.content || {};

  // Couple / Person
  const [groomName, setGroomName] = useState(
    content.couple?.groomName || "Mempelai Pria"
  );
  const [groomNickname, setGroomNickname] = useState(
    content.couple?.groomNickname || ""
  );
  const [groomParents, setGroomParents] = useState(
    content.couple?.groomParents || ""
  );

  const [brideName, setBrideName] = useState(
    content.couple?.brideName || "Mempelai Wanita"
  );
  const [brideNickname, setBrideNickname] = useState(
    content.couple?.brideNickname || ""
  );
  const [brideParents, setBrideParents] = useState(
    content.couple?.brideParents || ""
  );

  const [personName, setPersonName] = useState(content.person?.name || "");

  // Events list
  const [events, setEvents] = useState<any[]>(
    content.events && content.events.length > 0
      ? content.events
      : [
          {
            name: "Akad Nikah / Acara Utama",
            date: eventDate,
            startTime: "09:00",
            endTime: "Selesai",
            venueName: "Nama Lokasi / Gedung",
            venueAddress: "Jl. Contoh Alamat No. 123",
          },
        ]
  );

  // Quotes & Streaming
  const [quote, setQuote] = useState(content.quote || "");
  const [liveStreamingUrl, setLiveStreamingUrl] = useState(
    content.liveStreamingUrl || ""
  );

  // Theme
  const [primaryColor, setPrimaryColor] = useState(
    content.theme?.primaryColor || "#D4AF37"
  );
  const [fontFamily, setFontFamily] = useState(
    content.theme?.fontFamily || "Plus Jakarta Sans"
  );

  // Status & Feedback
  const [status, setStatus] = useState(initialData.status);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setFeedback(null);

    const updatedContent = {
      ...content,
      coverTitle: eventTitle,
      couple:
        initialData.eventCategory === "PERNIKAHAN"
          ? {
              groomName,
              groomNickname,
              groomParents,
              brideName,
              brideNickname,
              brideParents,
            }
          : undefined,
      person:
        initialData.eventCategory !== "PERNIKAHAN"
          ? { name: personName }
          : undefined,
      events,
      quote,
      liveStreamingUrl,
      theme: {
        primaryColor,
        fontFamily,
      },
    };

    try {
      const response = await fetch(`/api/my/invitations/${initialData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventTitle,
          eventDate,
          slug,
          content: updatedContent,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Gagal menyimpan perubahan",
        });
        setIsSaving(false);
        return;
      }

      setFeedback({
        type: "success",
        text: "Perubahan undangan berhasil disimpan!",
      });
      setIsSaving(false);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan koneksi saat menyimpan",
      });
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setFeedback(null);

    try {
      const response = await fetch(
        `/api/my/invitations/${initialData.id}/publish`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setFeedback({
          type: "error",
          text: data.error || "Gagal mempublikasikan undangan",
        });
        setIsPublishing(false);
        return;
      }

      setStatus("PUBLISHED");
      setFeedback({
        type: "success",
        text: "Selamat! Undangan Anda telah aktif dan siap dibagikan!",
      });
      setIsPublishing(false);
      router.refresh();
    } catch {
      setFeedback({
        type: "error",
        text: "Terjadi kesalahan saat mempublikasikan",
      });
      setIsPublishing(false);
    }
  };

  const addEvent = () => {
    setEvents([
      ...events,
      {
        name: "Acara Tambahan",
        date: eventDate,
        startTime: "11:00",
        endTime: "Selesai",
        venueName: "Nama Tempat",
        venueAddress: "Alamat Tempat",
      },
    ]);
  };

  const removeEvent = (index: number) => {
    setEvents(events.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invitations"
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold font-serif text-white truncate max-w-md">
                {eventTitle || "Editor Undangan"}
              </h1>
              <Badge
                variant={
                  status === "PUBLISHED"
                    ? "success"
                    : status === "DRAFT"
                    ? "warning"
                    : "default"
                }
              >
                {status}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Paket: {initialData.package.name} • Template:{" "}
              {initialData.template.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href={`/u/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="outline" size="sm" className="gap-1.5">
              <ExternalLink className="w-4 h-4" />
              <span>Preview Undangan</span>
            </Button>
          </a>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleSave}
            isLoading={isSaving}
            className="gap-1.5"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Draft</span>
          </Button>

          {status === "DRAFT" && (
            <Button
              variant="gold"
              size="sm"
              onClick={handlePublish}
              isLoading={isPublishing}
              className="gap-1.5 shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Publikasikan</span>
            </Button>
          )}
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 animate-in fade-in duration-200 ${
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

      {/* Multi-Tab Editor */}
      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <TabsTrigger value="info">1. Info Acara</TabsTrigger>
          <TabsTrigger value="profile">2. Detail Mempelai/Tokoh</TabsTrigger>
          <TabsTrigger value="events">3. Rundown & Lokasi</TabsTrigger>
          <TabsTrigger value="theme">4. Desain & Tema</TabsTrigger>
        </TabsList>

        {/* TAB 1: Info Acara */}
        <TabsContent value="info">
          <Card variant="subtle" className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-white">Informasi Dasar Acara</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Judul Acara"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
              />
              <Input
                label="Tanggal Acara"
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
              />
              <Input
                label="Tautan URL Undangan"
                hint="kreyasi.id/u/..."
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
              <Input
                label="Tautan Siaran Langsung (YouTube / Zoom)"
                placeholder="https://youtube.com/live/..."
                value={liveStreamingUrl}
                onChange={(e) => setLiveStreamingUrl(e.target.value)}
              />
            </div>
            <Textarea
              label="Ayat Suci / Kutipan Mutiara"
              placeholder="Tuliskan ayat suci atau kata mutiara pembuka undangan..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
            />
          </Card>
        </TabsContent>

        {/* TAB 2: Profil & Mempelai */}
        <TabsContent value="profile">
          <Card variant="subtle" className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-white">
              {initialData.eventCategory === "PERNIKAHAN"
                ? "Detail Kedua Mempelai"
                : "Nama Tokoh / Yang Berbahagia"}
            </h3>

            {initialData.eventCategory === "PERNIKAHAN" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mempelai Pria */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Mempelai Pria
                  </h4>
                  <Input
                    label="Nama Lengkap Pria"
                    value={groomName}
                    onChange={(e) => setGroomName(e.target.value)}
                  />
                  <Input
                    label="Nama Panggilan"
                    value={groomNickname}
                    onChange={(e) => setGroomNickname(e.target.value)}
                  />
                  <Input
                    label="Putra dari Pasangan (Orang Tua)"
                    placeholder="Bpk. ... & Ibu ..."
                    value={groomParents}
                    onChange={(e) => setGroomParents(e.target.value)}
                  />
                </div>

                {/* Mempelai Wanita */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Mempelai Wanita
                  </h4>
                  <Input
                    label="Nama Lengkap Wanita"
                    value={brideName}
                    onChange={(e) => setBrideName(e.target.value)}
                  />
                  <Input
                    label="Nama Panggilan"
                    value={brideNickname}
                    onChange={(e) => setBrideNickname(e.target.value)}
                  />
                  <Input
                    label="Putri dari Pasangan (Orang Tua)"
                    placeholder="Bpk. ... & Ibu ..."
                    value={brideParents}
                    onChange={(e) => setBrideParents(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Input
                  label="Nama Tokoh / Anak / Penyelenggara"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                />
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 3: Rundown & Lokasi */}
        <TabsContent value="events">
          <Card variant="subtle" className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-white">Rangkaian Acara</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={addEvent}
                className="gap-1 text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Acara</span>
              </Button>
            </div>

            <div className="space-y-4">
              {events.map((evt, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Acara #{idx + 1}
                    </span>
                    {events.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEvent(idx)}
                        className="text-red-400 hover:text-red-300 text-xs p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Input
                      label="Nama Sesi Acara"
                      value={evt.name}
                      onChange={(e) => {
                        const newEvts = [...events];
                        newEvts[idx].name = e.target.value;
                        setEvents(newEvts);
                      }}
                    />
                    <Input
                      label="Waktu Mulai"
                      placeholder="09:00 WIB"
                      value={evt.startTime}
                      onChange={(e) => {
                        const newEvts = [...events];
                        newEvts[idx].startTime = e.target.value;
                        setEvents(newEvts);
                      }}
                    />
                    <Input
                      label="Waktu Selesai"
                      placeholder="12:00 WIB / Selesai"
                      value={evt.endTime || ""}
                      onChange={(e) => {
                        const newEvts = [...events];
                        newEvts[idx].endTime = e.target.value;
                        setEvents(newEvts);
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Nama Gedung / Tempat"
                      value={evt.venueName}
                      onChange={(e) => {
                        const newEvts = [...events];
                        newEvts[idx].venueName = e.target.value;
                        setEvents(newEvts);
                      }}
                    />
                    <Input
                      label="Alamat Lengkap"
                      value={evt.venueAddress}
                      onChange={(e) => {
                        const newEvts = [...events];
                        newEvts[idx].venueAddress = e.target.value;
                        setEvents(newEvts);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* TAB 4: Desain & Tema */}
        <TabsContent value="theme">
          <Card variant="subtle" className="p-6 space-y-6">
            <h3 className="text-base font-semibold text-white">Personalisasi Tampilan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Warna Aksen Primer
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-slate-400">
                    {primaryColor}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Pilihan Gaya Tipografi
                </label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2.5 text-xs text-white"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Clean)</option>
                  <option value="Playfair Display">Playfair Display (Klasik Elegan)</option>
                  <option value="Cinzel">Cinzel (Royal Luxury)</option>
                  <option value="Great Vibes">Great Vibes (Kaligrafi Romantis)</option>
                </select>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Bottom Floating Action */}
      <div className="pt-4 flex items-center justify-end gap-3">
        <Button
          variant="gold"
          size="md"
          onClick={handleSave}
          isLoading={isSaving}
          className="gap-2 shadow-xl"
        >
          <Save className="w-4 h-4" />
          <span>Simpan Seluruh Perubahan</span>
        </Button>
      </div>
    </div>
  );
}
