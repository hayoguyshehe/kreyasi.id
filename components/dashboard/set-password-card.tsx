"use client";

import React, { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SetPasswordCardProps {
  hasPassword: boolean;
  userEmail: string;
}

export function SetPasswordCard({ hasPassword: initialHasPassword, userEmail }: SetPasswordCardProps) {
  const [hasPassword, setHasPassword] = useState(initialHasPassword);
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (password.length < 8) {
      setErrorMessage("Kata sandi minimal 8 karakter");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok");
      return;
    }

    if (hasPassword && !currentPassword) {
      setErrorMessage("Kata sandi saat ini wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/user/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: hasPassword ? currentPassword : undefined,
          password,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Gagal mengatur kata sandi");
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        hasPassword
          ? "Kata sandi Anda berhasil diperbarui."
          : `Kata sandi berhasil dibuat! Anda sekarang dapat login menggunakan email (${userEmail}) dan kata sandi baru Anda.`
      );
      setHasPassword(true);
      setCurrentPassword("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Set password error:", err);
      setErrorMessage("Terjadi gangguan koneksi. Silakan coba kembali.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-[#EAE3D8] p-6 md:p-8 space-y-6 shadow-xs">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#4C6957]/10 border border-[#4C6957]/20 flex items-center justify-center text-[#4C6957] shrink-0">
          <KeyRound className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold font-serif text-[#2A211B]">
            {hasPassword ? "Ubah Kata Sandi" : "Atur Kata Sandi (Set Password)"}
          </h2>
          <p className="text-xs text-[#6B5E55] leading-relaxed">
            {hasPassword
              ? "Perbarui kata sandi akun Anda untuk meningkatkan keamanan."
              : "Akun Anda terdaftar melalui Google OAuth dan belum memiliki kata sandi mandiri. Atur kata sandi agar Anda dapat masuk menggunakan formulir Email & Password maupun Google."}
          </p>
        </div>
      </div>

      {!hasPassword && (
        <div className="p-4 rounded-xl bg-[#FFF9ED] border border-[#DFC798] flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-[#8C6D2B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#6B5E55] leading-relaxed">
            <strong className="text-[#2A211B]">Akun Khusus Google:</strong> Saat ini Anda hanya bisa login lewat tombol Google.
            Setelah menambahkan kata sandi di bawah, Anda bisa login dengan kedua cara.
          </div>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-800 leading-relaxed font-medium">
            {successMessage}
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs text-red-700 leading-relaxed">
            {errorMessage}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        {hasPassword && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2A211B]">
              Kata Sandi Saat Ini
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE3D8] text-[#2A211B] text-xs placeholder:text-[#9A8D83] focus:outline-none focus:border-[#4C6957]"
                required
              />
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#2A211B]">
            {hasPassword ? "Kata Sandi Baru" : "Buat Kata Sandi"}
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE3D8] text-[#2A211B] text-xs placeholder:text-[#9A8D83] focus:outline-none focus:border-[#4C6957] pr-10"
              required
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7A6D63] hover:text-[#2A211B]"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#2A211B]">
            Konfirmasi Kata Sandi Baru
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ketik ulang kata sandi baru"
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#EAE3D8] text-[#2A211B] text-xs placeholder:text-[#9A8D83] focus:outline-none focus:border-[#4C6957]"
            required
            minLength={8}
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="sage"
            size="md"
            isLoading={isLoading}
            className="w-full sm:w-auto shadow-sm"
          >
            <Lock className="w-4 h-4" />
            <span>{hasPassword ? "Perbarui Kata Sandi" : "Simpan Kata Sandi"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
