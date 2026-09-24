import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  Mail,
  Users,
  CheckCircle,
  Eye,
  PlusCircle,
  ArrowRight,
  Calendar,
  ExternalLink,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [currentUser, invitations, totalGuests, totalRsvps] = await Promise.all([
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          select: { passwordHash: true },
        })
      : null,
    prisma.invitation.findMany({
      where: { userId },
      include: {
        package: { select: { name: true } },
        template: { select: { name: true } },
        _count: { select: { guests: true, rsvps: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.guest.count({
      where: { invitation: { userId } },
    }),
    prisma.rsvp.count({
      where: { invitation: { userId } },
    }),
  ]);

  const totalViews = invitations.reduce((acc, curr) => acc + curr.viewCount, 0);
  const activeInvitations = invitations.filter((i) => i.status === "PUBLISHED").length;

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2A211B] tracking-tight">
            Halo, {session?.user?.name || "Kawan Kreyasi"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
            Kelola undangan digital, pantau konfirmasi tamu, dan bagikan tautan acara Anda dari sini.
          </p>
        </div>
        <Link href="/dashboard/invitations/new">
          <Button variant="sage" size="sm" className="gap-2 shadow-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Undangan Baru</span>
          </Button>
        </Link>
      </div>

      {/* Banner Khusus User Google-Only (passwordHash === null) */}
      {currentUser && currentUser.passwordHash === null && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FFF9ED] border border-[#DFC798] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#C5A059]/15 text-[#8C6D2B] shrink-0">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-semibold text-[#2A211B]">
                Akun Google Terdeteksi — Belum Mengatur Kata Sandi
              </p>
              <p className="text-[11px] sm:text-xs text-[#6B5E55] mt-0.5">
                Tambahkan kata sandi agar Anda juga bisa masuk menggunakan form email & password kapan saja.
              </p>
            </div>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="gold" size="sm" className="w-full sm:w-auto text-xs shrink-0 whitespace-nowrap">
              <span>Atur Kata Sandi Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="default" className="p-5 space-y-2 border-[#EAE3D8]">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Undangan Aktif</span>
            <div className="p-2 rounded-lg bg-[#4C6957]/10 text-[#4C6957]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2A211B] font-serif">{activeInvitations}</p>
          <span className="text-[11px] text-[#7A6D63] block">dari total {invitations.length} undangan</span>
        </Card>

        <Card variant="default" className="p-5 space-y-2 border-[#EAE3D8]">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Total Daftar Tamu</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2A211B] font-serif">{totalGuests}</p>
          <span className="text-[11px] text-[#7A6D63] block">penerima undangan</span>
        </Card>

        <Card variant="default" className="p-5 space-y-2 border-[#EAE3D8]">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">RSVP Diterima</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2A211B] font-serif">{totalRsvps}</p>
          <span className="text-[11px] text-[#7A6D63] block">konfirmasi kehadiran</span>
        </Card>

        <Card variant="default" className="p-5 space-y-2 border-[#EAE3D8]">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Total Kunjungan</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#2A211B] font-serif">{totalViews}</p>
          <span className="text-[11px] text-[#7A6D63] block">kali halaman dibuka</span>
        </Card>
      </div>

      {/* Recent Invitations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-[#2A211B]">Undangan Terakhir</h2>
          <Link
            href="/dashboard/invitations"
            className="text-xs text-[#4C6957] hover:text-[#384F41] font-semibold flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {invitations.length === 0 ? (
          <Card variant="subtle" className="p-10 text-center space-y-4 border-[#EAE3D8]">
            <div className="w-12 h-12 rounded-full bg-[#EFE8DD] text-[#4C6957] mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-[#2A211B]">Belum Ada Undangan</h3>
              <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
                Anda belum memiliki undangan digital. Mulai buat undangan pertama Anda sekarang juga!
              </p>
            </div>
            <Link href="/dashboard/invitations/new">
              <Button variant="sage" size="sm" className="gap-1.5 shadow-sm">
                <PlusCircle className="w-4 h-4" />
                <span>Buat Undangan Pertama</span>
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {invitations.map((inv) => (
              <Card
                key={inv.id}
                variant="default"
                className="p-5 flex flex-col justify-between space-y-4 border-[#EAE3D8] hover:border-[#DFC798] transition-colors shadow-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge
                      variant={
                        inv.status === "PUBLISHED"
                          ? "success"
                          : inv.status === "DRAFT"
                          ? "warning"
                          : "default"
                      }
                    >
                      {inv.status}
                    </Badge>
                    <span className="text-[11px] font-medium text-[#4C6957] bg-[#4C6957]/10 px-2.5 py-0.5 rounded-full border border-[#4C6957]/20">
                      Paket {inv.package.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#2A211B] font-serif line-clamp-1">
                      {inv.eventTitle}
                    </h3>
                    <p className="text-xs text-[#6B5E55] flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4C6957]" />
                      <span>{formatDateIndonesia(inv.eventDate)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-[#6B5E55] pt-1">
                    <span>👥 {inv._count.guests} Tamu</span>
                    <span>💌 {inv._count.rsvps} RSVP</span>
                    <span>👁️ {inv.viewCount} Kunjungan</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D8] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/invitations/${inv.id}`}>
                      <Button variant="outline" size="sm" className="text-xs hover:border-[#4C6957] hover:text-[#4C6957]">
                        Edit Undangan
                      </Button>
                    </Link>
                    <Link href={`/dashboard/invitations/${inv.id}/guests`}>
                      <Button variant="ghost" size="sm" className="text-xs hover:bg-[#F1EFE4]">
                        Tamu
                      </Button>
                    </Link>
                  </div>
                  {inv.status === "PUBLISHED" && (
                    <a
                      href={`/u/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-[#6B5E55] hover:text-[#4C6957] hover:bg-[#F1EFE4] transition-colors"
                      title="Buka Undangan"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
