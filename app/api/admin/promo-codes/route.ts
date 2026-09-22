import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const promoCodes = await prisma.promoCode.findMany({
      orderBy: { validUntil: "desc" },
      include: {
        _count: { select: { orders: true } },
      },
    });

    return NextResponse.json({
      success: true,
      data: promoCodes,
    });
  } catch (error) {
    console.error("GET /api/admin/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar kode promo" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      code,
      discountType,
      discountValue,
      maxUses,
      validFrom,
      validUntil,
      isActive = true,
    } = body;

    if (!code || !discountType || discountValue === undefined || !validUntil) {
      return NextResponse.json(
        {
          success: false,
          error: "Kode, jenis diskon, nominal diskon, dan masa berlaku wajib diisi",
        },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    const existing = await prisma.promoCode.findUnique({
      where: { code: cleanCode },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Kode promo ini sudah ada" },
        { status: 400 }
      );
    }

    const promo = await prisma.promoCode.create({
      data: {
        code: cleanCode,
        discountType: discountType === "PERCENT" ? "PERCENT" : "FIXED",
        discountValue: Number(discountValue),
        maxUses: maxUses !== undefined && maxUses !== null && maxUses !== "" ? Number(maxUses) : null,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: new Date(validUntil),
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Kode promo baru berhasil dibuat",
        data: promo,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/promo-codes error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat kode promo" },
      { status: 500 }
    );
  }
}
