import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, ArrowLeft, FileText, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan Layanan | Kreyasi.id",
  description:
    "Syarat dan ketentuan penggunaan platform undangan pernikahan dan acara digital Kreyasi.id.",
};

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Breadcrumb / Back */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-[#8C6A28] hover:text-[#2A211B] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-3 border-b border-[#EAE3D8] pb-6">
        <Badge variant="sage">Ketentuan Layanan</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
          Syarat &amp; Ketentuan Layanan
        </h1>
        <p className="text-xs sm:text-sm text-[#7A6D63]">
          Terakhir diperbarui: <strong>29 September 2026</strong>
        </p>
      </div>

      {/* Legal Draft Notice Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#F5EFEB] border border-[#C5A059]/40 flex items-start gap-3.5 text-xs text-[#6B5E55] leading-relaxed shadow-xs">
        <AlertTriangle className="w-5 h-5 text-[#8C6A28] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#2A211B]">
            Pemberitahuan Draf Standar Operasional:
          </p>
          <p>
            Dokumen ini merupakan draf standar operasional layanan peranti lunak (SaaS) Kreyasi.id untuk keperluan transparansi pengguna dan bukan merupakan pengganti nasihat hukum resmi. Pemilik produk disarankan untuk meninjau kembali dokumen ini bersama praktisi hukum yang berkompeten sebelum digunakan secara komersial penuh di yurisdiksi Republik Indonesia.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm text-[#4A3E36] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">1.</span> Definisi Layanan
          </h2>
          <p>
            Kreyasi.id (&quot;Platform&quot;, &quot;Kami&quot;) adalah platform berbasis web penyedia layanan pembuatan, pengelolaan, dan penyebaran undangan digital (pernikahan, ulang tahun, khitanan, dan event umum) secara mandiri (*self-service*) oleh pengguna (&quot;Pengguna&quot;, &quot;Anda&quot;).
          </p>
          <p>
            Layanan Kami mencakup pemilihan tema desain, kustomisasi konten (foto, teks, musik pengiring, petunjuk peta lokasi), formulir konfirmasi kehadiran tamu (RSVP), buku ucapan digital, dan integrasi amplop kado digital (QRIS/Transfer Bank).
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">2.</span> Ketentuan Akun Pengguna
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              Pengguna wajib berusia minimal 18 tahun atau telah cakap menurut hukum yang berlaku di Indonesia untuk membuat akun dan melakukan transaksi.
            </li>
            <li>
              Pengguna wajib memberikan informasi yang benar, akurat, dan terkini saat melakukan pendaftaran akun (nama lengkap, email, nomor WhatsApp).
            </li>
            <li>
              Pengguna bertanggung jawab penuh atas keamanan kata sandi dan seluruh aktivitas yang terjadi di bawah akun pribadi Anda.
            </li>
            <li>
              Satu akun diperuntukkan untuk penggunaan pribadi atau penyelenggara acara resmi dan tidak boleh dialihkan kepemilikannya tanpa persetujuan Kami.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">3.</span> Mekanisme Pembelian &amp; Masa Aktif Layanan
          </h2>
          <p>
            Kreyasi.id menerapkan skema <strong>pembelian sekali bayar per undangan/acara (*one-time purchase per event*)</strong>, dan <strong>BUKAN</strong> langganan berulang bulanan (*recurring subscription*):
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              Setiap paket undangan memiliki masa aktif tertentu (misalnya Paket Gratis 3 hari, Basic 30 hari, Standar 90 hari, Premium 180 hari, dan Eksklusif 365 hari) terhitung sejak tanggal aktivasi paket.
            </li>
            <li>
              Selama masa aktif berlangsung, tautan undangan publik dapat diakses bebas oleh tamu dan Pengguna dapat memperbarui data acara sewaktu-waktu.
            </li>
            <li>
              Setelah masa aktif berakhir, tautan undangan publik akan secara otomatis berstatus kedaluwarsa (*EXPIRED*) dan tidak lagi dapat diakses oleh publik.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">4.</span> Tanggung Jawab atas Konten yang Diunggah
          </h2>
          <p>
            Pengguna memegang tanggung jawab mutlak atas setiap teks, foto, video, nomor kontak tamu, serta informasi rekening yang diunggah ke dalam undangan:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              <strong>Larangan Konten Ilegal:</strong> Dilarang keras mengunggah materi yang memuat unsur pornografi, ketelanjangan, kekerasan, perjudian, ujaran kebencian, pencemaran nama baik, SARA, atau konten yang melanggar Undang-Undang Informasi dan Transaksi Elektronik (UU ITE).
            </li>
            <li>
              <strong>Hak Cipta:</strong> Pengguna menjamin bahwa foto dan materi yang diunggah adalah milik pribadi atau telah memiliki izin sah dari pemilik hak cipta terkait.
            </li>
            <li>
              <strong>Amplop Digital:</strong> Kreyasi.id hanya menyediakan media penampil nomor rekening dan gambar QRIS. Kreyasi.id tidak bertindak sebagai perantara penampung dana kado tamu dan tidak bertanggung jawab atas kesalahan nomor rekening yang dicantumkan Pengguna.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">5.</span> Hak Kepemilikan Intelektual
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B] uppercase tracking-wider">
                Milik Kreyasi.id
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Seluruh kode sumber, desain template, struktur antarmuka, aset animasi Lottie bawaan platform, dan merek dagang Kreyasi.id adalah hak milik eksklusif platform yang dilindungi undang-undang.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B] uppercase tracking-wider">
                Milik Pengguna
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Seluruh data pribadi, foto pribadi mempelai, cerita cinta, teks undangan, dan daftar tamu yang dimasukkan oleh Pengguna tetap merupakan hak milik penuh Pengguna.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">6.</span> Penangguhan Akun &amp; Pencopotan Konten
          </h2>
          <p>
            Kreyasi.id berhak secara sepihak untuk menangguhkan (*suspend*), membatasi akses, atau menghapus undangan dan akun Pengguna seketika apabila:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Terjadi pelanggaran terhadap Syarat &amp; Ketentuan ini.</li>
            <li>Adanya laporan dugaan penipuan, sengketa hak cipta, atau aktivitas ilegal yang terverifikasi.</li>
            <li>Upaya peretasan, rekayasa balik (*reverse-engineering*), atau gangguan terhadap infrastruktur platform.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">7.</span> Batasan Tanggung Jawab Platform
          </h2>
          <p>
            Platform disediakan atas dasar &quot;sebagaimana adanya&quot; (*as-is*) dan &quot;sebagaimana tersedia&quot; (*as-available*). Kami berupaya semaksimal mungkin menjaga keandalan sistem, namun Kami tidak menjamin bahwa operasional platform akan bebas gangguan 100% akibat kendala teknis jaringan internet pihak ketiga, bencana alam, atau peristiwa di luar kendali wajar Kami (*force majeure*).
          </p>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">8.</span> Perubahan Ketentuan
          </h2>
          <p>
            Kami dapat memperbarui Syarat &amp; Ketentuan ini sewaktu-waktu. Pembaruan akan berlaku efektif sejak tanggal pembaruan yang tercantum di bagian atas dokumen ini. Dengan terus menggunakan Layanan Kami setelah pembaruan, Pengguna dianggap menyetujui ketentuan yang diperbarui.
          </p>
        </section>

        {/* Section 9: Kontak */}
        <section className="p-5 rounded-2xl bg-white border border-[#EAE3D8] space-y-2">
          <h3 className="font-semibold text-sm text-[#2A211B]">Pertanyaan &amp; Bantuan</h3>
          <p className="text-xs text-[#6B5E55]">
            Apabila Anda memiliki pertanyaan mengenai Syarat &amp; Ketentuan ini, silakan hubungi tim kami melalui email di{" "}
            <a href="mailto:support@kreyasi.id" className="text-[#8C6A28] font-medium hover:underline">
              support@kreyasi.id
            </a>{" "}
            atau saluran bantuan WhatsApp resmi kami.
          </p>
        </section>
      </div>
    </div>
  );
}
