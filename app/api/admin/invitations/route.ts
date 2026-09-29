import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateInvitationSlug } from "@/lib/utils";
import type { EventCategory, InvitationStatus } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya SUPERADMIN yang diizinkan mengelola undangan kerjasama" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const isComplimentaryParam = searchParams.get("isComplimentary");
    const statusParam = searchParams.get("status");
    const packageIdParam = searchParams.get("packageId");

    const where: Record<string, unknown> = {};

    if (isComplimentaryParam !== null && isComplimentaryParam !== undefined && isComplimentaryParam !== "") {
      where.isComplimentary = isComplimentaryParam === "true";
    }

    if (statusParam && ["DRAFT", "PUBLISHED", "EXPIRED", "SUSPENDED"].includes(statusParam)) {
      where.status = statusParam as InvitationStatus;
    }

    if (packageIdParam) {
      where.packageId = packageIdParam;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { eventTitle: { contains: q, mode: "insensitive" } },
        { slug: { contains: q, mode: "insensitive" } },
        { user: { name: { contains: q, mode: "insensitive" } } },
        { user: { email: { contains: q, mode: "insensitive" } } },
        { complimentaryNote: { contains: q, mode: "insensitive" } },
      ];
    }

    const invitations = await prisma.invitation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        package: { select: { id: true, name: true, slug: true, priceIdr: true, maxGuests: true } },
        template: { select: { id: true, name: true, slug: true, previewImageUrl: true } },
        grantedBy: { select: { id: true, name: true, email: true } },
        _count: {
          select: { guests: true, rsvps: true, guestbook: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: invitations,
    });
  } catch (error) {
    console.error("GET /api/admin/invitations error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar undangan" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { success: false, error: "Akses ditolak: Hanya SUPERADMIN yang diizinkan membuat atau memberikan undangan kerjasama" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action = "create" } = body;

    // Aksi 1: Grant complimentary ke undangan yang sudah ada
    if (action === "grant") {
      const { invitationId, complimentaryNote, packageId } = body;
      if (!invitationId) {
        return NextResponse.json(
          { success: false, error: "ID undangan wajib disertakan" },
          { status: 400 }
        );
      }

      const existing = await prisma.invitation.findUnique({
        where: { id: invitationId },
      });

      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Undangan tidak ditemukan" },
          { status: 404 }
        );
      }

      const updateData: Record<string, unknown> = {
        isComplimentary: true,
        complimentaryNote: complimentaryNote ? complimentaryNote.trim() : "Undangan Kerjasama / Mitra",
        grantedById: session.user.id,
      };

      if (packageId) {
        const pkgExists = await prisma.package.findUnique({ where: { id: packageId } });
        if (pkgExists) {
          updateData.packageId = packageId;
        }
      }

      const updated = await prisma.invitation.update({
        where: { id: invitationId },
        data: updateData,
        include: {
          user: { select: { id: true, name: true, email: true } },
          package: { select: { id: true, name: true, slug: true } },
          grantedBy: { select: { id: true, name: true, email: true } },
        },
      });

      return NextResponse.json({
        success: true,
        message: "Status kerjasama / complimentary berhasil diberikan",
        data: updated,
      });
    }

    // Aksi 2: Buat undangan kerjasama baru langsung untuk user tertentu
    const {
      userId,
      packageId,
      templateId,
      eventCategory,
      eventTitle,
      eventDate,
      slug,
      complimentaryNote,
    } = body;

    if (!userId || !packageId || !templateId || !eventCategory || !eventTitle || !eventDate) {
      return NextResponse.json(
        {
          success: false,
          error: "Mohon lengkapi user, paket, template, kategori, judul, dan tanggal acara",
        },
        { status: 400 }
      );
    }

    const [userTarget, templateTarget, packageTarget] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.template.findUnique({ where: { id: templateId } }),
      prisma.package.findUnique({ where: { id: packageId } }),
    ]);

    if (!userTarget) {
      return NextResponse.json(
        { success: false, error: "User target tidak ditemukan" },
        { status: 404 }
      );
    }
    if (!templateTarget || !packageTarget) {
      return NextResponse.json(
        { success: false, error: "Template atau Paket tidak ditemukan" },
        { status: 404 }
      );
    }

    // Slug generator
    let finalSlug = slug ? slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, "") : generateInvitationSlug(eventTitle);
    const existingSlug = await prisma.invitation.findUnique({ where: { slug: finalSlug } });
    if (existingSlug) {
      finalSlug = generateInvitationSlug(eventTitle);
    }

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
        primaryColor: "#C5A059",
        fontFamily: "Plus Jakarta Sans",
      },
    };

    const newInvitation = await prisma.invitation.create({
      data: {
        userId,
        templateId,
        packageId,
        eventCategory: eventCategory as EventCategory,
        eventTitle: eventTitle.trim(),
        eventDate: new Date(eventDate),
        slug: finalSlug,
        content: defaultContent,
        status: "DRAFT",
        isComplimentary: true,
        complimentaryNote: complimentaryNote ? complimentaryNote.trim() : "Undangan Kerjasama / Mitra",
        grantedById: session.user.id,
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: { select: { id: true, name: true, slug: true } },
        template: { select: { id: true, name: true, slug: true } },
        grantedBy: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Undangan kerjasama berhasil dibuat dengan fitur penuh",
        data: newInvitation,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/invitations error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses undangan kerjasama" },
      { status: 500 }
    );
  }
}
