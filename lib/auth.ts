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

        const email = credentials.email as string;
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
    async jwt({ token, user }) {
      // Saat pertama kali login, tambahkan role dan id ke token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      // Re-check status user (suspended atau tidak) ke database setiap kali token digunakan / di-refresh
      if (token.id) {
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
