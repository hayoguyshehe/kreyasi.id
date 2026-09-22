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
    <div className="space-y-4 pb-2 border-b border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/invitations"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Kembali ke Daftar Undangan"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="truncate">
            <h2 className="text-lg font-bold font-serif text-white truncate max-w-md">
              {title}
            </h2>
            <p className="text-[11px] text-slate-400 truncate">
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
          <Button variant="outline" size="sm" className="gap-1.5 text-xs">
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
                  ? "bg-amber-500/10 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
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
