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
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
          Profil & Keamanan Akun
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Kelola informasi identitas akun Anda dan pengaturan metode autentikasi.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl bg-[#14171F] border border-slate-800 p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-2xl font-serif">
              {user.name ? user.name[0].toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <Badge variant={user.role === "CUSTOMER" ? "outline" : "gold"}>
                  {user.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{user.email}</span>
              </p>
            </div>
          </div>
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Bergabung {formatDateIndonesia(user.createdAt)}</span>
          </div>
        </div>

        {/* Authentication Methods Status */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Metode Masuk Terhubung
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Google OAuth Status */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white font-bold text-sm">
                  G
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Google OAuth</p>
                  <p className="text-[11px] text-slate-400">
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
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Email & Kata Sandi</p>
                  <p className="text-[11px] text-slate-400">
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
