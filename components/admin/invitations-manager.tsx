"use client";

import React, { useState } from "react";
import Link from "next/link";
import { formatRupiah, formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Gift,
  Search,
  Plus,
  ExternalLink,
  Edit,
  Trash2,
  RotateCw,
  Sparkles,
  CheckCircle2,
  User,
  Package as PackageIcon,
  Tag,
  AlertCircle,
  FileText,
  Calendar,
  Layers,
  HeartHandshake,
  Check,
  X,
} from "lucide-react";

export interface AdminInvitationItem {
  id: string;
  slug: string;
  eventTitle: string;
  eventDate: string;
  eventCategory: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "SUSPENDED";
  isComplimentary: boolean;
  complimentaryNote: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
  };
  package: {
    id: string;
    name: string;
    slug: string;
    priceIdr: number;
    maxGuests: number | null;
  };
  template: {
    id: string;
    name: string;
    slug: string;
    previewImageUrl: string;
  };
  grantedBy?: {
    id: string;
    name: string;
    email: string;
  } | null;
  _count: {
    guests: number;
    rsvps: number;
    guestbook: number;
  };
}

export interface UserOption {
  id: string;
  name: string;
  email: string;
}

export interface PackageOption {
  id: string;
  name: string;
  slug: string;
  priceIdr: number;
}

export interface TemplateOption {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

interface InvitationsManagerProps {
  initialInvitations: AdminInvitationItem[];
  users: UserOption[];
  packages: PackageOption[];
  templates: TemplateOption[];
}

export function InvitationsManager({
  initialInvitations,
  users,
  packages,
  templates,
}: InvitationsManagerProps) {
  const [invitations, setInvitations] = useState<AdminInvitationItem[]>(initialInvitations);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "COMPLIMENTARY" | "REGULAR">("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Modal 1: Create New Complimentary Invitation
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(users[0]?.id || "");
  const [selectedPackageId, setSelectedPackageId] = useState(
    packages.find((p) => p.slug === "eksklusif")?.id || packages[packages.length - 1]?.id || ""
  );
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0]?.id || "");
  const [eventCategory, setEventCategory] = useState("PERNIKAHAN");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [complimentaryNote, setComplimentaryNote] = useState("");

  // Modal 2: Grant Complimentary to Existing Invitation
  const [isGrantModalOpen, setIsGrantModalOpen] = useState(false);
  const [targetInvitation, setTargetInvitation] = useState<AdminInvitationItem | null>(null);
  const [grantNote, setGrantNote] = useState("");
  const [upgradePackageId, setUpgradePackageId] = useState("");

  // Filter logic
  const filteredInvitations = invitations.filter((inv) => {
    const q = search.toLowerCase();
    const matchSearch =
      inv.eventTitle.toLowerCase().includes(q) ||
      inv.slug.toLowerCase().includes(q) ||
      inv.user.name.toLowerCase().includes(q) ||
      inv.user.email.toLowerCase().includes(q) ||
      (inv.complimentaryNote && inv.complimentaryNote.toLowerCase().includes(q));

    if (!matchSearch) return false;

    if (filterType === "COMPLIMENTARY" && !inv.isComplimentary) return false;
    if (filterType === "REGULAR" && inv.isComplimentary) return false;

    if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;

    return true;
  });

  const complimentaryCount = invitations.filter((i) => i.isComplimentary).length;

