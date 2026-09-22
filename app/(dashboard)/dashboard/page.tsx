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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [invitations, totalGuests, totalRsvps] = await Promise.all([
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
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
            Halo, {session?.user?.name || "Kawan Kreyasi"}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Kelola undangan digital, pantau konfirmasi tamu, dan bagikan tautan acara Anda dari sini.
          </p>
        </div>
        <Link href="/dashboard/invitations/new">
          <Button variant="gold" size="sm" className="gap-2 shadow-lg">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Undangan Baru</span>
          </Button>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card variant="subtle" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Undangan Aktif</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-serif">{activeInvitations}</p>
          <span className="text-[11px] text-slate-500 block">dari total {invitations.length} undangan</span>
        </Card>

        <Card variant="subtle" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Daftar Tamu</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-serif">{totalGuests}</p>
          <span className="text-[11px] text-slate-500 block">penerima undangan</span>
        </Card>

        <Card variant="subtle" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">RSVP Diterima</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-serif">{totalRsvps}</p>
          <span className="text-[11px] text-slate-500 block">konfirmasi kehadiran</span>
        </Card>

        <Card variant="subtle" className="p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Total Kunjungan</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white font-serif">{totalViews}</p>
          <span className="text-[11px] text-slate-500 block">kali halaman dibuka</span>
        </Card>
      </div>

      {/* Recent Invitations List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-white">Undangan Terakhir</h2>
          <Link
            href="/dashboard/invitations"
            className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
          >
            <span>Lihat Semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {invitations.length === 0 ? (
          <Card variant="subtle" className="p-10 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-semibold text-white">Belum Ada Undangan</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Anda belum memiliki undangan digital. Mulai buat undangan pertama Anda sekarang juga!
              </p>
            </div>
            <Link href="/dashboard/invitations/new">
              <Button variant="gold" size="sm" className="gap-1.5">
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
                variant="subtle"
                className="p-5 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
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
                    <span className="text-[11px] text-slate-500">
                      Paket {inv.package.name}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white font-serif line-clamp-1">
                      {inv.eventTitle}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formatDateIndonesia(inv.eventDate)}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span>👥 {inv._count.guests} Tamu</span>
                    <span>💌 {inv._count.rsvps} RSVP</span>
                    <span>👁️ {inv.viewCount} Kunjungan</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/invitations/${inv.id}`}>
                      <Button variant="secondary" size="sm" className="text-xs">
                        Edit Undangan
                      </Button>
                    </Link>
                    <Link href={`/dashboard/invitations/${inv.id}/guests`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Tamu
                      </Button>
                    </Link>
                  </div>
                  {inv.status === "PUBLISHED" && (
                    <a
                      href={`/u/${inv.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
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
