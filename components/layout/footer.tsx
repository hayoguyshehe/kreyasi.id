import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#241E19] text-[#A69B92] text-sm border-t border-[#382E26]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-[#C5A059] to-[#9A7527] flex items-center justify-center text-white font-bold shadow-sm shadow-[#C5A059]/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#FBF9F5] font-serif">
                Kreyasi<span className="text-[#C5A059]">.id</span>
              </span>
            </Link>
            <p className="text-sm text-[#A69B92] max-w-sm leading-relaxed">
              Platform undangan pernikahan & acara digital dengan estetika elegan khas Indonesia.
              Praktis, khidmat, terintegrasi RSVP langsung, amplop kado digital, dan navigasi lokasi.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-[#8E837B]">
              <span className="inline-flex items-center gap-1.5 text-[#C5A059] bg-[#C5A059]/10 px-2.5 py-1 rounded-full border border-[#C5A059]/25">
                <ShieldCheck className="w-3.5 h-3.5" /> Terenkripsi & Terpercaya
              </span>
              <span>Dibuat dengan rasa cinta di Indonesia</span>
            </div>
          </div>

          {/* Nav Col 1: Produk */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FBF9F5]">
              Koleksi Desain
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates" className="hover:text-[#C5A059] transition-colors">
                  Katalog Template
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#C5A059] transition-colors">
                  Daftar Pilihan Paket
                </Link>
              </li>
              <li>
                <Link href="/templates?category=pernikahan" className="hover:text-[#C5A059] transition-colors">
                  Undangan Pernikahan
                </Link>
              </li>
              <li>
                <Link href="/templates?category=ulang-tahun" className="hover:text-[#C5A059] transition-colors">
                  Undangan Ulang Tahun & Khitan
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Fitur Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FBF9F5]">
              Fitur Lengkap
            </h4>
            <ul className="space-y-2 text-sm text-[#8E837B]">
              <li>RSVP & Konfirmasi Tamu</li>
              <li>Amplop Kado Digital (QRIS & Bank)</li>
              <li>Tautan Personal Nama Tamu</li>
              <li>Panduan Lokasi Google Maps</li>
              <li>Musik Pengiring Suasana</li>
            </ul>
          </div>

          {/* Nav Col 3: Hubungi & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#FBF9F5]">
              Bantuan & Layanan
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href="mailto:support@kreyasi.id" className="hover:text-[#C5A059] transition-colors">
                  support@kreyasi.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>0812-3456-7890 (WhatsApp)</span>
              </li>
              <li className="pt-1">
                <Link href="/login" className="hover:text-[#C5A059] transition-colors">
                  Masuk ke Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#C5A059] transition-colors">
                  Daftar Sekarang
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-8 border-t border-[#382E26] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A7068]">
          <p>© {new Date().getFullYear()} Kreyasi.id. Seluruh hak cipta dilindungi undang-undang.</p>
          <div className="flex items-center gap-2">
            <span>Dirancang dengan</span>
            <Heart className="w-3.5 h-3.5 text-[#D4A59A] fill-[#D4A59A]" />
            <span>untuk momen terindah Anda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
