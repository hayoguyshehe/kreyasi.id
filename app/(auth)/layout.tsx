import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0F1411] text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-175 h-87.5 bg-[#4C6957]/15 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-112.5 h-75 bg-[#C5A059]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Logo */}
      <header className="relative z-10 pt-8 pb-4 px-6 flex justify-center items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
        >
          <Image
            src="/images/logo/kreyasi-logo-web-2.png"
            alt="Kreyasi.id"
            width={160}
            height={50}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>
      </header>

      {/* Main Form Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Kreyasi.id — Platform Undangan Digital Modern.</p>
      </footer>
    </div>
  );
}
