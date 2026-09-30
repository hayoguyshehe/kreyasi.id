# Panduan Implementasi & Fungsionalitas: Editing Template & Manajemen Tamu oleh Superadmin

**Status Sistem**: Fitur telah selesai diimplementasikan (Siap Digunakan)  
**Tujuan Dokumen**: Menguraikan kapabilitas *role* Superadmin/Owner di Kreyasi dalam melakukan modifikasi template desain serta bagaimana fungsi *Custom Guest Link* bekerja, termasuk kemampuan Superadmin untuk mengelola daftar tamu klien secara langsung (*bypass authorization*).

---

## 1. Fitur Editing Template oleh Superadmin

Superadmin di Kreyasi memiliki akses eksklusif untuk mengubah tampilan dasar suatu template langsung dari dashboard tanpa harus melakukan *hard-coding* ulang di *codebase*.

### Komponen Teknis
- **UI Admin**: `components/admin/template-detail-and-assets.tsx`
- **Endpoint API**: `PUT /api/admin/templates/[id]`
- **Penyimpanan**: Field `themeConfig` (JSON) pada model `Template`.

### Alur Kerja (Cara Menggunakan)
1. Superadmin membuka halaman **Admin Panel > Template Desain** (`/admin/templates`).
2. Pilih template yang ingin dimodifikasi lalu klik tombol **Kelola & Aset**.
3. Di dalam menu editor, Superadmin dapat:
   - Mengubah **Warna Utama, Sekunder, dan Aksen** (*Primary, Secondary, Accent*).
   - Memilih tipe font *Heading* dan *Body*.
   - Menentukan gaya letak desain dasar (Misal: *Luxury, Modern, Minimal*).
   - Mengunggah aset animasi *Lottie* ringan (seperti pendaran bintang atau dedaunan) dan mengaitkannya ke *section* tertentu di undangan (misalnya di bagian *Cover*).
4. Setelah konfigurasi disimpan, segala perubahan ini akan terpublikasi otomatis dan langsung bisa dilihat oleh seluruh pengguna yang memakai template tersebut.

---

## 2. Fitur Link Tamu Custom (Personal Guest Link)

Fitur ini dirancang untuk memberikan sentuhan personal kepada tamu yang diundang, di mana nama mereka akan muncul secara langsung di halaman depan undangan.

### Komponen Teknis
- **Database Schema**: Model `Guest` memiliki field unik `personalSlug`.
- **Logika Router**: Path publik diakses dengan struktur URL: `https://kreyasi.id/u/[slug-undangan]?to=[personalSlug-tamu]`.

### Keuntungan & Cara Kerjanya
1. Sistem akan mencocokkan kode `personalSlug` dengan database.
2. Nama tamu akan ditampilkan secara elegan di *Cover Amplop* (Misal: **"Kepada Yth. Bapak/Ibu Dimas"**).
3. Saat tamu menekan tombol "Buka Undangan", sistem otomatis memperbarui stempel waktu `openedAt` di *backend*, sehingga pemilik undangan tahu siapa saja yang sudah membaca undangannya.
4. Di *section* RSVP, nama tamu otomatis terkunci atau terisi penuh, mencegah duplikasi RSVP atau orang yang tidak dikenal mengisi absen.

---

## 3. Fitur Superadmin Membantu Input Daftar Tamu (*White-Glove Service*)

Banyak pengguna mungkin merasa kesulitan menginput data tamu mereka sendiri. Di sistem ini, fitur **Bypass Otorisasi** telah dirancang agar Owner / Superadmin bisa menginput nama-nama tamu secara proaktif (layanan *white-glove*).

### Komponen Teknis
- **Auth Guard**: Pada berkas `app/(dashboard)/dashboard/invitations/[id]/guests/page.tsx`.
- **Logika Keamanan**: Halaman *dashboard* biasa ditutup khusus untuk pemilik undangan (`session.user.id === invitation.userId`). Namun, sistem secara khusus menambahkan pengecualian (*bypass*) apabila *role* sesi yang aktif adalah `ADMIN` atau `SUPERADMIN`.

### Alur Kerja (Cara Membantu Klien)
1. Superadmin membuka **Admin Panel > Undangan & Kerjasama** (`/admin/invitations`).
2. Temukan undangan yang ingin dibantu pengerjaannya.
3. Klik tombol **Editor** (Terdapat di kolom "Aksi Admin").
4. Sistem akan "menerbangkan" Superadmin masuk ke **Dashboard Klien** tersebut.
5. Masuk ke menu **Daftar Tamu** (`/dashboard/invitations/[id]/guests`).
6. Superadmin dapat memanfaatkan fitur **Input Manual** atau menggunakan form **Import Massal** (Cukup menyalin *(copy-paste)* puluhan/ratusan nama tamu beserta nomor WhatsApp dari tabel Excel).
7. Link custom otomatis *ter-generate*. Superadmin dapat menggunakan tombol **Share WhatsApp** untuk langsung mengirimkan tautan undangan kepada setiap tamu.

---

### Kesimpulan
Secara arsitektur, seluruh persyaratan bisnis yang Anda butuhkan (baik editing template visual bagi Admin maupun pembuatan link custom tamu) telah rampung dan menyatu ke dalam alur yang mulus di platform Kreyasi. Anda dapat langsung menggunakan fitur ini untuk keperluan demonstrasi kepada klien atau persiapan produksi undangan kerjasama secara langsung.
