import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Heart,
  Music,
  MapPin,
  Gift,
  Users,
  Smartphone,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-linear-to-b from-amber-500/15 via-amber-500/5 to-transparent blur-[140px] pointer-events-none" />
      <div className="absolute top-200 right-[-10%] w-150 h-125 bg-[#E0A899]/10 blur-[150px] pointer-events-none" />

      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-medium text-amber-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Platform SaaS Undangan Digital Self-Service #1</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15]">
            Undangan Digital Eksklusif, Siap Dibagikan dalam{" "}
            <span className="gold-gradient-text">Hitungan Menit</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Buat undangan pernikahan & acara spesial Anda dengan desain elegan.
            Lengkap dengan buku tamu, RSVP real-time, musik latar, amplop kado digital,
            dan link personal WhatsApp yang siap dikirim.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button variant="gold" size="lg" className="w-full sm:w-auto gap-2 shadow-xl">
                <span>Buat Undangan Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Lihat Katalog Template
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center gap-6 pt-6 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tanpa Perlu Skill Desain
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Langsung Online Instan
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Terintegrasi RSVP & WA
            </span>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="mt-16 max-w-4xl mx-auto relative">
          <div className="relative rounded-2xl p-2 sm:p-4 bg-linear-to-b from-amber-500/20 via-slate-800/40 to-slate-900/60 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
            <div className="rounded-xl overflow-hidden bg-[#12151C] border border-slate-800 p-6 sm:p-10 text-center relative">
              <div className="max-w-md mx-auto space-y-6 py-6">
                <div className="inline-block px-4 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-amber-300">
                  Kepada Yth. Bapak/Ibu/Saudara/i: <strong className="text-white font-semibold">Budi Santoso & Partner</strong>
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-400 font-medium">
                    The Wedding of
                  </p>
                  <h2 className="text-3xl sm:text-4xl font-serif text-white font-bold">
                    Dimas & Amanda
                  </h2>
                  <p className="text-xs text-slate-400">Sabtu, 28 November 2026 • Grand Ballroom Jakarta</p>
                </div>

                {/* Simulated Countdown */}
                <div className="grid grid-cols-4 gap-2 pt-2">
                  {[
                    { label: "Hari", val: "68" },
                    { label: "Jam", val: "14" },
                    { label: "Menit", val: "35" },
                    { label: "Detik", val: "22" },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-center">
                      <span className="block text-lg font-bold text-amber-300 font-mono">{item.val}</span>
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-center gap-3">
                  <div className="px-4 py-2 rounded-full bg-amber-500 text-slate-950 font-semibold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20">
                    <Heart className="w-3.5 h-3.5 fill-slate-950" /> Buka Undangan
                  </div>
                  <div className="p-2 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                    <Music className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <section className="border-y border-slate-800/80 bg-[#0E1117] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-3xl sm:text-4xl font-bold font-serif gold-gradient-text">10.000+</span>
            <span className="text-xs text-slate-400 mt-1 block">Undangan Terbit</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-bold font-serif gold-gradient-text">500.000+</span>
            <span className="text-xs text-slate-400 mt-1 block">Tamu Undangan</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-bold font-serif gold-gradient-text">99.9%</span>
            <span className="text-xs text-slate-400 mt-1 block">Uptime Server Cepat</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-bold font-serif gold-gradient-text">4.9 / 5</span>
            <span className="text-xs text-slate-400 mt-1 block">Ulasan Kepuasan</span>
          </div>
        </div>
      </section>

      {/* 3. BENTO GRID FEATURES */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="gold">Fitur Lengkap</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
            Semua yang Anda Butuhkan dalam Satu Platform
          </h2>
          <p className="text-sm text-slate-400">
            Didesain khusus untuk mempermudah calon pengantin dan pemilik acara mengelola undangan dari awal hingga hari-H.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Self-Service Editor Cepat</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Edit nama, tanggal, lokasi acara, galeri foto, hingga musik latar secara mandiri dengan live preview tanpa harus menunggu admin.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Link Personal & Direct WA</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Cantumkan nama tamu secara khusus pada undangan. Kirim tautan dan template pesan WhatsApp dengan satu klik mudah.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Rekap RSVP & Buku Tamu</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ketahui jumlah tamu yang hadir secara pasti untuk estimasi katering. Tamu juga dapat meninggalkan pesan doa dan ucapan bahagia.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Amplop Kado Digital (QRIS)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Fasilitasi tamu yang berhalangan hadir dengan informasi transfer rekening bank atau scan QRIS langsung tanpa perantara biaya tersembunyi.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Integrasi Peta Google Maps</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pandu tamu ke lokasi acara dengan integrasi Google Maps dan fitur petunjuk arah langsung di ponsel mereka.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="p-7 rounded-2xl bg-[#14171F] border border-slate-800/80 space-y-4 hover:border-amber-500/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-semibold text-white">Keamanan & Anti-XSS</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Buku tamu terlindungi dari spam dan skrip jahat dengan sanitasi otomatis, serta fitur moderasi pesan langsung dari dashboard Anda.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE SHOWCASE TEASER */}
      <section className="py-20 bg-[#0E1117] border-y border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <Badge variant="gold" className="mb-2">Desain Pilihan</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
                Template Elegan untuk Setiap Tema Acara
              </h2>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm" className="gap-1.5">
                <span>Semua Template</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Royal Javanese Gold",
                category: "Pernikahan",
                tier: "Mulai Paket Standar",
                image: "/templates/royal-javanese.jpg",
                desc: "Kombinasi ornamen klasik Jawa bernuansa emas mewah dan tematik batik.",
              },
              {
                title: "Modern Minimalist Emerald",
                category: "Pernikahan",
                tier: "Mulai Paket Basic",
                image: "/templates/modern-emerald.jpg",
                desc: "Gaya kontemporer bersih dengan sentuhan emerald sage dan tipografi modern.",
              },
              {
                title: "Ethereal Floral Rose",
                category: "Pernikahan",
                tier: "Mulai Paket Premium",
                image: "/templates/floral-rose.jpg",
                desc: "Aura romantis nuansa rose gold dengan elemen bunga artistik dan transisi anggun.",
              },
            ].map((tpl) => (
              <div
                key={tpl.title}
                className="rounded-xl overflow-hidden bg-[#14171F] border border-slate-800 group hover:border-amber-500/50 transition-all duration-200"
              >
                <div className="h-52 bg-linear-to-br from-slate-800 to-slate-900 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors" />
                  <span className="text-xs text-slate-500 font-mono tracking-wider">
                    [Preview: {tpl.title}]
                  </span>
                  <div className="absolute top-3 left-3">
                    <Badge variant="gold">{tpl.category}</Badge>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-base">{tpl.title}</h3>
                    <span className="text-[11px] text-amber-400 font-medium">{tpl.tier}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{tpl.desc}</p>
                  <Link href="/templates" className="block pt-2">
                    <Button variant="secondary" size="sm" className="w-full justify-center">
                      Lihat Detail Desain
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRICING TEASER */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        <Badge variant="gold">Harga Transparan</Badge>
        <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white">
          Pilihan Paket Sesuai Kebutuhan Anda
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Mulai dari paket gratis untuk mencoba, hingga paket eksklusif dengan custom domain pribadi.
        </p>

        <div className="pt-4">
          <Link href="/pricing">
            <Button variant="gold" size="lg" className="gap-2">
              <span>Buka Tabel Perbandingan Harga Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-[#0E1117] border-t border-slate-800/80 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs text-slate-400">
              Segala hal yang perlu Anda ketahui tentang pembuatan undangan di Kreyasi.id
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Berapa lama proses pembuatan undangan?",
                a: "Hanya beberapa menit! Karena Kreyasi adalah platform self-service otomatis, begitu Anda mengisi formulir dan memilih template, tautan undangan Anda langsung aktif seketika.",
              },
              {
                q: "Apakah saya bisa mengubah isi undangan setelah dipublikasikan?",
                a: "Tentu saja. Anda dapat mengubah foto, memperbaiki tulisan nama, mengganti tanggal atau lokasi kapan saja melalui Dashboard tanpa mengubah tautan undangan.",
              },
              {
                q: "Bagaimana cara membagikan nama tamu secara khusus?",
                a: "Di menu Tamu Undangan, Anda cukup memasukkan daftar nama tamu. Sistem akan otomatis membuatkan link personal unik (contoh: kreyasi.id/u/nama-acara?to=Budi-Santoso) beserta tombol kirim WhatsApp.",
              },
              {
                q: "Metode pembayaran apa saja yang didukung?",
                a: "Kami mendukung QRIS (BCA, GoPay, OVO, Dana, ShopeePay), Virtual Account semua bank nasional, dan kartu kredit melalui Midtrans Payment Gateway yang aman.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 rounded-xl bg-[#14171F] border border-slate-800 space-y-2">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-slate-400 pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-14 rounded-3xl glass-panel-gold space-y-6 relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white max-w-xl mx-auto">
            Wujudkan Undangan Impian Anda Sekarang Juga
          </h2>
          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pasangan yang telah mempercayakan momen bahagianya bersama Kreyasi.id.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button variant="gold" size="lg" className="gap-2 shadow-2xl">
                <span>Mulai Buat Undangan Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
