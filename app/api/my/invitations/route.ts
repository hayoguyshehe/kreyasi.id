import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createInvitationSchema } from "@/lib/validators/invitation";
import { generateInvitationSlug } from "@/lib/utils";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const invitations = await prisma.invitation.findMany({
      where: { userId: session.user.id },
      include: {
        package: {
          select: { name: true, slug: true, priceIdr: true },
        },
        template: {
          select: { name: true, slug: true, previewImageUrl: true },
        },
        _count: {
          select: { guests: true, rsvps: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("GET /api/my/invitations error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar undangan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = createInvitationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: parsed.error.issues?.[0]?.message || "Input tidak valid",
        },
        { status: 400 }
      );
    }

    const { templateId, packageId, eventCategory, eventTitle, eventDate, slug } =
      parsed.data;

    // Pastikan template & package valid
    const [template, pkg] = await Promise.all([
      prisma.template.findUnique({ where: { id: templateId } }),
      prisma.package.findUnique({ where: { id: packageId } }),
    ]);

    if (!template || !pkg) {
      return NextResponse.json(
        { success: false, error: "Template atau Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Slug generator
    let finalSlug = slug ? slug.toLowerCase().trim() : generateInvitationSlug(eventTitle);
    
    // Cek keunikan slug
    const existingSlug = await prisma.invitation.findUnique({
      where: { slug: finalSlug },
    });
    if (existingSlug) {
      finalSlug = generateInvitationSlug(eventTitle);
    }

    // Default content awal
    const defaultContent = {
      coverTitle: eventTitle,
      couple:
        eventCategory === "PERNIKAHAN"
          ? {
              groomName: "Mempelai Pria",
              groomNickname: "Pria",
              brideName: "Mempelai Wanita",
              brideNickname: "Wanita",
            }
          : undefined,
      person:
        eventCategory !== "PERNIKAHAN"
          ? {
              name: eventTitle,
            }
          : undefined,
      events: [
        {
          name: eventCategory === "PERNIKAHAN" ? "Akad & Resepsi" : "Acara Utama",
          date: new Date(eventDate).toISOString(),
          startTime: "09:00",
          endTime: "Selesai",
          venueName: "Nama Lokasi / Gedung",
          venueAddress: "Alamat Lengkap Acara",
        },
      ],
      gallery: [],
      theme: {
        primaryColor: "#D4AF37",
        fontFamily: "Plus Jakarta Sans",
      },
    };

    const newInvitation = await prisma.invitation.create({
      data: {
        userId: session.user.id,
        templateId,
        packageId,
        eventCategory,
        eventTitle,
        eventDate: new Date(eventDate),
        slug: finalSlug,
        content: defaultContent,
        status: "DRAFT",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Undangan berhasil diinisialisasi",
        data: newInvitation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/my/invitations error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat undangan baru" },
      { status: 500 }
    );
  }
}
