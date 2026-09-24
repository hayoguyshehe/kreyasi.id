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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#2A211B]">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
