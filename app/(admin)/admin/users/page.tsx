import React from "react";
import { prisma } from "@/lib/prisma";
import { UsersManager } from "@/components/admin/users-manager";

export const metadata = {
  title: "Manajemen Pengguna | Admin Kreyasi.id",
};

export default async function AdminUsersPage() {
  const rawUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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

  const users = rawUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return <UsersManager initialUsers={users} />;
}
