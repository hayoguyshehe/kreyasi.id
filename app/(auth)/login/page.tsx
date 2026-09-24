"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Mail, Lock, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const message = searchParams.get("message");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("Email atau password yang Anda masukkan salah.");
        setIsLoading(false);
        return;
      }

      // Full page navigation ensures fresh cookies are sent and bypasses client router cache
      window.location.href = callbackUrl;
    } catch {
      setError("Terjadi kesalahan saat masuk. Silakan coba lagi.");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <Card variant="default" className="w-full bg-white border border-[#EAE3D8] shadow-md shadow-[#2A211B]/5">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-2xl font-bold font-serif text-[#2A211B]">
          Selamat Datang Kembali
        </CardTitle>
        <CardDescription className="text-sm text-[#6B5E55]">
          Masuk ke akun Anda untuk mengelola undangan digital
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {message && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-2.5 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Tombol Google OAuth */}
        <Button
          type="button"
          variant="secondary"
          className="w-full flex items-center justify-center gap-3 bg-white border border-[#EAE3D8] text-[#2A211B] hover:bg-[#FAF7F2] shadow-xs"
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z"
            />
          </svg>
          <span className="font-medium text-xs sm:text-sm">Masuk dengan Google</span>
        </Button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#EAE3D8] w-full" />
          <span className="bg-white px-3 text-[11px] uppercase tracking-wider text-[#8A7C71] absolute font-medium">
            atau gunakan email
          </span>
        </div>

        {/* Form Credentials */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Alamat Email"
            type="email"
            placeholder="nama@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            leftIcon={<Lock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="gold"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            Masuk ke Akun
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center border-t border-[#EAE3D8] pt-4">
        <p className="text-xs text-[#6B5E55]">
          Belum memiliki akun Kreyasi?{" "}
          <Link
            href="/register"
            className="text-[#4C6957] font-semibold hover:underline hover:text-[#385041] ml-1"
          >
            Daftar Sekarang
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-87.5">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
