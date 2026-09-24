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
          <h1 className="text-2xl font-bold font-serif text-[#2A211B] tracking-tight">
            Undangan Saya
          </h1>
          <p className="text-xs text-[#6B5E55] mt-1">
            Daftar seluruh undangan digital yang telah Anda buat di Kreyasi.id
          </p>
        </div>
        <Link href="/dashboard/invitations/new">
          <Button variant="sage" size="sm" className="gap-2 shadow-sm">
            <PlusCircle className="w-4 h-4" />
            <span>Buat Undangan Baru</span>
          </Button>
        </Link>
      </div>

      {/* Invitations Grid */}
      {invitations.length === 0 ? (
        <Card variant="subtle" className="p-12 text-center space-y-4 border-[#EAE3D8]">
          <div className="w-14 h-14 rounded-2xl bg-[#EFE8DD] text-[#4C6957] mx-auto flex items-center justify-center">
            <Mail className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[#2A211B]">Belum Ada Undangan</h3>
            <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
              Anda belum membuat undangan. Pilih template dan mulai buat undangan digital Anda sekarang!
            </p>
          </div>
          <Link href="/dashboard/invitations/new">
            <Button variant="sage" size="sm" className="gap-2 shadow-sm">
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
              variant="default"
              className="overflow-hidden flex flex-col justify-between border-[#EAE3D8] hover:border-[#DFC798] transition-all duration-200 shadow-xs"
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
                  <span className="text-[11px] font-medium text-[#4C6957] bg-[#4C6957]/10 px-2.5 py-0.5 rounded-full border border-[#4C6957]/20">
                    {inv.package.name}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#2A211B] font-serif line-clamp-1">
                    {inv.eventTitle}
                  </h3>
                  <p className="text-xs text-[#6B5E55] flex items-center gap-1.5 mt-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#4C6957] shrink-0" />
                    <span>{formatDateIndonesia(inv.eventDate)}</span>
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-[#EAE3D8] text-center">
                  <div className="space-y-0.5">
                    <span className="block text-sm font-bold text-[#2A211B] font-mono">
                      {inv._count.guests}
                    </span>
                    <span className="text-[10px] text-[#7A6D63]">Tamu</span>
                  </div>
                  <div className="space-y-0.5 border-x border-[#EAE3D8]">
                    <span className="block text-sm font-bold text-[#2A211B] font-mono">
                      {inv._count.rsvps}
                    </span>
                    <span className="text-[10px] text-[#7A6D63]">RSVP</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block text-sm font-bold text-[#2A211B] font-mono">
                      {inv.viewCount}
                    </span>
                    <span className="text-[10px] text-[#7A6D63]">Kunjungan</span>
                  </div>
                </div>

                <div className="text-[11px] text-[#7A6D63]">
                  <span>Template: <strong className="text-[#2A211B]">{inv.template.name}</strong></span>
                  {inv.status === "PUBLISHED" && (
                    <span className="block mt-0.5 text-[#4C6957] font-medium truncate">
                      Link: kreyasi.id/u/{inv.slug}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-[#EAE3D8] bg-[#FDFBF7] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/invitations/${inv.id}`}>
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs hover:border-[#4C6957] hover:text-[#4C6957]">
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Button>
                  </Link>
                  <Link href={`/dashboard/invitations/${inv.id}/guests`}>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs hover:bg-[#F1EFE4]">
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
                    className="p-2 rounded-lg text-[#6B5E55] hover:text-[#4C6957] hover:bg-[#F1EFE4] transition-colors"
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
