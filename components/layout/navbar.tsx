"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Template", href: "/templates" },
    { name: "Harga & Paket", href: "/pricing" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#EAE3D8] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group py-1">
            <Image
              src="/images/logo/kreyasi-logo-web-1.png"
              alt="Kreyasi.id"
              width={140}
              height={45}
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              priority
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isActive
                      ? "text-[#4C6957] font-semibold"
                      : "text-[#6B5E55] hover:text-[#4C6957]"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard">
                <Button variant="gold" size="sm">
                  <span>Dashboard Saya</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="gold" size="sm">
                    <span>Mulai Buat Undangan</span>
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F3ECE4] focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF7F2] border-b border-[#EAE3D8] px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-md">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-base font-medium text-[#2A211B] hover:bg-[#F3ECE4] hover:text-[#4C6957] transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="pt-3 border-t border-[#EAE3D8] flex flex-col gap-2">
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="gold" className="w-full justify-center">
                  Buka Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="secondary" className="w-full justify-center">
                    Masuk
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="gold" className="w-full justify-center">
                    Mulai Buat Undangan
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
