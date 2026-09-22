import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  PlusCircle,
  Calendar,
  ExternalLink,
  Users,
  Eye,
  Mail,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/utils";

export default async function MyInvitationsPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const invitations = await prisma.invitation.findMany({
    where: { userId },
    include: {
      package: true,
      template: true,
      _count: { select: { guests: true, rsvps: true, guestbook: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-white tracking-tight">
            Undangan Saya
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Daftar seluruh undangan digital yang telah Anda buat di Kreyasi.id
          </p>
        </div>
        <Link href="/dashboard/invitations/new">
          <Button variant="gold" size="sm" className="gap-2 shadow-lg">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Undangan Baru</span>
          </Button>
        </Link>
      </div>

      {/* Invitations Grid */}
      {invitations.length === 0 ? (
        <Card variant="subtle" className="p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Mail className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-white">Belum Ada Undangan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Anda belum membuat undangan. Pilih template dan mulai buat undangan digital Anda sekarang!
            </p>
          </div>
          <Link href="/dashboard/invitations/new">
            <Button variant="gold" size="sm" className="gap-2">
              <PlusCircle className="w-4 h-4" />
              <span>Buat Undangan Sekarang</span>
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invitations.map((inv) => (
            <Card
              key={inv.id}
              variant="subtle"
              className="overflow-hidden flex flex-col justify-between hover:border-slate-700 transition-all duration-200"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={
                      inv.status === "PUBLISHED"
                        ? "success"
                        : inv.status === "DRAFT"
                        ? "warning"
                        : "danger"
                    }
                  >
                    {inv.status}
                  </Badge>
                  <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                    {inv.package.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white font-serif line-clamp-1">
                    {inv.eventTitle}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{formatDateIndonesia(inv.eventDate)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/80 text-center">
                  <div className="space-y-0.5">
                    <span className="block text-sm font-bold text-white font-mono">
                      {inv._count.guests}
                    </span>
                    <span className="text-[10px] text-slate-500">Tamu</span>
                  </div>
                  <div className="space-y-0.5 border-x border-slate-800/80">
                    <span className="block text-sm font-bold text-white font-mono">
                      {inv._count.rsvps}
                    </span>
                    <span className="text-[10px] text-slate-500">RSVP</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-sm font-bold text-white font-mono">
                      {inv.viewCount}
                    </span>
                    <span className="text-[10px] text-slate-500">Kunjungan</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  <span>Template: <strong className="text-slate-300">{inv.template.name}</strong></span>
                  {inv.status === "PUBLISHED" && (
                    <span className="block mt-0.5 text-amber-400 truncate">
                      Link: kreyasi.id/u/{inv.slug}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/invitations/${inv.id}`}>
                    <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Link href={`/dashboard/invitations/${inv.id}/guests`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <Users className="w-3.5 h-3.5" />
                      <span>Tamu</span>
                    </Button>
                  </Link>
                </div>
                {inv.status === "PUBLISHED" && (
                  <a
                    href={`/u/${inv.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-400 hover:bg-slate-800 transition-colors"
                    title="Buka Undangan di Tab Baru"
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
  );
}
