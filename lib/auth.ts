import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "8sJDFfUKUu2YKvya5dMu+5oYAKikBgvCQgoDbkf8mxo=",
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt", // JWT lebih efisien untuk VPS (tidak perlu lookup session di DB setiap request)
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true, // Izinkan link Google ke akun existing dengan email sama
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = (credentials.email as string).toLowerCase().trim();
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash || user.isSuspended) {
          return null;
        }

        const isValid = await compare(password, user.passwordHash);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image,
        };
      },
    }),
  ],
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
      // Saat pertama kali login, tambahkan role dan id ke token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.lastChecked = Date.now();
      }

      // Re-check status user (suspended atau tidak) ke database secara berkala (tiap 60 detik)
      // Menghilangkan redundant round-trip database query pada setiap perpindahan halaman
      if (token.id) {
        const now = Date.now();
        const lastChecked = (token.lastChecked as number) || 0;
        const shouldRecheck = now - lastChecked > 60 * 1000;

        if (shouldRecheck) {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { isSuspended: true, role: true },
          });

          // Jika akun telah dihapus atau disuspend oleh admin, batalkan token
          if (!dbUser || dbUser.isSuspended) {
            return null as unknown as typeof token;
          }

          // Sinkronisasi status dan role terkini dari database
          token.role = dbUser.role;
          token.isSuspended = dbUser.isSuspended;
          token.lastChecked = now;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token) {
        return null as unknown as typeof session;
      }

      // Expose id dan role ke session client-side
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "CUSTOMER" | "ADMIN" | "SUPERADMIN") ?? "CUSTOMER";
      }
      return session;
    },
  },
});
