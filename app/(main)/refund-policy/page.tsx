import React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { RefreshCcw, AlertTriangle, ArrowLeft, CheckCircle2, XCircle, Clock } from "lucide-react";

export const metadata = {
  title: "Kebijakan Refund & Pembatalan | Kreyasi.id",
  description:
    "Kebijakan pengembalian dana (refund) untuk pembelian paket undangan digital di Kreyasi.id.",
};

export default function RefundPolicyPage() {
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
        <Badge variant="sage">Kebijakan Transaksi</Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A211B] tracking-tight">
          Kebijakan Pengembalian Dana (Refund)
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
            Dokumen ini merupakan draf standar kebijakan transaksi produk digital untuk platform Kreyasi.id. Seluruh batas waktu yang bertanda <strong>[Placeholder - Menunggu Konfirmasi Pemilik Produk]</strong> wajib dikonfirmasi dan ditetapkan secara definitif oleh pemilik produk sebelum pemberlakuan komersial. Dokumen ini bukan merupakan nasihat hukum resmi.
          </p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8 text-sm text-[#4A3E36] leading-relaxed">
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">1.</span> Sifat Produk Digital Sekali Pakai
          </h2>
          <p>
            Produk dan layanan yang dijual melalui platform Kreyasi.id merupakan <strong>produk digital dan peranti lunak berbasis awan (*digital software services*)</strong> yang dialokasikan per satu acara/undangan (*single-use per event*).
          </p>
          <p>
            Setelah pembayaran paket berhasil dikonfirmasi oleh sistem pembayaran otomatis (Midtrans), sumber daya server, kuota penyimpanan media, dan akses fitur langsung terbuka penuh untuk Pengguna.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">2.</span> Ketentuan Pengajuan Pengembalian Dana (Refund)
          </h2>
          <p>
            Untuk memberikan rasa adil bagi kedua belah pihak, Kami menerapkan pedoman pengembalian dana sebagai berikut:
          </p>

          <div className="space-y-4 pt-2">
            {/* Box A: Eligible */}
            <div className="p-5 rounded-2xl bg-white border border-emerald-500/30 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Kondisi yang Memenuhi Syarat Pengembalian Dana Penuh (100% Refund)</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#524B45]">
                <li>
                  <strong>Sebelum Undangan Dipublikasikan:</strong> Pengguna mengajukan permohonan pembatalan dalam waktu maksimal{" "}
                  <span className="bg-[#FAF7F2] text-[#8C6A28] font-bold px-1.5 py-0.5 rounded border border-[#C5A059]/40">
                    [X] hari kalender (misal: 3 hari — menunggu konfirmasi pemilik produk)
                  </span>{" "}
                  sejak tanggal transaksi berhasil, DENGAN SYARAT status undangan masih berstatus <strong>DRAFT</strong> dan belum pernah dipublikasikan (*published*) ke domain publik.
                </li>
                <li>
                  <strong>Pembayaran Ganda (*Double Payment*):</strong> Terjadi pemotongan saldo ganda untuk satu nomor pesanan yang sama akibat gangguan pada gerbang pembayaran pihak ketiga.
                </li>
              </ul>
            </div>

            {/* Box B: Non-eligible */}
            <div className="p-5 rounded-2xl bg-white border border-red-500/30 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-red-800 font-semibold text-sm">
                <XCircle className="w-4 h-4 text-red-600" />
                <span>Kondisi yang Tidak Dapat Dikembalikan (Non-Refundable)</span>
              </div>
              <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#524B45]">
                <li>
                  <strong>Undangan Telah Dipublikasikan (Status PUBLISHED):</strong> Pengembalian dana <strong>tidak dapat dilakukan</strong> apabila undangan digital telah dipublikasikan ke publik, tautan URL telah aktif disebarkan, atau telah menerima respons tamu/RSVP, karena hak guna digital dan alokasi infrastruktur telah berjalan penuh.
                </li>
                <li>
                  <strong>Pembatalan atau Penundaan Acara Sepihak:</strong> Acara pernikahan atau hajatan yang dibatalkan atau dimundurkan jadwalnya oleh Pengguna. (Catatan: Pengguna dapat mengubah tanggal dan rincian acara kapan saja di editor undangan selama masa aktif masih berjalan tanpa biaya tambahan).
                </li>
                <li>
                  <strong>Ketidakcocokan Selera Desain:</strong> Pengguna merasa tidak cocok dengan tema yang dipilih setelah transaksi selesai (Kreyasi.id menyediakan fitur pratinjau live sebelum Anda memutuskan untuk membeli).
                </li>
                <li>
                  Permohonan refund yang diajukan melampaui batas waktu placeholder yang ditetapkan.
                </li>
              </ul>
            </div>

            {/* Box C: Technical Failure Exception */}
            <div className="p-5 rounded-2xl bg-white border border-[#C5A059]/40 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-[#8C6A28] font-semibold text-sm">
                <Clock className="w-4 h-4 text-[#8C6A28]" />
                <span>Pengecualian Khusus: Kegagalan Teknis Fatal Platform</span>
              </div>
              <p className="text-xs text-[#524B45]">
                Pengembalian dana sebagian atau penuh dapat dipertimbangkan jika terjadi gangguan teknis fatal yang terbukti bersumber dari sisi server utama Kreyasi.id (misalnya server tidak dapat diakses sepanjang hari H acara berlangsung) dan tim teknis Kreyasi.id tidak berhasil memulihkannya dalam rentang waktu yang wajar.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-serif font-bold text-[#2A211B] flex items-center gap-2">
            <span className="text-[#8C6A28]">3.</span> Prosedur Pengajuan Refund
          </h2>
          <p>Untuk mengajukan pengembalian dana, Pengguna wajib mengirimkan permohonan melalui email resmi ke:</p>
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] text-xs space-y-2">
            <p>
              <strong>Email Tujuan:</strong>{" "}
              <a href="mailto:support@kreyasi.id" className="text-[#8C6A28] font-semibold hover:underline">
                support@kreyasi.id
              </a>
            </p>
            <p>
              <strong>Subjek Email:</strong> Permohonan Refund - [ID Pesanan Midtrans]
            </p>
            <p>
              <strong>Informasi Wajib yang Disertakan:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#6B5E55]">
              <li>Alamat email akun Kreyasi.id terdaftar</li>
              <li>Nomor Faktur / Order ID (misal: <code>INV-2026xxxx-xxxx</code>)</li>
              <li>Bukti transfer / notifikasi pembayaran dari Midtrans</li>
              <li>Alasan rinci pengajuan permohonan refund</li>
              <li>Nomor rekening bank tujuan pengembalian (harus atas nama yang sama dengan nama pemesan)</li>
            </ul>
          </div>
          <p className="text-xs text-[#7A6D63]">
            Tim Layanan Pelanggan Kreyasi.id akan meninjau dan memberikan keputusan verifikasi dalam waktu maksimal{" "}
            <strong>[X] hari kerja (misal: 3-5 hari kerja — menunggu konfirmasi pemilik produk)</strong>. Jika disetujui, dana akan dikembalikan melalui transfer bank atau metode pembayaran asal setelah dikurangi biaya administrasi gerbang pembayaran (jika berlaku).
          </p>
        </section>
      </div>
    </div>
  );
}
