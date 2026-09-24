import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  Sparkles,
  LayoutDashboard,
  Mail,
  CreditCard,
  LogOut,
  ExternalLink,
  User,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#12151D] border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-serif">
              Kreyasi<span className="text-amber-400">.id</span>
            </span>
          </Link>

          {/* Quick Create CTA */}
          <div>
            <Link href="/dashboard/invitations/new">
              <Button variant="gold" size="sm" className="w-full gap-2 justify-center shadow-lg">
                <PlusCircle className="w-4 h-4" />
                <span>Buat Undangan</span>
              </Button>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-amber-400" />
              <span>Ringkasan</span>
            </Link>
            <Link
              href="/dashboard/invitations"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>Undangan Saya</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>Riwayat Transaksi</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>Profil & Keamanan</span>
            </Link>

            {/* Link Admin jika role ADMIN atau SUPERADMIN */}
            {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
              <div className="pt-4 mt-4 border-t border-slate-800/60">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 overflow-hidden group hover:opacity-90 transition-opacity flex-1 min-w-0"
              title="Buka Pengaturan Profil"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0 group-hover:border-amber-500/50">
                <User className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate group-hover:text-amber-300 transition-colors">
                  {user.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                title="Keluar"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
