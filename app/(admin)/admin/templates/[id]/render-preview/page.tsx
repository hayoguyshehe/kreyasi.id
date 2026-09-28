import React from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { InvitationView } from "@/components/invitation/invitation-view";

export const metadata: Metadata = {
  title: "Render Preview Undangan (Admin Only)",
  robots: {
    index: false,
    follow: false,
  },
};

interface RenderPreviewPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminRenderPreviewPage(props: RenderPreviewPageProps) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPERADMIN")) {
    redirect("/login?callbackUrl=/admin");
  }

  const { id } = await props.params;

  const template = await prisma.template.findUnique({
    where: { id },
    include: {
      assets: true,
      category: true,
    },
  });

  if (!template) {
    notFound();
  }

  // Dummy date: 30 hari ke depan
  const dummyDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // Buat dummy invitation untuk render responsif template
  const dummyInvitation = {
    id: `dummy-${template.id}`,
    slug: "preview-responsif",
    eventTitle: "The Wedding of Dimas & Sarah",
    eventDate: dummyDate.toISOString(),
    eventCategory: "PERNIKAHAN",
    status: "PUBLISHED",
    template: template,
    media: [
      {
        id: "media-1",
        url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        type: "PHOTO",
      },
      {
        id: "media-2",
        url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
        type: "PHOTO",
      },
      {
        id: "media-3",
        url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
        type: "PHOTO",
      },
    ],
    giftAccounts: [
      {
        id: "gift-1",
        bankName: "Bank Central Asia (BCA)",
        accountNumber: "8410293819",
        accountName: "Dimas Arya Pratama",
      },
      {
        id: "gift-2",
        bankName: "Bank Mandiri",
        accountNumber: "1320029381928",
        accountName: "Sarah Azzahra Putri",
      },
    ],
    guestbook: [
      {
        id: "gb-1",
        name: "Raditya Dika & Anissa",
        message: "Selamat menempuh hidup baru Dimas & Sarah! Semoga sakinah mawaddah warahmah selamanya.",
        createdAt: new Date().toISOString(),
      },
      {
        id: "gb-2",
        name: "Ahmad & Keluarga",
        message: "Barakallahu lakuma wa baraka alaikuma wa jama'a bainakuma fii khoir. Lancar sampai hari H!",
        createdAt: new Date().toISOString(),
      },
    ],
    content: {
      coverTitle: "The Wedding of Dimas & Sarah",
      couple: {
        groomName: "Dimas Arya Pratama, S.Kom.",
        groomNickname: "Dimas",
        groomParents: "Bpk. Bambang Wijaya & Ibu Siti Aminah",
        brideName: "Sarah Azzahra Putri, B.A.",
        brideNickname: "Sarah",
        brideParents: "Bpk. Hendra Gunawan & Ibu Rini Handayani",
      },
      quote:
        "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
      events: [
        {
          name: "Akad Nikah",
          date: dummyDate.toISOString(),
          startTime: "08:00",
          endTime: "10:00",
          venueName: "Masjid Agung Al-Barkah",
          venueAddress: "Jl. Veteran No. 12, Jakarta Pusat",
          mapsUrl: "https://maps.google.com",
        },
        {
          name: "Resepsi Pernikahan",
          date: dummyDate.toISOString(),
          startTime: "11:00",
          endTime: "14:00",
          venueName: "Grand Ballroom Hotel Indonesia Kempinski",
          venueAddress: "Jl. MH Thamrin No. 1, Menteng, Jakarta Pusat",
          mapsUrl: "https://maps.google.com",
        },
      ],
      loveStory: [
        {
          stage: "PERTEMUAN",
          title: "Awal Bersua (2019)",
          body: "Kami pertama kali bertemu di sebuah perpustakaan kampus saat sama-sama sedang menyelesaikan tugas akhir.",
        },
        {
          stage: "LAMARAN",
          title: "Langkah Pasti (2024)",
          body: "Setelah perjalanan panjang bersama, di hadapan kedua keluarga kami memutuskan untuk melangkah ke jenjang yang lebih serius.",
        },
      ],
      galleryPhotos: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&auto=format&fit=crop&q=80",
      ],
      weddingGift: {
        description: "Doa restu Anda adalah karunia terindah bagi kami. Namun apabila berkenan memberikan tanda kasih, dapat melalui rekening berikut:",
        accounts: [
          {
            bankName: "Bank Central Asia (BCA)",
            accountNumber: "8410293819",
            accountName: "Dimas Arya Pratama",
          },
        ],
      },
      theme: {
        primaryColor: (template.themeConfig as any)?.primaryColor || "#C5A059",
        fontFamily: (template.themeConfig as any)?.fontFamily || "Plus Jakarta Sans",
      },
    },
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2]">
      <InvitationView
        invitation={dummyInvitation}
        guestName="Tamu Undangan (Dummy QA Preview)"
        guestPersonalSlug="preview-guest"
      />
    </div>
  );
}
