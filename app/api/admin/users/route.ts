import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const role = searchParams.get("role");

    const where: Record<string, unknown> = {};

    if (role && ["CUSTOMER", "ADMIN", "SUPERADMIN"].includes(role)) {
      where.role = role as UserRole;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
        { phone: { contains: q, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isSuspended: true,
        createdAt: true,
        _count: {
          select: {
            invitations: true,
            orders: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar pengguna" },
      { status: 500 }
    );
  }
}