  // Handler: Create new complimentary invitation
  const handleCreateComplimentary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !selectedPackageId || !selectedTemplateId || !eventTitle || !eventDate) {
      alert("Harap lengkapi semua field wajib");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          userId: selectedUserId,
          packageId: selectedPackageId,
          templateId: selectedTemplateId,
          eventCategory,
          eventTitle,
          eventDate,
          slug: customSlug || undefined,
          complimentaryNote: complimentaryNote || "Undangan Kerjasama / Mitra",
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal membuat undangan kerjasama");
      }

      setInvitations((prev) => [data.data, ...prev]);
      setIsCreateModalOpen(false);
      // Reset form
      setEventTitle("");
      setEventDate("");
      setCustomSlug("");
      setComplimentaryNote("");
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat membuat undangan");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Grant complimentary status to existing invitation
  const handleOpenGrantModal = (inv: AdminInvitationItem) => {
    setTargetInvitation(inv);
    setGrantNote(inv.complimentaryNote || "Undangan Kerjasama / Mitra");
    setUpgradePackageId(inv.package.id);
    setIsGrantModalOpen(true);
  };

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetInvitation) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "grant",
          invitationId: targetInvitation.id,
          complimentaryNote: grantNote,
          packageId: upgradePackageId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal memberikan status kerjasama");
      }

      setInvitations((prev) =>
        prev.map((i) => (i.id === targetInvitation.id ? { ...i, ...data.data } : i))
      );
      setIsGrantModalOpen(false);
      setTargetInvitation(null);
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat memproses status kerjasama");
    } finally {
      setLoading(false);
    }
  };

  // Handler: Revoke complimentary status
  const handleRevokeComplimentary = async (inv: AdminInvitationItem) => {
    if (
      !confirm(
        `Apakah Anda yakin ingin mencabut status Kerjasama dari undangan "${inv.eventTitle}"? Pengguna akan diminta melakukan pembayaran saat ingin mempublikasikan ulang jika paket berbayar.`
      )
    ) {
      return;
    }

    setActionLoadingId(inv.id);
    try {
      const res = await fetch(`/api/admin/invitations/${inv.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isComplimentary: false,
          complimentaryNote: null,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal mencabut status kerjasama");
      }

      setInvitations((prev) =>
        prev.map((i) => (i.id === inv.id ? { ...i, isComplimentary: false, complimentaryNote: null, grantedBy: null } : i))
      );
    } catch (err: any) {
      alert(err.message || "Gagal memproses pencabutan status");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler: Delete invitation
  const handleDeleteInvitation = async (inv: AdminInvitationItem) => {
    if (
      !confirm(
        `PERINGATAN: Apakah Anda yakin ingin menghapus undangan "${inv.eventTitle}" milik ${inv.user.name}? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setActionLoadingId(inv.id);
    try {
      const res = await fetch(`/api/admin/invitations/${inv.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal menghapus undangan");
      }

      setInvitations((prev) => prev.filter((i) => i.id !== inv.id));
    } catch (err: any) {
      alert(err.message || "Gagal menghapus undangan");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
            <HeartHandshake className="w-6 h-6 text-amber-400" />
            <span>Manajemen Undangan &amp; Kerjasama</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kelola seluruh undangan pelanggan dan berikan status Gratis Kerjasama / Complimentary kepada mitra atau teman tanpa memerlukan pembayaran Midtrans.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsCreateModalOpen(true)}
            className="text-xs gap-1.5 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Undangan Kerjasama</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Total Undangan</span>
          <p className="text-xl font-bold font-serif text-white">{invitations.length}</p>
          <p className="text-[11px] text-slate-500">Semua draft &amp; publik</p>
        </div>
        <div className="p-4 rounded-xl bg-[#14171F] border border-amber-500/30 bg-amber-500/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-medium">Undangan Kerjasama</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-serif text-amber-400">{complimentaryCount}</p>
          <p className="text-[11px] text-amber-400/80">Gratis fitur penuh tanpa order Midtrans</p>
        </div>
        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-1">
          <span className="text-xs text-slate-400 font-medium">Undangan Reguler</span>
          <p className="text-xl font-bold font-serif text-white">
            {invitations.length - complimentaryCount}
          </p>
          <p className="text-[11px] text-slate-500">Tier gratis atau lunas Midtrans</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="p-4 rounded-2xl bg-[#14171F] border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Cari judul acara, slug, nama user, email, atau catatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterType("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === "ALL"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Semua ({invitations.length})
            </button>
            <button
              onClick={() => setFilterType("COMPLIMENTARY")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                filterType === "COMPLIMENTARY"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "text-amber-400/80 hover:text-amber-300 hover:bg-amber-500/10"
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Kerjasama ({complimentaryCount})</span>
            </button>
            <button
              onClick={() => setFilterType("REGULAR")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === "REGULAR"
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              Reguler ({invitations.length - complimentaryCount})
            </button>

            {/* Status dropdown */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-slate-300 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="EXPIRED">EXPIRED</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invitations Table */}
      <div className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 font-semibold">Acara &amp; Tautan</th>
                <th className="py-3.5 px-4 font-semibold">Pemilik Undangan</th>
                <th className="py-3.5 px-4 font-semibold">Paket &amp; Template</th>
                <th className="py-3.5 px-4 font-semibold">Status Kerjasama</th>
                <th className="py-3.5 px-4 font-semibold text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredInvitations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500 text-xs">
                    Tidak ada undangan yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredInvitations.map((inv) => {
                  const isComp = inv.isComplimentary;
                  const isActionLoading = actionLoadingId === inv.id;

                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-slate-800/30 transition-colors ${
                        isComp ? "bg-amber-500/[0.02]" : ""
                      }`}
                    >
                      {/* Acara & Tautan */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white text-sm">
                              {inv.eventTitle}
                            </span>
                            <Badge
                              variant={inv.status === "PUBLISHED" ? "success" : "outline"}
                              className="text-[10px] uppercase py-0 px-1.5"
                            >
                              {inv.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <Calendar className="w-3 h-3 text-slate-500" />
                            <span>{formatDateIndonesia(inv.eventDate)}</span>
                            <span>•</span>
                            <a
                              href={`/u/${inv.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 inline-flex items-center gap-1 font-mono"
                            >
                              <span>/u/{inv.slug}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {inv._count.guests} tamu • {inv._count.rsvps} konfirmasi RSVP • {inv._count.guestbook} ucapan
                          </div>
                        </div>
                      </td>

                      {/* Pemilik */}
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="font-medium text-slate-200">{inv.user.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{inv.user.email}</p>
                          {inv.user.phone && (
                            <p className="text-[10px] text-slate-500">{inv.user.phone}</p>
                          )}
                        </div>
                      </td>

                      {/* Paket & Template */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-[10px] text-slate-300 py-0">
                              {inv.package.name}
                            </Badge>
                            {inv.package.priceIdr > 0 ? (
                              <span className="text-[10px] text-slate-400">
                                {formatRupiah(inv.package.priceIdr)}
                              </span>
                            ) : (
                              <span className="text-[10px] text-emerald-400">Gratis</span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Layers className="w-3 h-3 text-slate-500" />
                            <span>{inv.template.name}</span>
                          </p>
                        </div>
                      </td>

                      {/* Status Kerjasama */}
                      <td className="py-4 px-4">
                        {isComp ? (
                          <div className="space-y-1.5 max-w-xs">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
                              <Sparkles className="w-3 h-3" />
                              <span>Kerjasama / Mitra</span>
                            </div>
                            {inv.complimentaryNote && (
                              <p className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                                &quot;{inv.complimentaryNote}&quot;
                              </p>
                            )}
                            {inv.grantedBy && (
                              <p className="text-[10px] text-slate-500">
                                Oleh: <strong className="text-slate-400">{inv.grantedBy.name}</strong>
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">Reguler</span>
                        )}
                      </td>

                      {/* Aksi Admin */}
                      <td className="py-4 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Tombol Buka Editor (Admin bypass) */}
                          <Link href={`/dashboard/invitations/${inv.id}`} target="_blank">
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[11px] py-1 px-2.5 h-auto text-slate-300 hover:text-white"
                              title="Buka Editor Undangan sebagai Admin"
                            >
                              <span>Editor</span>
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          </Link>

                          {/* Tombol Grant atau Revoke */}
                          {isComp ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isActionLoading}
                              onClick={() => handleRevokeComplimentary(inv)}
                              className="text-[11px] py-1 px-2.5 h-auto text-amber-400/90 border-amber-500/30 hover:bg-amber-500/10"
                              title="Cabut status kerjasama"
                            >
                              {isActionLoading ? (
                                <RotateCw className="w-3 h-3 animate-spin" />
                              ) : (
                                <span>Cabut Mitra</span>
                              )}
                            </Button>
                          ) : (
                            <Button
                              variant="gold"
                              size="sm"
                              onClick={() => handleOpenGrantModal(inv)}
                              className="text-[11px] py-1 px-2.5 h-auto"
                              title="Berikan status kerjasama / complimentary"
                            >
                              <Gift className="w-3 h-3 mr-1" />
                              <span>Jadikan Mitra</span>
                            </Button>
                          )}

                          {/* Tombol Hapus */}
                          <button
                            onClick={() => handleDeleteInvitation(inv)}
                            disabled={isActionLoading}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                            title="Hapus Undangan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Buat Undangan Kerjasama Baru */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Buat Undangan Kerjasama Baru"
        description="Inisialisasi undangan untuk mitra atau teman dengan paket fitur penuh tanpa biaya Midtrans."
        maxWidth="lg"
      >
        <form onSubmit={handleCreateComplimentary} className="space-y-4 text-xs">
          {/* Pilih Pengguna */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Pilih Pengguna / Customer Target *</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
              required
            >
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
            <p className="text-[10px] text-slate-500">
              Undangan akan masuk ke dashboard akun pengguna tersebut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Pilih Paket */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Tingkat Paket (Tier) *</label>
              <select
                value={selectedPackageId}
                onChange={(e) => setSelectedPackageId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                required
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)})
                  </option>
                ))}
              </select>
            </div>

            {/* Pilih Template */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Template Desain *</label>
              <select
                value={selectedTemplateId}
                onChange={(e) => setSelectedTemplateId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                required
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Kategori Acara */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Kategori Acara *</label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
                required
              >
                <option value="PERNIKAHAN">Pernikahan</option>
                <option value="ULANG_TAHUN">Ulang Tahun</option>
                <option value="KHITANAN_AQIQAH">Khitanan &amp; Aqiqah</option>
                <option value="EVENT_UMUM">Event Umum</option>
              </select>
            </div>

            {/* Tanggal Acara */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">Tanggal Acara *</label>
              <Input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
                required
              />
            </div>
          </div>

          {/* Judul Acara */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Judul Acara *</label>
            <Input
              type="text"
              placeholder="Contoh: Pernikahan Romeo & Juliet"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              required
            />
          </div>

          {/* Slug Kustom (Opsional) */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Slug URL Kustom (Opsional)</label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-slate-800 border border-r-0 border-slate-700 rounded-l-xl text-slate-400 font-mono text-[11px]">
                kreyasi.id/u/
              </span>
              <Input
                type="text"
                placeholder="romeo-dan-juliet"
                value={customSlug}
                onChange={(e) => setCustomSlug(e.target.value)}
                className="rounded-l-none bg-slate-900 border-slate-700 text-white font-mono text-[11px]"
              />
            </div>
            <p className="text-[10px] text-slate-500">
              Kosongkan jika ingin digenerate otomatis dengan sufiks acak.
            </p>
          </div>

          {/* Catatan Kerjasama */}
          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">
              Alasan Kerjasama / Catatan Admin *
            </label>
            <Textarea
              placeholder="Contoh: Kerjasama Sponsorship Vendor MUA / Teman Dekat Owner / Promosi Instagram"
              value={complimentaryNote}
              onChange={(e) => setComplimentaryNote(e.target.value)}
              className="bg-slate-900 border-slate-700 text-white"
              rows={2}
              required
            />
            <p className="text-[10px] text-slate-500">
              Catatan ini disimpan untuk audit dan transparansi internal pengelola Kreyasi.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="gold"
              size="sm"
              disabled={loading}
              className="gap-1.5 shadow-md shadow-amber-500/20"
            >
              {loading ? (
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Buat Undangan Kerjasama</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Berikan Status Kerjasama ke Undangan yang Sudah Ada */}
      <Modal
        isOpen={isGrantModalOpen}
        onClose={() => {
          setIsGrantModalOpen(false);
          setTargetInvitation(null);
        }}
        title="Jadikan Undangan Kerjasama (Complimentary)"
        description="Memberikan akses fitur penuh tanpa memerlukan pembayaran transaksi Midtrans."
        maxWidth="md"
      >
        {targetInvitation && (
          <form onSubmit={handleGrantSubmit} className="space-y-4 text-xs">
            {/* Info Undangan */}
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
              <p className="font-semibold text-white">{targetInvitation.eventTitle}</p>
              <p className="text-[11px] text-slate-400">
                Milik: {targetInvitation.user.name} ({targetInvitation.user.email})
              </p>
              <p className="text-[11px] text-amber-400">
                Paket Saat Ini: {targetInvitation.package.name} (
                {targetInvitation.package.priceIdr === 0
                  ? "Gratis"
                  : formatRupiah(targetInvitation.package.priceIdr)}
                )
              </p>
            </div>

            {/* Pilihan Upgrade Paket */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">
                Pilih Paket (Opsional: Upgrade ke fitur lebih tinggi)
              </label>
              <select
                value={upgradePackageId}
                onChange={(e) => setUpgradePackageId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 text-xs"
              >
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name} ({pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)})
                  </option>
                ))}
              </select>
            </div>

            {/* Catatan Kerjasama */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-medium">
                Catatan / Alasan Kerjasama *
              </label>
              <Textarea
                placeholder="Contoh: Teman lama / Barter barter konten TikTok / Mitra WO"
                value={grantNote}
                onChange={(e) => setGrantNote(e.target.value)}
                className="bg-slate-900 border-slate-700 text-white"
                rows={3}
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsGrantModalOpen(false);
                  setTargetInvitation(null);
                }}
              >
                Batal
              </Button>
              <Button
                type="submit"
                variant="gold"
                size="sm"
                disabled={loading}
                className="gap-1.5 shadow-md shadow-amber-500/20"
              >
                {loading ? (
                  <RotateCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Simpan Status Kerjasama</span>
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
