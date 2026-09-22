import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { InvitationView } from "@/components/invitation/invitation-view";
import { formatDateIndonesia } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ to?: string }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const personalSlug = searchParams?.to;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    select: {
      eventTitle: true,
      eventDate: true,
      content: true,
      status: true,
      expiresAt: true,
      media: { take: 1, select: { url: true } },
    },
  });

  if (!invitation || invitation.status !== "PUBLISHED") {
    return {
      title: "Undangan Tidak Ditemukan | Kreyasi.id",
    };
  }

  let guestName = "";
  if (personalSlug) {
    const guest = await prisma.guest.findUnique({
      where: { personalSlug },
      select: { name: true },
    });
    if (guest) {
      guestName = `Kepada Yth. ${guest.name} • `;
    }
  }

  const coverPhoto = invitation.media[0]?.url || "/images/og-default.jpg";
  const dateStr = formatDateIndonesia(invitation.eventDate);

  return {
    title: `${guestName}${invitation.eventTitle} | Undangan Digital Kreyasi`,
    description: `Tanpa mengurangi rasa hormat, kami mengundang Anda untuk menghadiri acara kami pada ${dateStr}.`,
    openGraph: {
      title: `${guestName}${invitation.eventTitle}`,
      description: `Undangan digital resmi: ${invitation.eventTitle} - ${dateStr}`,
      images: [{ url: coverPhoto, width: 1200, height: 630 }],
    },
  };
}

export default async function PublicInvitationPage(props: PageProps) {
  const { slug } = await props.params;
  const searchParams = await props.searchParams;
  const personalSlug = searchParams?.to;

  const invitation = await prisma.invitation.findUnique({
    where: { slug },
    include: {
      template: true,
      giftAccounts: true,
      media: {
        orderBy: { sortOrder: "asc" },
      },
      guestbook: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // 1. Mengembalikan 404/not-found kalau Invitation tidak ada atau status !== 'PUBLISHED'
  if (!invitation || invitation.status !== "PUBLISHED") {
    notFound();
  }

  // 2. Menampilkan state "undangan sudah tidak aktif" (bukan konten normal) kalau Invitation.expiresAt sudah lewat waktu sekarang
  const now = new Date();
  const isExpired = Boolean(
    invitation.expiresAt && new Date(invitation.expiresAt).getTime() < now.getTime()
  );

  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#0B0D11] text-white flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#14171F] border border-amber-500/20 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <span className="inline-block text-[10px] uppercase font-semibold tracking-widest text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Masa Aktif Berakhir
            </span>
            <h1 className="text-xl font-bold font-serif text-white">
              Undangan Sudah Tidak Aktif
            </h1>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Terima kasih telah mengunjungi undangan digital{" "}
            <span className="text-amber-300 font-medium">{invitation.eventTitle}</span>. Masa aktif undangan ini telah berakhir.
          </p>
        </div>
      </div>
    );
  }

  // Look up guest personal slug if provided
  let guestName: string | null = null;
  if (personalSlug) {
    const guest = await prisma.guest.findUnique({
      where: { personalSlug },
    });

    if (guest && guest.invitationId === invitation.id) {
      guestName = guest.name;

      // Update openedAt timestamp
      if (!guest.openedAt) {
        await prisma.guest.update({
          where: { id: guest.id },
          data: { openedAt: new Date() },
        });
      }
    }
  }

  return (
    <InvitationView
      invitation={{
        ...invitation,
        eventDate: invitation.eventDate.toISOString(),
      }}
      guestName={guestName}
      guestPersonalSlug={personalSlug}
    />
  );
}
