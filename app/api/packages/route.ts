import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: packages,
    });
  } catch (error) {
    console.error("GET /api/packages error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil daftar paket harga",
      },
      { status: 500 }
    );
  }
}
