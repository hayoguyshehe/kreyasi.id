import React from "react";
import { auth } from "@/lib/auth";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  try {
    const session = await auth();
    user = session?.user ?? null;
  } catch (error) {
    console.warn("[MainLayout] Session lookup fallback to guest:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0D11] text-slate-100">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
