import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0D11] text-slate-100 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-175 h-87.5 bg-amber-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-112.5 h-75 bg-[#E0A899]/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header / Logo */}
      <header className="relative z-10 pt-8 pb-4 px-6 flex justify-center items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group transition-transform duration-200 hover:scale-105"
        >
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white font-serif">
            Kreyasi<span className="text-amber-400">.id</span>
          </span>
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
