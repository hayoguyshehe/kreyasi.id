import { NextRequest, NextResponse } from "next/server";
import { hash, compare } from "bcryptjs";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod/v4";

const setPasswordSchema = z
  .object({
    currentPassword: z.string().optional(),
    password: z
      .string()
      .min(8, "Kata sandi minimal 8 karakter")
      .max(100, "Kata sandi maksimal 100 karakter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak cocok",
    path: ["confirmPassword"],
  });

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Sesi tidak valid atau telah berakhir. Silakan login kembali." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = setPasswordSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues?.[0]?.message || "Input tidak valid";
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 400 }
      );
    }

    const { currentPassword, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan" },
        { status: 404 }
      );
    }

    // Jika pengguna sudah punya password sebelumnya, wajib verifikasi kata sandi lama
    if (user.passwordHash) {
      if (!currentPassword) {
        return NextResponse.json(
          {
            success: false,
            error: "Kata sandi saat ini wajib diisi untuk mengubah kata sandi",
          },
          { status: 400 }
        );
      }

      const isCurrentPasswordValid = await compare(currentPassword, user.passwordHash);
      if (!isCurrentPasswordValid) {
        return NextResponse.json(
          { success: false, error: "Kata sandi saat ini salah" },
          { status: 400 }
        );
      }
    }

    // Hash kata sandi baru (bcrypt rounds 12)
    const newPasswordHash = await hash(password, 12);

    // Update passwordHash di database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      success: true,
      message: user.passwordHash
        ? "Kata sandi berhasil diperbarui."
        : "Kata sandi berhasil diatur! Anda kini dapat masuk menggunakan email dan kata sandi baru.",
    });
  } catch (error) {
    console.error("POST /api/user/set-password error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan internal pada server saat mengatur kata sandi." },
      { status: 500 }
    );
  }
}
