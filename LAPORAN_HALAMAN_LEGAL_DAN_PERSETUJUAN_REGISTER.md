# Laporan Implementasi: Halaman Legal & Checkbox Persetujuan Registrasi

**Tanggal Pelaporan:** 29 September 2026  
**Status Eksekusi:** Selesai (DoD Terpenuhi 100%)  
**Commit Terkait:** `713a4c9`: `feat(legal): tambahkan halaman Syarat & Ketentuan, Kebijakan Privasi, Kebijakan Refund, dan checkbox persetujuan register` (telah di-push ke `origin/main`)

---

## 1. Ikhtisar & Pemberitahuan Draf Legal

Sebelum platform Kreyasi.id dibuka untuk publik dan memproses pembayaran serta data pihak ketiga (nama, WhatsApp, status RSVP tamu), tiga dokumen kebijakan hukum standar operasional SaaS telah disusun dan dipublikasikan pada rute publik `app/(main)/`:

> [!IMPORTANT]
> **Pemberitahuan kepada Pemilik Produk (Bukan Pengganti Nasihat Hukum):**  
> Seluruh konten pada ketiga halaman ini disusun sebagai **draf wajar dan standar operasional SaaS undangan digital Indonesia**, bukan teks final yang dijamin memenuhi seluruh regulasi spesifik secara mutlak. Setiap halaman telah ditandai secara eksplisit dengan tanggal revisi (*"Terakhir diperbarui: 29 September 2026"*) dan kotak disclaimer. **Pemilik produk disarankan untuk meninjau kembali dokumen ini bersama praktisi hukum atau konsultan kepatuhan yang berwenang sebelum diberlakukan penuh secara komersial.**

---

## 2. Rincian & Ringkasan Konten 3 Halaman Legal

### A. Syarat & Ketentuan ([`/terms`](file:///e:/yogta/kreyasi.id/app/(main)/terms/page.tsx))
- **Definisi Layanan**: Kreyasi.id sebagai platform SaaS *self-service* penyedia undangan digital (pernikahan, ulang tahun, khitanan, event umum) dengan fitur interaktif (RSVP, buku tamu, amplop digital QRIS/Bank, peta lokasi Google Maps).
- **Ketentuan Akun**: Syarat kecakapan hukum (minimal 18 tahun), kewajiban data akurat, tanggung jawab atas kerahasiaan kata sandi, dan larangan pengalihan akun tanpa izin.
- **Mekanisme Pembelian & Masa Aktif**: Skema **sekali bayar per acara (*one-time purchase per event*)**, **bukan** langganan bulanan (*recurring*). Undangan aktif sesuai paket (3 hingga 365 hari). Pasca masa aktif berakhir, tautan otomatis berstatus *EXPIRED*.
- **Tanggung Jawab Konten Pengguna**: Larangan keras terhadap materi pornografi, kekerasan, perjudian, SARA, ujaran kebencian, dan pelanggaran UU ITE. Pengguna menjamin kepemilikan hak cipta atas foto yang diunggah. Kreyasi.id bukan perantara penampung dana amplop kado.
- **Hak Kekayaan Intelektual**:
  - *Milik Kreyasi.id*: Seluruh kode sumber, desain template, struktur antarmuka, aset animasi Lottie sistem, dan merek dagang.
  - *Milik Pengguna*: Seluruh materi pribadi (foto mempelai, cerita cinta, teks undangan, data kontak tamu).
- **Penangguhan Akun (*Account Suspension*)**: Platform berhak membekukan (*suspend*) akun atau menurunkan tautan seketika jika ditemukan pelanggaran berat, penipuan, atau laporan hukum yang terverifikasi.
- **Batasan Tanggung Jawab**: Layanan disediakan atas dasar *as-is* dan *as-available*, batasan tanggung jawab terhadap gangguan jaringan eksternal dan *force majeure*.
- **Perubahan Ketentuan**: Hak pembaruan ketentuan dengan pencantuman tanggal revisi terbaru di halaman.

