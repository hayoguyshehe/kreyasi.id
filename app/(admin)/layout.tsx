import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/lib/auth";
import {
  ShieldAlert,
  LayoutDashboard,
  CreditCard,
  HeartHandshake,
  Users,
  Palette,
  Layers,
  FolderTree,
  Tag,
  ArrowLeft,
  LogOut,
  User,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "Admin Panel | Kreyasi.id",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = session.user.role;
  if (role !== "ADMIN" && role !== "SUPERADMIN") {
    redirect("/dashboard");
  }

  const navLinks = [
    { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
    { href: "/admin/invitations", label: "Undangan & Kerjasama", icon: HeartHandshake },
    { href: "/admin/orders", label: "Pesanan & Transaksi", icon: CreditCard },
    { href: "/admin/users", label: "Manajemen Pengguna", icon: Users },
    { href: "/admin/templates", label: "Template Desain", icon: Palette },
    { href: "/admin/packages", label: "Paket Harga", icon: Layers },
    { href: "/admin/categories", label: "Kategori Acara", icon: FolderTree },
    { href: "/admin/promo-codes", label: "Kode Promo", icon: Tag },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2A211B] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#EAE3D8] flex flex-col justify-between shrink-0 shadow-xs">
        <div className="p-6 space-y-7">
          {/* Logo & Role Badge */}
          <div className="space-y-2">
            <Link href="/admin" className="inline-flex items-center gap-2 group">
              <Image
                src="/images/logo/kreyasi-logo-web-1.png"
                alt="Kreyasi.id"
                width={125}
                height={40}
                className="h-7 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
              <span className="text-xs font-serif font-bold text-[#8C6A28] bg-[#C5A059]/15 px-2 py-0.5 rounded-md border border-[#C5A059]/30">
                Admin
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <Badge variant="gold" className="text-[10px] tracking-wider uppercase font-semibold py-0.5">
                {role}
              </Badge>
              <span className="text-[11px] text-[#7A6D63] font-mono">v1.0-Fase 1</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB] transition-colors"
                >
                  <Icon className="w-4 h-4 text-[#4C6957]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[#EAE3D8]">
              <Link
                href="/dashboard"
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#6B5E55] hover:text-[#2A211B] hover:bg-[#F5EFEB] transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-[#7A6D63]" />
                <span>Kembali ke Dashboard</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Card in Footer */}
        <div className="p-4 border-t border-[#EAE3D8] bg-[#FAF7F2]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#EFE8DD] border border-[#DFC798] flex items-center justify-center text-[#4C6957] font-serif font-bold text-xs shrink-0">
                {session.user.name ? session.user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-[#2A211B] truncate">
                  {session.user.name || "Administrator"}
                </p>
                <p className="text-[10px] text-[#7A6D63] truncate">{session.user.email}</p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/login" });
              }}
            >
              <button
                type="submit"
                title="Keluar"
                className="p-1.5 rounded-lg text-[#7A6D63] hover:text-[#8C3A27] hover:bg-[#8C3A27]/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Admin Content Area */}
      <main className="flex-1 overflow-y-auto bg-[#FAF7F2]">
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
