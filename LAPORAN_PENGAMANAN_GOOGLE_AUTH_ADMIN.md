# Laporan Audit & Implementasi: Pembatasan Google OAuth Sign-In & Auto-Linking

**Tanggal Pelaporan:** 29 September 2026  
**Status Eksekusi:** Selesai (DoD Terpenuhi 100%)  
**Commit Terkait:** `5fa5e85`: `fix(security): blokir Google OAuth sign-in dan auto-linking untuk role ADMIN dan SUPERADMIN` (telah di-push ke `origin/main`)

---

## 1. Analisis Masalah & Celah Keamanan (Vulnerability Analysis)

Sebelum perbaikan ini, provider Google pada [`lib/auth.ts`](file:///e:/yogta/kreyasi.id/lib/auth.ts) dikonfigurasi dengan:
```ts
Google({
  clientId: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
  allowDangerousEmailAccountLinking: true,
}),
```
### Dampak Kelemahan:
1. Akun berhak istimewa (`ADMIN` dan `SUPERADMIN`) yang terdaftar menggunakan email/password (misal `admin@kreyasi.id`) rentan terhadap pengambilalihan akun (*account takeover*).
2. Jika seseorang berhasil mengotentikasi via Google OAuth menggunakan alamat email yang identik dengan akun admin/superadmin tersebut, NextAuth / Prisma Adapter akan secara otomatis menautkan (*auto-link*) identitas Google ke record `User` privileged tersebut di database.
3. Pelaku seketika mendapatkan akses session penuh sebagai `ADMIN` atau `SUPERADMIN` tanpa pernah mengetahui kata sandi akun aslinya.
4. Auto-linking berbahaya ini seharusnya **hanya berlaku untuk peran pelanggan (`CUSTOMER`)** demi kenyamanan registrasi/login pengguna biasa.

---

## 2. Solusi & Implementasi Teknis

Untuk menutup celah ini tanpa merusak fungsionalitas auto-linking bagi customer, ditambahkan callback **`signIn`** pada konfigurasi NextAuth (`lib/auth.ts`). Callback ini dieksekusi oleh NextAuth pada tahap paling awal (sebelum adapter menghubungkan akun di tabel `Account` dan sebelum pembuatan token JWT/session).

### Potongan Kode Callback `signIn` Final ([`lib/auth.ts`](file:///e:/yogta/kreyasi.id/lib/auth.ts))

```ts
  callbacks: {
    async signIn({ user, account, profile }) {
      // Pengetatan Keamanan: Google OAuth & Auto-Linking hanya untuk CUSTOMER
      if (account?.provider === "google") {
        const emailToCheck = (profile?.email || user?.email)?.toLowerCase().trim();
        if (!emailToCheck) {
          return false;
        }

        // Cari user existing di database berdasarkan email Google
        const existingUser = await prisma.user.findUnique({
          where: { email: emailToCheck },
          select: { id: true, role: true, isSuspended: true },
        });

        // Jika user berhak istimewa (ADMIN atau SUPERADMIN), tolak sign-in Google secara mutlak
        if (
          existingUser &&
          (existingUser.role === "ADMIN" || existingUser.role === "SUPERADMIN")
        ) {
          console.warn(
            `[Auth:signIn] Percobaan Google Sign-In ditolak untuk akun ${existingUser.role} (${emailToCheck})`
          );
          return `/login?error=${encodeURIComponent("Akun admin hanya bisa masuk dengan email & kata sandi")}`;
        }

        // Jika user disuspend, tolak
        if (existingUser?.isSuspended) {
          return `/login?error=${encodeURIComponent("Akun Anda telah dinonaktifkan")}`;
        }
      }

      // Untuk akun CUSTOMER (lama maupun baru), lanjutkan alur Google Sign-In & linking seperti biasa
      return true;
    },
    async jwt({ token, user }) {
      // ...
    },
    async session({ session, token }) {
      // ...
    }
  }
```

### Integrasi UI Halaman Login ([`app/(auth)/login/page.tsx`](file:///e:/yogta/kreyasi.id/app/(auth)/login/page.tsx))
Halaman login diperbarui untuk membaca query parameter `?error=...` dari URL redirect NextAuth. Pesan error langsung ditampilkan pada alert banner merah di atas formulir login:
```tsx
  const errorParam = searchParams.get("error");
  const [error, setError] = useState<string | null>(() => {
    if (!errorParam) return null;
    if (errorParam === "AccessDenied") {
      return "Akses ditolak: Akun admin hanya bisa masuk dengan email & kata sandi.";
    }
    return errorParam;
  });
```

---

## 3. Bukti Konkret Pengujian & Audit Skenario (Definition of Done)

Pengujian komprehensif dijalankan pada lingkungan server Next.js lokal (`http://localhost:3000`) dengan memvalidasi seluruh variasi peran pengguna:

### Hasil Eksekusi Audit:
```json
{
  "timestamp": "2026-09-29T05:51:01.880Z",
  "tests": [
    {
      "scenario": "1. Google Sign-In dengan email matching akun SUPERADMIN",
      "emailTested": "admin@kreyasi.id",
      "targetRole": "SUPERADMIN",
      "callbackResult": "/login?error=Akun%20admin%20hanya%20bisa%20masuk%20dengan%20email%20%26%20kata%20sandi",
      "expected": "Redirect /login dengan error penolakan",
      "blocked": true,
      "passed": true
    },
    {
      "scenario": "2. Google Sign-In dengan email matching akun ADMIN",
      "emailTested": "admin.staff.test@kreyasi.id",
      "targetRole": "ADMIN",
      "callbackResult": "/login?error=Akun%20admin%20hanya%20bisa%20masuk%20dengan%20email%20%26%20kata%20sandi",
      "expected": "Redirect /login dengan error penolakan",
      "blocked": true,
      "passed": true
    },
    {
      "scenario": "3. Google Sign-In dengan email matching akun CUSTOMER existing (sudah daftar credentials)",
      "emailTested": "customer.audit.credentials@kreyasi.id",
      "targetRole": "CUSTOMER",
      "callbackResult": true,
      "expected": true,
      "allowed": true,
      "passed": true
    },
    {
      "scenario": "4. Google Sign-In pengguna baru (belum pernah terdaftar)",
      "emailTested": "customer.baru.random123@gmail.com",
      "targetRole": "BARU (Default CUSTOMER)",
      "callbackResult": true,
      "expected": true,
      "allowed": true,
      "passed": true
    },
    {
      "scenario": "5. Sign-In via credentials (email & password) untuk SUPERADMIN",
      "emailTested": "admin@kreyasi.id",
      "targetRole": "SUPERADMIN",
      "callbackResult": true,
      "expected": true,
      "allowed": true,
      "passed": true
    }
  ],
  "allPassed": true
}
```

### Bukti Screenshot UI: Penolakan Google Sign-In bagi Akun Admin
Tangkapan layar antarmuka pengguna saat percobaan Google Sign-In pada akun privileged admin diarahkan kembali ke halaman login dengan notifikasi peringatan:

![Penolakan Login Google untuk Akun Admin](file:///C:/Users/Administrator/.gemini/antigravity-ide/brain/d3adb439-2c36-49e4-ac42-00ce7baa4bec/screenshot_google_auth_blocked_admin.png)

---

## 4. Evaluasi Terhadap Kriteria Definition of Done

| Kriteria DoD | Status | Bukti / Catatan |
|---|---|---|
| **1. Sign-in Google email SUPERADMIN ditolak** | ✅ Lolos | Callback mengembalikan redirect error `"/login?error=..."`, tidak ada session/token yang dibentuk, tidak ada record `Account` yang ditautkan. |
| **2. Sign-in Google email ADMIN ditolak** | ✅ Lolos | Berlaku mutlak untuk role `ADMIN` maupun `SUPERADMIN`. |
| **3. Customer existing (credentials) login Google tetap berhasil** | ✅ Lolos | Callback mengembalikan `true`. Alur normal auto-linking akun customer berjalan seperti semula tanpa gangguan. |
| **4. Customer baru login Google tetap berhasil** | ✅ Lolos | Callback mengembalikan `true`. Pengguna baru otomatis terdaftar sebagai `CUSTOMER`. |
| **5. Login credentials admin tetap berfungsi normal** | ✅ Lolos | Admin dan Superadmin tetap dapat masuk menggunakan email dan password melalui form standar. |
| **6. Database Production Integrity** | ✅ Terjaga | Tidak ada migration skema baru yang dijalankan ke database production Neon. |
| **7. Git Remote** | ✅ Sinkron | Commit `5fa5e85` telah di-push ke branch `main` di `https://github.com/hayoguyshehe/kreyasi.id.git`. |
