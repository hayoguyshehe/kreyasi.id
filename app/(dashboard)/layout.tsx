import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A211B] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EAE3D8] flex flex-col justify-between shrink-0 shadow-xs">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/" className="inline-flex items-center gap-2 group">
            <Image
              src="/images/logo/kreyasi-logo-web-1.png"
              alt="Kreyasi.id"
              width={130}
              height={42}
              className="h-8 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
          </Link>

          {/* Quick Create CTA */}
          <div>
            <Link href="/dashboard/invitations/new">
              <Button variant="sage" size="sm" className="w-full gap-2 justify-center shadow-md">
                <PlusCircle className="w-4 h-4" />
                <span>Buat Undangan</span>
              </Button>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="space-y-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#4C6957]" />
              <span>Ringkasan</span>
            </Link>
            <Link
              href="/dashboard/invitations"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#4C6957]" />
              <span>Undangan Saya</span>
            </Link>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
            >
              <CreditCard className="w-4 h-4 text-[#4C6957]" />
              <span>Riwayat Transaksi</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F1EFE4] transition-colors"
            >
              <User className="w-4 h-4 text-[#4C6957]" />
              <span>Profil & Keamanan</span>
            </Link>

            {/* Link Admin jika role ADMIN atau SUPERADMIN */}
            {(user.role === "ADMIN" || user.role === "SUPERADMIN") && (
              <div className="pt-4 mt-4 border-t border-[#EAE3D8]">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#4C6957] bg-[#4C6957]/10 border border-[#4C6957]/20 hover:bg-[#4C6957]/20 transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#4C6957]" />
                  <span>Admin Panel</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* User Card & Logout in Sidebar Footer */}
        <div className="p-4 border-t border-[#EAE3D8] bg-[#FDFBF7]">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-2.5 overflow-hidden group hover:opacity-90 transition-opacity flex-1 min-w-0"
              title="Buka Pengaturan Profil"
            >
              <div className="w-8 h-8 rounded-full bg-[#EFE8DD] border border-[#DFC798] flex items-center justify-center text-[#4C6957] shrink-0 group-hover:border-[#4C6957]/50 font-bold text-xs font-serif">
                {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#2A211B] truncate group-hover:text-[#4C6957] transition-colors">
                  {user.name || "Pengguna"}
                </p>
                <p className="text-[10px] text-[#7A6D63] truncate">{user.email}</p>
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
                className="p-1.5 rounded-lg text-[#7A6D63] hover:text-red-600 hover:bg-red-50 transition-colors"
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
