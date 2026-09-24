"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Edit3,
  Users,
  CheckCircle,
  BookOpen,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface InvitationNavProps {
  id: string;
  slug: string;
  title: string;
}

export function InvitationNav({ id, slug, title }: InvitationNavProps) {
  const pathname = usePathname();

  const links = [
    {
      name: "Editor Undangan",
      href: `/dashboard/invitations/${id}`,
      icon: <Edit3 className="w-4 h-4" />,
      exact: true,
    },
    {
      name: "Daftar Tamu",
      href: `/dashboard/invitations/${id}/guests`,
      icon: <Users className="w-4 h-4" />,
    },
    {
      name: "Rekap RSVP",
      href: `/dashboard/invitations/${id}/rsvp`,
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      name: "Buku Tamu",
      href: `/dashboard/invitations/${id}/guestbook`,
      icon: <BookOpen className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4 pb-2 border-b border-[#EAE3D8]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invitations"
            className="p-1.5 rounded-lg text-[#7A6D63] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
            title="Kembali ke Daftar Undangan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="truncate">
            <h2 className="text-lg font-bold font-serif text-[#2A211B] truncate max-w-md">
              {title}
            </h2>
            <p className="text-[11px] text-[#6B5E55] truncate">
              Tautan: kreyasi.id/u/{slug}
            </p>
          </div>
        </div>

        <a
          href={`/u/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex"
        >
          <Button variant="outline" size="sm" className="gap-1.5 text-xs hover:border-[#4C6957] hover:text-[#4C6957]">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Buka Undangan Tamu</span>
          </Button>
        </a>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {links.map((link) => {
          const isActive = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-white text-[#4C6957] border border-[#DFC798] shadow-xs"
                  : "text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4]"
              }`}
            >
              {link.icon}
              <span>{link.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
