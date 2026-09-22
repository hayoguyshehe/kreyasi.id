import { type DefaultSession } from "next-auth";

// ============================================
// NextAuth Type Augmentation
// Extend default session & JWT types dengan field custom (role)
// ============================================

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    isSuspended?: boolean;
  }
}
