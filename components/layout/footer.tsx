import React from "react";
import Link from "next/link";
import { Sparkles, Heart, ShieldCheck, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#0D0F14] border-t border-slate-800/80 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
                <Sparkles className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Kreyasi<span className="text-amber-400">.id</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform pembuatan undangan digital premium berbasis SaaS self-service.
              Praktis, elegan, terintegrasi RSVP real-time, pemutar musik, peta navigasi, dan amplop kado digital.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Terenkripsi & Aman
              </span>
              <span>Dibuat dengan rasa cinta di Indonesia</span>
            </div>
          </div>

          {/* Nav Col 1: Produk */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Produk
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates" className="hover:text-amber-400 transition-colors">
                  Katalog Template
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                  Daftar Harga & Paket
                </Link>
              </li>
              <li>
                <Link href="/templates?category=pernikahan" className="hover:text-amber-400 transition-colors">
                  Undangan Pernikahan
                </Link>
              </li>
              <li>
                <Link href="/templates?category=ulang-tahun" className="hover:text-amber-400 transition-colors">
                  Undangan Ulang Tahun
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Col 2: Fitur Utama */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Fitur Utama
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <span className="text-slate-400">RSVP & Buku Tamu Interaktif</span>
              </li>
              <li>
                <span className="text-slate-400">Amplop Kado Digital (QRIS)</span>
              </li>
              <li>
                <span className="text-slate-400">WhatsApp Link Generator</span>
              </li>
              <li>
                <span className="text-slate-400">Integrasi Google Maps</span>
              </li>
              <li>
                <span className="text-slate-400">Musik Latar Autoplay</span>
              </li>
            </ul>
          </div>

          {/* Nav Col 3: Hubungi & Bantuan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Bantuan
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:support@kreyasi.id" className="hover:text-amber-400 transition-colors">
                  support@kreyasi.id
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>0812-3456-7890 (WA)</span>
              </li>
              <li>
                <Link href="/login" className="hover:text-amber-400 transition-colors">
                  Login Pelanggan
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-amber-400 transition-colors">
                  Daftar Akun Baru
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Kreyasi.id. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1">
              Dirancang dengan <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> untuk momen spesial Anda
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
