import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const categorySlug = searchParams.get("category");
    const tier = searchParams.get("tier");

    const whereClause: Record<string, unknown> = {
      isActive: true,
    };

    if (categoryId) {
      whereClause.categoryId = categoryId;
    } else if (categorySlug && categorySlug !== "all") {
      whereClause.category = {
        slug: categorySlug,
      };
    }

    if (tier) {
      whereClause.minPackageTier = {
        lte: parseInt(tier, 10),
      };
    }

    const templates = await prisma.template.findMany({
      where: whereClause,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: templates,
    });
  } catch (error) {
    console.error("GET /api/templates error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil katalog template",
      },
      { status: 500 }
    );
  }
}