---

### B. Kebijakan Privasi ([`/privacy`](file:///e:/yogta/kreyasi.id/app/(main)/privacy/page.tsx))
- **Data yang Dikumpulkan**:
  1. *Data Akun Pengguna*: Nama lengkap, email, nomor telepon/WhatsApp, kata sandi ter-hash *bcrypt*, riwayat faktur.
  2. *Data Konten Acara*: Nama mempelai/keluarga, tanggal & lokasi acara, koordinat maps, cerita cinta, foto & video galeri, nomor rekening/QRIS kado.
  3. *Data Tamu Pihak Ketiga*: Nama tamu, nomor kontak tamu (jika diinput pengguna), status kehadiran (RSVP), jumlah pendamping, dan pesan doa di buku tamu.
- **Tujuan Penggunaan**: Pembuatan dan penayangan undangan digital publik, personalisasi tautan tamu (`?to=NamaTamu`), rekapitulasi RSVP, verifikasi pembayaran, serta notifikasi teknis. Platform berkomitmen **tidak pernah menjual data pribadi kepada pihak ketiga untuk kepentingan iklan**.
- **Pihak Ketiga & Pemroses Data Eksternal**:
  - *Midtrans*: Payment gateway berlisensi Bank Indonesia untuk proses transaksi aman tanpa menyimpan nomor kartu kredit/PIN di server Kreyasi.id.
  - *Penyedia Cloud Storage S3-Compatible*: Penyimpanan aset media undangan secara terenkripsi.
  - *Penyedia Database PostgreSQL (Neon)*: Penyimpanan basis data relasional dengan enkripsi saat istirahat (*at rest*) dan transmisi SSL/TLS.
- **Retensi Data**: Data aktif selama masa aktif paket. Pasca masa aktif kedaluwarsa (*EXPIRED*), data disimpan dalam arsip selama masa tenggang wajar (maksimal 30–90 hari kalender) untuk memberi kesempatan unduh rekapitulasi sebelum dihapus permanen.
- **Hak Pengguna & Prosedur Penghapusan**: Pengguna berhak meminta akses, unduh rekapan, atau penghapusan permanen akun beserta seluruh data tamu dan foto melalui email resmi `support@kreyasi.id` (diproses dalam 7x24 jam kerja).

---

### C. Kebijakan Refund ([`/refund-policy`](file:///e:/yogta/kreyasi.id/app/(main)/refund-policy/page.tsx))
- **Karakteristik Produk Digital**: Layanan digital sekali pakai per acara (*single-use digital goods*) di mana akses fitur dan sumber daya server langsung dialokasikan setelah pembayaran terverifikasi.
- **Kebijakan Default & Kondisi Pengembalian Dana**:
  - *Sebelum Undangan Dipublikasikan (Status DRAFT)*: Pengguna berhak mengajukan refund penuh 100% jika diajukan dalam batas waktu **`[X] hari kalender (misal: 3 hari — menunggu konfirmasi pemilik produk)`** sejak transaksi berhasil, dengan syarat undangan belum pernah dipublikasikan (*published*) ke domain publik.
  - *Pembayaran Ganda (*Double Payment*)*: Pengembalian dana penuh akibat kegagalan sinkronisasi gerbang pembayaran.
  - *Setelah Undangan Dipublikasikan (Status PUBLISHED)*: **Tidak dapat dikembalikan (*non-refundable*)** karena alokasi domain, template, dan infrastruktur telah berjalan dan diakses publik.
  - *Bukan Alasan Refund*: Pembatalan/penundaan acara sepihak oleh pengguna (pengguna dapat mengubah tanggal kapan saja di editor tanpa biaya tambahan), salah ketik data pribadi, atau ketidakcocokan selera setelah template dipakai.
  - *Pengecualian Kegagalan Teknis Fatal*: Pertimbangan refund khusus jika terjadi kegagalan teknis fatal server Kreyasi.id yang terbukti sepanjang hari H acara.
