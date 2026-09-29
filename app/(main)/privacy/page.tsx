import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Lock, AlertTriangle, ArrowLeft, ShieldCheck, Database, Trash2 } from "lucide-react";

export const metadata = {
  title: "Kebijakan Privasi | Kreyasi.id",
  description:
    "Kebijakan privasi dan perlindungan data pribadi pengguna dan tamu undangan digital Kreyasi.id.",
};

export default function PrivacyPage() {
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
        <Badge variant="sage">Privasi &amp; Perlindungan Data</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
          Kebijakan Privasi
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
            Dokumen ini merupakan draf standar operasional perlindungan data pengguna platform Kreyasi.id yang diselaraskan dengan prinsip dasar Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27 Tahun 2022). Dokumen ini bukan pengganti nasihat hukum formal. Pemilik produk disarankan untuk meninjau kembali kebijakan ini bersama konsultan hukum sebelum pemberlakuan komersial penuh.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm text-[#4A3E36] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">1.</span> Data Pribadi yang Kami Kumpulkan
          </h2>
          <p>
            Dalam mengoperasikan layanan undangan digital, Kami mengumpulkan dan mengelola data dalam kategori berikut:
          </p>
          <div className="space-y-3 pt-1">
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B] uppercase tracking-wider">
                A. Data Akun Pengguna (Pembuat Undangan)
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Nama lengkap, alamat email, nomor telepon/WhatsApp, kata sandi terenkripsi (disimpan dalam bentuk hash satu arah <em>bcrypt</em>), foto profil (opsional via Google OAuth), dan riwayat pesanan/faktur paket.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B] uppercase tracking-wider">
                B. Data Konten Acara
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Nama kedua mempelai atau penyelenggara acara, nama orang tua, tanggal, waktu, dan lokasi acara (termasuk titik koordinat Google Maps), cerita cinta (*love story*), foto dan video galeri, serta informasi nomor rekening/gambar QRIS untuk amplop digital.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B] uppercase tracking-wider">
                C. Data Tamu Pihak Ketiga
              </h3>
              <p className="text-xs text-[#6B5E55]">
                Nama tamu (diinput oleh Pengguna untuk personalisasi undangan atau diinput oleh tamu saat mengisi formulir RSVP), nomor WhatsApp tamu (jika diinput oleh Pengguna untuk kemudahan pengiriman tautan undangan), status konfirmasi kehadiran (*Hadir, Tidak Hadir, Ragu*), jumlah pendamping tamu, serta pesan ucapan dan doa yang dikirimkan ke buku tamu publik.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">2.</span> Tujuan Penggunaan Data
          </h2>
          <p>Data yang dikumpulkan digunakan secara eksklusif untuk tujuan:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Menyediakan, mempersonalisasi, dan menayangkan situs web undangan digital secara publik sesuai konfigurasi Pengguna.</li>
            <li>Memproses fitur personalisasi tautan nama tamu (misalnya <code>?to=NamaTamu</code>).</li>
            <li>Mencatat dan merekapitulasi konfirmasi kehadiran (RSVP) serta menampilkan ucapan selamat di buku tamu digital.</li>
            <li>Memproses verifikasi transaksi pembayaran paket secara otomatis dan mencegah penipuan.</li>
            <li>Memberikan layanan bantuan pelanggan serta notifikasi penting terkait masa aktif undangan Anda.</li>
          </ul>
          <p className="text-xs text-[#6B5E55] pt-1">
            <strong>Komitmen:</strong> Kami tidak pernah menjual, menyewakan, atau memperdagangkan data pribadi Pengguna maupun data tamu kepada pihak ketiga untuk kepentingan periklanan pihak luar.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">3.</span> Pihak Ketiga &amp; Pemroses Data Eksternal
          </h2>
          <p>
            Untuk menjalankan infrastruktur yang andal dan aman, Kami bekerjasama dengan mitra penyedia layanan berstandar industri:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B]">Midtrans (Payment Gateway)</h3>
              <p className="text-xs text-[#6B5E55]">
                Memproses pembayaran QRIS, Virtual Account, dan E-Wallet berlisensi Bank Indonesia. Kami tidak pernah melihat atau menyimpan nomor kartu kredit atau PIN perbankan Anda.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B]">Penyedia Cloud Storage</h3>
              <p className="text-xs text-[#6B5E55]">
                Penyedia infrastruktur S3-compatible yang aman untuk menyimpan aset media foto, video, dan animasi Lottie undangan digital.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] space-y-1.5">
              <h3 className="font-semibold text-xs text-[#2A211B]">Database &amp; Hosting Server</h3>
              <p className="text-xs text-[#6B5E55]">
                Penyedia komputasi cloud dan basis data PostgreSQL terenkripsi (<em>encryption at rest</em> dan <em>in transit</em> melalui SSL/TLS).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">4.</span> Masa Penyimpanan &amp; Retensi Data
          </h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>
              Data undangan, foto galeri, dan rekapan RSVP disimpan dan ditayangkan secara aktif selama masa aktif paket yang dipilih (misal 30 hari hingga 365 hari).
            </li>
            <li>
              Setelah masa aktif berakhir (status <em>EXPIRED</em>), tautan publik tidak dapat diakses umum. Data Pengguna dan rekap tamu disimpan dalam status arsip selama masa tenggang wajar (maksimal 30 hingga 90 hari kalender) untuk memberi kesempatan bagi Pengguna mengunduh rekapan sebelum data media dihapus secara bertahap dari penyimpanan aktif.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">5.</span> Hak Pengguna &amp; Permohonan Penghapusan Data
          </h2>
          <p>Sesuai peraturan perlindungan data pribadi, Pengguna memiliki hak untuk:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
            <li>Mengakses dan memperbarui informasi profil dan rincian acara Anda melalui dashboard Kreyasi.id kapan saja.</li>
            <li>Mengunduh ringkasan data konfirmasi kehadiran tamu (RSVP) dan buku tamu.</li>
            <li>
              <strong>Menghapus Akun &amp; Data:</strong> Anda berhak mengajukan permohonan penghapusan akun secara permanen beserta seluruh media foto dan data tamu terkait dengan mengirimkan email ke{" "}
              <a href="mailto:support@kreyasi.id" className="text-[#8C6A28] font-medium hover:underline">
                support@kreyasi.id
              </a>{" "}
              dengan subjek <em>&quot;Permohonan Penghapusan Akun &amp; Data Pribadi&quot;</em>. Permohonan akan diproses dalam waktu 7x24 jam kerja setelah verifikasi kepemilikan akun.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">6.</span> Keamanan Data
          </h2>
          <p>
            Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang ketat, termasuk komunikasi terenkripsi SSL/TLS (HTTPS), pembatasan akses berbasis peran (*Role-Based Access Control*), hashing kata sandi tingkat tinggi, serta audit berkala terhadap integritas basis data.
          </p>
        </section>
      </div>
    </div>
  );
}
