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
        <Card variant="subtle" className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Konfirmasi Hadir</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-serif">{totalHadir}</p>
          <span className="text-[10px] text-slate-500 block">tamu menyatakan hadir</span>
        </Card>

        <Card variant="subtle" className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Estimasi Porsi</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-300 font-serif">{totalPorsiHadir}</p>
          <span className="text-[10px] text-slate-500 block">total porsi katering</span>
        </Card>

        <Card variant="subtle" className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Ragu-ragu</span>
            <HelpCircle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-serif">{totalRagu}</p>
          <span className="text-[10px] text-slate-500 block">belum bisa memastikan</span>
        </Card>

        <Card variant="subtle" className="p-4 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs">Tidak Hadir</span>
            <XCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400 font-serif">{totalTidakHadir}</p>
          <span className="text-[10px] text-slate-500 block">berhalangan hadir</span>
        </Card>
      </div>

      {/* RSVP Table */}
      <Card variant="subtle" className="overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Daftar Konfirmasi Masuk</h3>
          <span className="text-xs text-slate-500">Total {rsvps.length} Respon</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1C212C] border-b border-slate-800 text-slate-300">
              <tr>
                <th className="p-4 font-semibold">Nama Tamu</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-center">Jumlah Porsi</th>
                <th className="p-4 font-semibold">Pesan / Doa</th>
                <th className="p-4 font-semibold text-right">Waktu Konfirmasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {rsvps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Belum ada tamu yang mengirimkan konfirmasi kehadiran RSVP.
                  </td>
                </tr>
              ) : (
                rsvps.map((rsvp) => {
                  const guestName =
                    rsvp.guest?.name || rsvp.guestNameFallback || "Pengunjung";
                  return (
                    <tr key={rsvp.id} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4">
                        <span className="font-semibold text-white block">{guestName}</span>
                        {rsvp.guest?.whatsapp && (
                          <span className="text-[10px] text-slate-500">
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
                      <td className="p-4 text-center font-bold text-white font-mono">
                        {rsvp.attendeeCount}
                      </td>
                      <td className="p-4 max-w-xs text-slate-300">
                        {rsvp.message || <span className="text-slate-500 italic">-</span>}
                      </td>
                      <td className="p-4 text-right text-slate-500 whitespace-nowrap">
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
