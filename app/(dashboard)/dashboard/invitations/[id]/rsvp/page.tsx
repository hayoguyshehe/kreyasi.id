import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { InvitationNav } from "@/components/dashboard/invitation-nav";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle, HelpCircle, Users, MessageSquare } from "lucide-react";
import { formatDateIndonesia } from "@/lib/utils";

export default async function InvitationRsvpPage(props: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await props.params;

  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      rsvps: {
        include: {
          guest: { select: { name: true, whatsapp: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!invitation) {
    notFound();
  }

  if (
    invitation.userId !== session.user.id &&
    session.user.role !== "ADMIN" &&
    session.user.role !== "SUPERADMIN"
  ) {
    redirect("/dashboard");
  }

  const rsvps = invitation.rsvps;

  let totalHadir = 0;
  let totalTidakHadir = 0;
  let totalRagu = 0;
  let totalPorsiHadir = 0;

  for (const r of rsvps) {
    if (r.status === "HADIR") {
      totalHadir += 1;
      totalPorsiHadir += r.attendeeCount;
    } else if (r.status === "TIDAK_HADIR") {
      totalTidakHadir += 1;
    } else {
      totalRagu += 1;
    }
  }

  return (
    <div className="space-y-6">
      <InvitationNav
        id={invitation.id}
        slug={invitation.slug}
        title={invitation.eventTitle}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="default" className="p-4 space-y-1 border-[#EAE3D8] shadow-xs">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Konfirmasi Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold text-emerald-600 font-serif">{totalHadir}</p>
          <span className="text-[10px] text-[#7A6D63] block">tamu menyatakan hadir</span>
        </Card>

        <Card variant="default" className="p-4 space-y-1 border-[#EAE3D8] shadow-xs">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Estimasi Porsi</span>
            <Users className="w-4 h-4 text-[#4C6957]" />
          </div>
          <p className="text-2xl font-bold text-[#4C6957] font-serif">{totalPorsiHadir}</p>
          <span className="text-[10px] text-[#7A6D63] block">total porsi katering</span>
        </Card>

        <Card variant="default" className="p-4 space-y-1 border-[#EAE3D8] shadow-xs">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Ragu-ragu</span>
            <HelpCircle className="w-4 h-4 text-[#C5A059]" />
          </div>
          <p className="text-2xl font-bold text-[#C5A059] font-serif">{totalRagu}</p>
          <span className="text-[10px] text-[#7A6D63] block">belum bisa memastikan</span>
        </Card>

        <Card variant="default" className="p-4 space-y-1 border-[#EAE3D8] shadow-xs">
          <div className="flex items-center justify-between text-[#6B5E55]">
            <span className="text-xs font-semibold">Tidak Hadir</span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-red-500 font-serif">{totalTidakHadir}</p>
          <span className="text-[10px] text-[#7A6D63] block">berhalangan hadir</span>
        </Card>
      </div>

      {/* RSVP Table */}
      <Card variant="default" className="overflow-hidden border-[#EAE3D8] shadow-xs">
        <div className="p-4 border-b border-[#EAE3D8] bg-[#FAF7F2] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#2A211B]">Daftar Konfirmasi Masuk</h3>
          <span className="text-xs text-[#7A6D63]">Total {rsvps.length} Respon</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAF7F2] border-b border-[#EAE3D8] text-[#6B5E55]">
              <tr>
                <th className="p-4 font-semibold">Nama Tamu</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Jumlah Porsi</th>
                <th className="p-4 font-semibold">Pesan / Doa</th>
                <th className="p-4 font-semibold text-right">Waktu Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D8] text-[#2A211B]">
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[#7A6D63]">
                    Belum ada tamu yang mengirimkan konfirmasi kehadiran RSVP.
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp) => {
                  const guestName =
                    rsvp.guest?.name || rsvp.guestNameFallback || "Pengunjung";
                  return (
                    <tr key={rsvp.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-[#2A211B] block">{guestName}</span>
                        {rsvp.guest?.whatsapp && (
                          <span className="text-[10px] text-[#7A6D63]">
                            {rsvp.guest.whatsapp}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            rsvp.status === "HADIR"
                              ? "success"
                              : rsvp.status === "TIDAK_HADIR"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {rsvp.status === "HADIR"
                            ? "Hadir"
                            : rsvp.status === "TIDAK_HADIR"
                            ? "Tidak Hadir"
                            : "Ragu"}
                        </Badge>
                      </td>
                      <td className="p-4 text-center font-bold text-[#2A211B] font-mono">
                        {rsvp.attendeeCount}
                      </td>
                      <td className="p-4 max-w-xs text-[#5A4D44]">
                        {rsvp.message || <span className="text-[#7A6D63] italic">-</span>}
                      </td>
                      <td className="p-4 text-right text-[#7A6D63] whitespace-nowrap">
                        {formatDateIndonesia(rsvp.createdAt)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
