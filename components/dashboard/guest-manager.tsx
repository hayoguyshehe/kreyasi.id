"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Plus,
  FileSpreadsheet,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  MessageSquare,
  Search,
  CheckCircle2,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";

interface GuestItem {
  id: string;
  name: string;
  whatsapp: string | null;
  personalSlug: string;
  invitedCount: number;
  openedAt: string | null;
  createdAt: string;
  rsvp: {
    status: "HADIR" | "TIDAK_HADIR" | "RAGU";
    attendeeCount: number;
  } | null;
}

interface GuestManagerProps {
  invitationId: string;
  slug: string;
  initialGuests: GuestItem[];
  maxGuests: number | null;
}

export function GuestManager({
  invitationId,
  slug,
  initialGuests,
  maxGuests,
}: GuestManagerProps) {
  const router = useRouter();
  const [guests, setGuests] = useState<GuestItem[]>(initialGuests);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add Single Guest Modal State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addName, setAddName] = useState("");
  const [addWhatsapp, setAddWhatsapp] = useState("");
  const [addCount, setAddCount] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bulk Import Modal State
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  // WhatsApp Share Dialog State
  const [shareDialogData, setShareDialogData] = useState<{
    guestName: string;
    personalUrl: string;
    waUrl: string;
    message: string;
  } | null>(null);

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.whatsapp && g.whatsapp.includes(search))
  );

  const handleCopyLink = (personalSlug: string, guestId: string) => {
    const url = `${window.location.origin}/u/${slug}?to=${personalSlug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(guestId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const response = await fetch(
        `/api/my/invitations/${invitationId}/guests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: addName,
            whatsapp: addWhatsapp || undefined,
            invitedCount: Number(addCount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Gagal menambah tamu");
        setIsSubmitting(false);
        return;
      }

      setGuests([data.data, ...guests]);
      setIsAddOpen(false);
      setAddName("");
      setAddWhatsapp("");
      setAddCount(1);
      setIsSubmitting(false);
      router.refresh();
    } catch {
      setErrorMsg("Terjadi kesalahan jaringan");
      setIsSubmitting(false);
    }
  };

  const handleBulkImport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setErrorMsg(null);

    // Parse baris per baris: Format "Nama, NoWA, Jumlah" atau cukup "Nama"
    const lines = importText.split("\n").map((l) => l.trim()).filter(Boolean);
    const parsedGuests = lines.map((line) => {
      const parts = line.split(/[,;\t]/).map((p) => p.trim());
      const name = parts[0];
      const whatsapp = parts[1] || undefined;
      const count = parts[2] ? parseInt(parts[2], 10) : 1;
      return { name, whatsapp, invitedCount: isNaN(count) ? 1 : count };
    });

    if (parsedGuests.length === 0) {
      setErrorMsg("Tidak ada data tamu yang valid untuk diimpor.");
      setIsImporting(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/my/invitations/${invitationId}/guests/import`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guests: parsedGuests }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || "Gagal import tamu");
        setIsImporting(false);
        return;
      }

      setIsImportOpen(false);
      setImportText("");
      setIsImporting(false);
      router.refresh();
      // Reload guests
      const refreshRes = await fetch(
        `/api/my/invitations/${invitationId}/guests`
      );
      const refreshData = await refreshRes.json();
      if (refreshData.success) {
        setGuests(refreshData.data);
      }
    } catch {
      setErrorMsg("Terjadi kesalahan koneksi");
      setIsImporting(false);
    }
  };

  const handleDeleteGuest = async (guestId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus tamu ini?")) return;

    try {
      const response = await fetch(
        `/api/my/invitations/${invitationId}/guests/${guestId}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setGuests(guests.filter((g) => g.id !== guestId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const openShareDialog = async (guestId: string, guestName: string) => {
    try {
      const res = await fetch(
        `/api/my/invitations/${invitationId}/guests/${guestId}/share-link`
      );
      const data = await res.json();
      if (data.success) {
        setShareDialogData({
          guestName,
          personalUrl: data.data.personalUrl,
          waUrl: data.data.whatsappShareUrl,
          message: data.data.message,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama atau no WhatsApp..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportOpen(true)}
            className="gap-1.5 text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Import Massal</span>
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="gap-1.5 text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Tamu</span>
          </Button>
        </div>
      </div>

      {/* Quota Notice */}
      <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <span>
          Total Tamu Terdaftar: <strong className="text-white">{guests.length}</strong>
          {maxGuests !== null && ` / ${maxGuests} kuota paket`}
        </span>
        {maxGuests !== null && guests.length >= maxGuests && (
          <span className="text-amber-400 font-medium">
            Kuota tamu penuh. Upgrade paket untuk menambah lebih banyak tamu.
          </span>
        )}
      </div>

      {/* Guest Table */}
      <Card variant="subtle" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1C212C] border-b border-slate-800 text-slate-300">
              <tr>
                <th className="p-4 font-semibold">Nama Tamu</th>
                <th className="p-4 font-semibold">WhatsApp</th>
                <th className="p-4 font-semibold">Status Buka</th>
                <th className="p-4 font-semibold">Konfirmasi RSVP</th>
                <th className="p-4 font-semibold text-right">Aksi & Bagikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada tamu yang terdaftar atau sesuai pencarian.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4">
                      <span className="font-semibold text-white block">{guest.name}</span>
                      <span className="text-[10px] text-slate-500">
                        Porsi: {guest.invitedCount} orang
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">
                      {guest.whatsapp || "-"}
                    </td>
                    <td className="p-4">
                      {guest.openedAt ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Dibuka
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3.5 h-3.5" /> Belum
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      {guest.rsvp ? (
                        <Badge
                          variant={
                            guest.rsvp.status === "HADIR"
                              ? "success"
                              : guest.rsvp.status === "TIDAK_HADIR"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {guest.rsvp.status === "HADIR"
                            ? `Hadir (${guest.rsvp.attendeeCount})`
                            : guest.rsvp.status === "TIDAK_HADIR"
                            ? "Tidak Hadir"
                            : "Ragu"}
                        </Badge>
                      ) : (
                        <span className="text-[11px] text-slate-500">Belum konfirmasi</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleCopyLink(guest.personalSlug, guest.id)}
                          className="text-[11px] px-2 py-1 gap-1"
                          title="Salin Link Personal Tamu"
                        >
                          {copiedId === guest.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                          <span>{copiedId === guest.id ? "Tersalin" : "Salin"}</span>
                        </Button>

                        <Button
                          variant="gold"
                          size="sm"
                          onClick={() => openShareDialog(guest.id, guest.name)}
                          className="text-[11px] px-2 py-1 gap-1"
                          title="Bagikan via WhatsApp"
                        >
                          <Send className="w-3 h-3" />
                          <span>Kirim WA</span>
                        </Button>

                        <button
                          type="button"
                          onClick={() => handleDeleteGuest(guest.id)}
                          className="p-1.5 text-slate-500 hover:text-red-400 transition-colors"
                          title="Hapus Tamu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal Tambah Tamu Manual */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Tambah Tamu Undangan"
        description="Masukkan data tamu untuk membuat tautan personal eksklusif"
      >
        <form onSubmit={handleAddGuest} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}
          <Input
            label="Nama Tamu"
            placeholder="Contoh: Bpk. Bambang Pamungkas & Istri"
            value={addName}
            onChange={(e) => setAddName(e.target.value)}
            required
          />
          <Input
            label="Nomor WhatsApp (Opsional)"
            placeholder="Contoh: 08123456789"
            value={addWhatsapp}
            onChange={(e) => setAddWhatsapp(e.target.value)}
          />
          <Input
            label="Kapasitas Undangan (Jumlah Orang)"
            type="number"
            min={1}
            max={10}
            value={addCount}
            onChange={(e) => setAddCount(parseInt(e.target.value, 10))}
            required
          />
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="gold" isLoading={isSubmitting}>
              Simpan Tamu
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Bulk Import */}
      <Modal
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        title="Import Massal Daftar Tamu"
        description="Salin dan tempel daftar tamu dari Excel/Spreadsheet. Format: Nama, Nomor WA, Jumlah Porsi"
        maxWidth="lg"
      >
        <form onSubmit={handleBulkImport} className="space-y-4">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400">
              {errorMsg}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Data Tamu (Satu baris per tamu):
            </label>
            <textarea
              rows={8}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder={`Contoh:\nBudi Santoso, 08123456789, 2\nSiti Rahma, 08198765432, 1\nDr. Hendra Gunawan`}
              className="w-full rounded-xl bg-slate-900 border border-slate-800 p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-500 font-mono"
              required
            />
          </div>
          <p className="text-[11px] text-slate-500">
            💡 Tips: Anda bisa langsung copy-paste satu kolom nama dari Excel ke kotak ini.
          </p>
          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsImportOpen(false)}
            >
              Batal
            </Button>
            <Button type="submit" variant="gold" isLoading={isImporting}>
              Import Sekarang
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal WhatsApp Share Link */}
      {shareDialogData && (
        <Modal
          isOpen={!!shareDialogData}
          onClose={() => setShareDialogData(null)}
          title={`Kirim Undangan ke: ${shareDialogData.guestName}`}
          description="Tautan personal dan template pesan undangan WhatsApp"
          maxWidth="md"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Tautan Personal Tamu:
              </label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareDialogData.personalUrl}
                  className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-300 font-mono select-all"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(shareDialogData.personalUrl);
                    alert("Tautan personal berhasil disalin!");
                  }}
                >
                  Salin
                </Button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400">
                Pratinjau Pesan WhatsApp:
              </label>
              <textarea
                readOnly
                rows={7}
                value={shareDialogData.message}
                className="w-full text-xs p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 select-all"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShareDialogData(null)}
              >
                Tutup
              </Button>
              <a
                href={shareDialogData.waUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="gold" className="gap-2">
                  <Send className="w-4 h-4" />
                  <span>Buka WhatsApp Sekarang</span>
                </Button>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
