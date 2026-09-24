import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatDateIndonesia } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { User, ShieldCheck, Mail, Calendar, KeyRound, CheckCircle, AlertTriangle } from "lucide-react";
import { SetPasswordCard } from "@/components/dashboard/set-password-card";

export const metadata = {
  title: "Profil & Keamanan | Kreyasi.id",
};

export default async function DashboardProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      accounts: {
        select: { provider: true },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const hasPassword = Boolean(user.passwordHash);
  const isGoogleLinked = user.accounts.some((acc) => acc.provider === "google") || Boolean(user.googleId);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2A211B] tracking-tight">
          Profil & Keamanan Akun
        </h1>
        <p className="text-xs sm:text-sm text-[#6B5E55] mt-1">
          Kelola informasi identitas akun Anda dan pengaturan metode autentikasi.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl bg-white border border-[#EAE3D8] p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE3D8]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#EFE8DD] border border-[#DFC798] text-[#4C6957] flex items-center justify-center font-bold text-2xl font-serif">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#2A211B]">{user.name}</h2>
                <Badge variant={user.role === "CUSTOMER" ? "outline" : "gold"}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-[#6B5E55] flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#4C6957]" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>
          <div className="text-xs text-[#7A6D63] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#7A6D63]" />
            <span>Bergabung {formatDateIndonesia(user.createdAt)}</span>
          </div>
        </div>

        {/* Authentication Methods Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#2A211B] uppercase tracking-wider">
            Metode Masuk Terhubung
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google OAuth Status */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-white border border-[#EAE3D8] flex items-center justify-center text-[#2A211B] font-bold text-sm">
                  G
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2A211B]">Google OAuth</p>
                  <p className="text-[11px] text-[#7A6D63]">
                    {isGoogleLinked ? "Terhubung ke akun Google" : "Belum dihubungkan"}
                  </p>
                </div>
              </div>
              {isGoogleLinked ? (
                <Badge variant="success" className="text-[10px]">
                  Aktif
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px]">
                  Tidak Aktif
                </Badge>
              )}
            </div>

            {/* Email & Password Status */}
            <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#EAE3D8] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#4C6957]/10 text-[#4C6957] flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#2A211B]">Email & Kata Sandi</p>
                  <p className="text-[11px] text-[#7A6D63]">
                    {hasPassword ? "Kata sandi aktif" : "Belum ada kata sandi"}
                  </p>
                </div>
              </div>
              {hasPassword ? (
                <Badge variant="success" className="text-[10px]">
                  Aktif
                </Badge>
              ) : (
                <Badge variant="warning" className="text-[10px]">
                  Belum Diatur
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Set / Change Password Component */}
      <SetPasswordCard hasPassword={hasPassword} userEmail={user.email} />
    </div>
  );
}
