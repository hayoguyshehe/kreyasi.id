import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  Heart,
  Music,
  MapPin,
  Gift,
  Users,
  Smartphone,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden bg-[#FAF7F2] text-[#2A211B]">
      {/* 1. HERO SECTION */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Subtle Romantic Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FAF2E4] border border-[#EBD5B2] text-xs font-medium text-[#8C6A28]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Platform Undangan Pernikahan & Acara Spesial</span>
          </div>

          {/* Editorial Serif Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-[#2A211B] leading-[1.18]">
            Undangan Pernikahan Digital yang{" "}
            <span className="gold-foil-text italic font-normal">Anggun</span>,{" "}
            Hangat & Penuh Makna
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#6B5E55] max-w-2xl mx-auto leading-relaxed font-sans">
            Rayakan momen suci Anda bersama keluarga dan sahabat tercinta. Lengkap dengan sapaan
            nama personal, konfirmasi kehadiran (RSVP), amplop kado digital, dan panduan lokasi yang santun.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
            <Link href="/register" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="w-full sm:w-auto px-8 shadow-md">
                Buat Undangan Sekarang
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-7">
                Lihat Koleksi Desain
              </Button>
            </Link>
          </div>

          {/* Hallmarks of Quality */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-5 text-xs text-[#7A6E65]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4C6957]" /> Tanpa Perlu Skill Desain
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4C6957]" /> Tautan WhatsApp Siap Kirim
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#4C6957]" /> Langsung Aktif Seketika
            </span>
          </div>
        </div>

        {/* Hero Visual Mockup: Authentic Wedding Stationery Card */}
        <div className="mt-16 max-w-3xl mx-auto">
          <div className="paper-card-gold rounded-3xl p-3 sm:p-5 bg-white relative">
            <div className="rounded-2xl border border-[#EBD5B2] bg-[#FAF8F5] p-6 sm:p-12 text-center relative overflow-hidden">
              {/* Corner Floral Ornaments Placeholder Cues */}
              <div className="absolute top-3 left-3 text-[#D5C2A5] text-xs font-serif opacity-60">❧</div>
              <div className="absolute top-3 right-3 text-[#D5C2A5] text-xs font-serif opacity-60">☙</div>
              <div className="absolute bottom-3 left-3 text-[#D5C2A5] text-xs font-serif opacity-60">❧</div>
              <div className="absolute bottom-3 right-3 text-[#D5C2A5] text-xs font-serif opacity-60">☙</div>

              <div className="max-w-md mx-auto space-y-6 py-4">
                {/* Formal Salutation Box */}
                <div className="inline-block px-4 py-1.5 rounded-full bg-white border border-[#EAE3D8] text-xs text-[#6B5E55] shadow-2xs">
                  Kepada Yth. Bapak/Ibu/Saudara/i:{" "}
                  <strong className="text-[#2A211B] font-semibold">Budi Santoso & Partner</strong>
                </div>

                {/* Authentic Botanical Monogram Crest */}
                <div className="flex justify-center pt-1">
                  <Image
                    src="/images/logo/kreyasi-profile.png"
                    alt="Kreyasi Seal"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full shadow-sm border-2 border-white ring-1 ring-[#4C6957]/30"
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[#8C6A28] font-medium">
                    The Wedding Celebration of
                  </p>
                  <h2 className="text-3xl sm:text-5xl font-serif text-[#2A211B] font-bold tracking-tight">
                    Dimas & Amanda
                  </h2>
                  <p className="text-xs sm:text-sm text-[#7A6E65] pt-1">
                    Sabtu, 28 November 2026 • Grand Ballroom Jakarta
                  </p>
                </div>

                {/* Ornamental Hairline */}
                <div className="w-24 h-px bg-linear-to-r from-transparent via-[#C5A059] to-transparent mx-auto" />

                {/* Simulated Countdown */}
                <div className="grid grid-cols-4 gap-2 pt-1 max-w-xs mx-auto">
                  {[
                    { label: "Hari", val: "68" },
                    { label: "Jam", val: "14" },
                    { label: "Menit", val: "35" },
                    { label: "Detik", val: "22" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#EAE3D8] text-center shadow-2xs"
                    >
                      <span className="block text-base sm:text-lg font-bold text-[#8C6A28] font-serif">
                        {item.val}
                      </span>
                      <span className="text-[10px] text-[#8E837B]">{item.label}</span>
                    </div>
                  ))}
                </div>

                {/* Open Invitation CTA */}
                <div className="pt-2 flex items-center justify-center gap-3">
                  <div className="px-5 py-2.5 rounded-full bg-[#C5A059] text-white font-semibold text-xs flex items-center gap-2 shadow-sm">
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Buka Undangan</span>
                  </div>
                  <div className="p-2.5 rounded-full bg-white text-[#8C6A28] border border-[#EAE3D8] shadow-2xs">
                    <Music className="w-4 h-4 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION (Harmonious Ivory Band) */}
      <section className="border-y border-[#EAE3D8] bg-[#F5EFEB] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <span className="block text-3xl sm:text-4xl font-serif font-bold text-[#8C6A28]">
              10.000+
            </span>
            <span className="text-xs text-[#7A6E65] mt-1 block">Pasangan Berbahagia</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-serif font-bold text-[#8C6A28]">
              500.000+
            </span>
            <span className="text-xs text-[#7A6E65] mt-1 block">Tamu Terhubung</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-serif font-bold text-[#8C6A28]">
              99.9%
            </span>
            <span className="text-xs text-[#7A6E65] mt-1 block">Keandalan Akses Hari-H</span>
          </div>
          <div>
            <span className="block text-3xl sm:text-4xl font-serif font-bold text-[#8C6A28]">
              4.9 / 5
            </span>
            <span className="text-xs text-[#7A6E65] mt-1 block">Ulasan Kepuasan Pengantin</span>
          </div>
        </div>
      </section>

      {/* 3. WEDDING CEREMONIAL PILLARS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="sage">Fitur Lengkap & Bermartabat</Badge>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B]">
            Setiap Detail Dirancang untuk Memuliakan Tamu Anda
          </h2>
          <p className="text-sm text-[#6B5E55] leading-relaxed">
            Menyatukan keanggunan tata krama pernikahan Indonesia dengan kemudahan teknologi masa kini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#4C6957]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#EEF3EF] border border-[#C6D5C7] flex items-center justify-center text-[#4C6957]">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Tautan Personal & Sapaan WhatsApp
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Cantumkan nama tamu secara khusus pada kartu pembuka. Bagikan undangan via WhatsApp dengan format pesan santun yang siap kirim.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#C5A059]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF2E4] border border-[#EBD5B2] flex items-center justify-center text-[#8C6A28]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Konfirmasi Kehadiran & Doa Restu
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Ketahui kepastian jumlah tamu yang hadir untuk akurasi katering dan tempat duduk. Tamu dapat mengirimkan untaian doa restu terbaik.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#4C6957]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#EEF3EF] border border-[#C6D5C7] flex items-center justify-center text-[#4C6957]">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Amplop Kado Digital (QRIS & Bank)
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Fasilitasi tamu yang berhalangan hadir dengan nomor rekening atau scan QRIS langsung ke rekening Anda tanpa potongan biaya tersembunyi.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#C5A059]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#FAF2E4] border border-[#EBD5B2] flex items-center justify-center text-[#8C6A28]">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Panduan Rute Lokasi Google Maps
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Tamu dapat langsung membuka petunjuk arah di ponsel mereka, memastikan keluarga dan sahabat tiba di lokasi acara tepat waktu.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#4C6957]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#EEF3EF] border border-[#C6D5C7] flex items-center justify-center text-[#4C6957]">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Musik Pengiring & Galeri Kisah Cinta
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Putar lagu kenangan berdua secara otomatis dengan pemutar audio yang elegan, dilengkapi album foto pre-wedding beresolusi tinggi.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="paper-card rounded-2xl p-7 space-y-4 hover:border-[#4C6957]/60 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#EEF3EF] border border-[#C6D5C7] flex items-center justify-center text-[#4C6957]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#2A211B]">
              Editor Mandiri Bebas Ubah Kapan Saja
            </h3>
            <p className="text-sm text-[#6B5E55] leading-relaxed">
              Ada perubahan jadwal atau koreksi gelar nama? Edit langsung lewat dashboard Anda seketika tanpa perlu menunggu konfirmasi admin.
            </p>
          </div>
        </div>
      </section>

      {/* 4. TEMPLATE SHOWCASE TEASER */}
      <section className="py-20 bg-[#F5EFEB] border-y border-[#EAE3D8] px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <Badge variant="gold" className="mb-2">Koleksi Desain Nusantara</Badge>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
                Pilihan Tema Undangan Elegan & Abadi
              </h2>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm">
                Lihat Semua Koleksi
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Royal Javanese Gold",
                category: "Adat Tradisional",
                tier: "Mulai Paket Standar",
                desc: "Ornamen klasik bernuansa emas tembaga lembut dengan sentuhan motif batik keraton Jawa.",
              },
              {
                title: "Modern Minimalist Sage",
                category: "Modern Elegan",
                tier: "Mulai Paket Basic",
                desc: "Nuansa kontemporer bersih dengan sentuhan sage green alami dan tipografi berkelas.",
              },
              {
                title: "Ethereal Floral Rose",
                category: "Romantis Floral",
                tier: "Mulai Paket Premium",
                desc: "Aura lembut nuansa dusty rose dengan ornamen bunga artistik dan tata letak anggun.",
              },
            ].map((tpl) => (
              <div
                key={tpl.title}
                className="paper-card rounded-2xl overflow-hidden group hover:border-[#C5A059] transition-all"
              >
                <div className="h-52 bg-linear-to-br from-[#FAF8F5] to-[#EFE8DE] relative flex items-center justify-center border-b border-[#EAE3D8]">
                  <div className="w-32 h-40 rounded-xl border border-[#DFC798] bg-white p-3 text-center flex flex-col justify-between shadow-xs">
                    <span className="text-[8px] text-[#8C6A28] uppercase font-serif tracking-wider">Kreyasi</span>
                    <span className="text-[10px] font-bold text-[#2A211B] font-serif leading-tight">{tpl.title}</span>
                    <Heart className="w-3.5 h-3.5 text-[#C5A059] mx-auto" />
                    <span className="text-[8px] text-[#7A6E65]">Dimas & Amanda</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant={tpl.category === "Modern Elegan" ? "sage" : "gold"}>
                      {tpl.category}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-[#2A211B] text-base">{tpl.title}</h3>
                    <span className="text-[11px] text-[#8C6A28] font-medium">{tpl.tier}</span>
                  </div>
                  <p className="text-xs text-[#6B5E55] leading-relaxed">{tpl.desc}</p>
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
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-6">
        <Badge variant="gold">Investasi Transparan</Badge>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B]">
          Paket Terjangkau untuk Hari yang Tak Terlupakan
        </h2>
        <p className="text-sm text-[#6B5E55] max-w-xl mx-auto leading-relaxed">
          Tersedia mulai dari paket gratis untuk mencoba editor, hingga paket eksklusif berdomain khusus (.com/.id).
        </p>

        <div className="pt-2">
          <Link href="/pricing">
            <Button variant="gold" size="lg" className="px-8 shadow-sm">
              Buka Tabel Perbandingan Paket
            </Button>
          </Link>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-20 bg-[#F5EFEB] border-t border-[#EAE3D8] px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
              Pertanyaan yang Sering Diajukan
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6E65]">
              Segala hal penting seputar pembuatan undangan digital di Kreyasi.id
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Berapa lama proses pembuatan undangan?",
                a: "Hanya dalam hitungan menit! Karena sistem Kreyasi serba mandiri (self-service), begitu formulir data acara diisi dan template dipilih, tautan undangan Anda langsung aktif dan siap disebarkan.",
              },
              {
                q: "Apakah isi undangan bisa diubah setelah disebarkan?",
                a: "Tentu saja. Anda dapat mengganti foto, memperbaiki ejaan nama atau gelar, serta memperbarui waktu acara kapan saja melalui Dashboard tanpa mengubah tautan yang sudah dikirim.",
              },
              {
                q: "Bagaimana cara menyebarkan nama tamu secara personal?",
                a: "Di menu Tamu Undangan, Anda cukup memasukkan daftar nama tamu. Sistem akan otomatis membuatkan tautan personal unik (contoh: kreyasi.id/u/nama-acara?to=Bapak-Budi) dengan tombol kirim WhatsApp langsung.",
              },
              {
                q: "Bagaimana cara tamu mengirimkan kado atau amplop digital?",
                a: "Tamu dapat melihat nomor rekening bank atau memindai kode QRIS langsung di halaman undangan. Dana masuk 100% langsung ke rekening pribadi Anda tanpa perantara pihak ketiga.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="paper-card rounded-xl p-5 space-y-2">
                <h3 className="text-sm font-semibold text-[#2A211B] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4C6957] shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-xs text-[#6B5E55] pl-6 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL INVITATION CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="paper-card-gold rounded-3xl p-10 sm:p-14 space-y-6 relative bg-white">
          <div className="flex justify-center">
            <Image
              src="/images/logo/kreyasi-profile.png"
              alt="Kreyasi Seal"
              width={64}
              height={64}
              className="w-16 h-16 rounded-full shadow-md border-2 border-white ring-2 ring-[#4C6957]/20"
            />
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] max-w-lg mx-auto">
            Mulai Rangkai Momen Bahagia Anda Sekarang
          </h2>
          <p className="text-sm text-[#6B5E55] max-w-md mx-auto leading-relaxed">
            Bergabunglah dengan ribuan pasangan yang telah mempercayakan undangan pernikahan dan hajatan mereka bersama Kreyasi.id.
          </p>
          <div className="pt-2">
            <Link href="/register">
              <Button variant="gold" size="lg" className="px-8 shadow-md">
                Mulai Buat Undangan Gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