- **Prosedur Pengajuan**: Mengirimkan permohonan ke `support@kreyasi.id` dengan menyertakan email akun, nomor Order ID Midtrans, bukti pembayaran, dan alasan rinci. Proses verifikasi memakan waktu **`[X] hari kerja (misal: 3-5 hari kerja — menunggu konfirmasi pemilik produk)`**.

---

## 3. Integrasi Footer & Form Registrasi

### A. Pembaruan Footer ([`components/layout/footer.tsx`](file:///e:/yogta/kreyasi.id/components/layout/footer.tsx))
1. Menambahkan kolom navigasi **"Kebijakan & Legal"** di area footer:
   - Link ke `Syarat & Ketentuan` (`/terms`)
   - Link ke `Kebijakan Privasi` (`/privacy`)
   - Link ke `Kebijakan Refund` (`/refund-policy`)
2. Menambahkan tautan legal di baris bawah (*bottom bar*) footer di samping hak cipta:
   - `© 2026 Kreyasi.id. Hak cipta dilindungi. • Syarat & Ketentuan • Kebijakan Privasi • Kebijakan Refund`

### B. Checkbox Persetujuan Wajib di Form Registrasi ([`app/(auth)/register/page.tsx`](file:///e:/yogta/kreyasi.id/app/(auth)/register/page.tsx))
1. **State & Elemen Input**:
   - Ditambahkan input checkbox dengan label interaktif:
     *"Saya menyetujui [Syarat & Ketentuan](/terms) dan [Kebijakan Privasi](/privacy) Kreyasi.id."*
2. **Validasi Ganda (Client & Submit Handler)**:
   - Menggunakan atribut HTML5 `required`.
   - Pada handler `handleSubmit`, jika `agreedToTerms === false`, submit seketika dibatalkan dan memunculkan notifikasi alert merah:
     *"Anda wajib menyetujui Syarat & Ketentuan dan Kebijakan Privasi untuk mendaftar."*

---

## 4. Bukti Konkret Pengujian & Screenshot Visual

### A. Tampilan Halaman Syarat & Ketentuan (`/terms`)
![Halaman Syarat & Ketentuan](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_terms_page.png)

### B. Tampilan Halaman Kebijakan Privasi (`/privacy`)
![Halaman Kebijakan Privasi](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_privacy_page.png)

### C. Tampilan Halaman Kebijakan Refund (`/refund-policy`)
![Halaman Kebijakan Refund](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_refund_policy_page.png)

### D. Tampilan Form Registrasi dengan Checkbox Persetujuan (`/register`)
![Form Registrasi dengan Checkbox](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_register_with_terms_checkbox.png)

### E. Bukti Penolakan Submit Registrasi Jika Checkbox Belum Dicentang
![Validasi Penolakan Submit Form Registrasi](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_register_validation_error.png)

### F. Tampilan Kolom Kebijakan & Legal pada Footer
![Footer Kolom Legal](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_footer_legal_links.png)

---

## 5. Ringkasan Status

1. **Akses Halaman**: Ketiga rute `/terms`, `/privacy`, dan `/refund-policy` berstatus **HTTP 200 OK**, responsif, dengan layout tipografi terpusat (`max-w-4xl`) bernuansa Warm Ivory.
2. **Kepatuhan Form Registrasi**: Pengguna baru **wajib** mencentang checkbox persetujuan sebelum dapat mendaftar akun.
3. **Database Production Integrity**: **Tidak ada migration database baru** yang dijalankan ke database production Neon.
4. **Git Remote**: Seluruh perubahan telah di-commit dalam `713a4c9` dan di-push ke remote `origin/main`:
   ```
   To https://github.com/hayoguyshehe/kreyasi.id.git
      5fa5e85..713a4c9  main -> main
   ```
