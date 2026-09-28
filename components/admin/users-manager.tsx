"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDateIndonesia } from "@/lib/utils";
import { Users, Shield, UserX, UserCheck, Search, RotateCw } from "lucide-react";

interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "CUSTOMER" | "ADMIN" | "SUPERADMIN";
  isSuspended: boolean;
  createdAt: string;
  _count: {
    invitations: number;
    orders: number;
  };
}

export function UsersManager({ initialUsers }: { initialUsers: UserItem[] }) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.phone && u.phone.includes(search))
  );

  const handleToggleSuspend = async (user: UserItem) => {
    if (user.role === "SUPERADMIN") {
      alert("Akun Superadmin tidak dapat disuspend.");
      return;
    }

    const actionText = user.isSuspended ? "mengaktifkan kembali" : "men-suspend";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} akun ${user.name}?`)) {
      return;
    }

    setLoadingId(user.id);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isSuspended: !user.isSuspended }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Gagal memperbarui status user");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, isSuspended: !u.isSuspended } : u
        )
      );
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoadingId(null);
    }
  };

  const totalUsers = users.length;
  const suspendedCount = users.filter((u) => u.isSuspended).length;
  const adminCount = users.filter((u) => u.role === "ADMIN" || u.role === "SUPERADMIN").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-[#2A211B] tracking-tight">
          Manajemen Pengguna
        </h1>
        <p className="text-xs text-[#6B5E55] mt-1">
          Kelola seluruh akun customer dan administrator, serta kontrol hak akses suspend.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Total Akun Terdaftar</p>
          <p className="text-2xl font-bold font-serif text-[#2A211B]">{totalUsers}</p>
          <p className="text-[11px] text-[#7A6D63]">akun aktif dan suspend</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Pengelola (Admin / Super)</p>
          <p className="text-2xl font-bold font-serif text-[#8C6A28]">{adminCount}</p>
          <p className="text-[11px] text-[#8C6A28]/80">akses panel admin</p>
        </div>
        <div className="p-4 rounded-xl bg-white border border-[#EAE3D8] shadow-xs space-y-1">
          <p className="text-xs text-[#6B5E55] font-medium">Akun Disuspend</p>
          <p className="text-2xl font-bold font-serif text-[#8C3A27]">{suspendedCount}</p>
          <p className="text-[11px] text-[#8C3A27]/80">akses dinonaktifkan</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-white border border-[#EAE3D8] overflow-hidden shadow-xs space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#7A6D63] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, email, no telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-[#EAE3D8] rounded-xl text-xs text-[#2A211B] placeholder-[#7A6D63] focus:outline-none focus:border-[#4C6957] focus:ring-1 focus:ring-[#4C6957]/20"
            />
          </div>
          <span className="text-xs text-[#6B5E55]">
            Menampilkan {filteredUsers.length} dari {totalUsers} akun
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#EAE3D8] bg-[#F5EFEB]/50 text-[#6B5E55] font-semibold text-xs">
                <th className="py-3 px-4">Nama &amp; Email</th>
                <th className="py-3 px-4">Kontak</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Aktivitas</th>
                <th className="py-3 px-4">Status Akun</th>
                <th className="py-3 px-4">Bergabung</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D8] text-[#2A211B]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#7A6D63]">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuper = user.role === "SUPERADMIN";

                  return (
                    <tr key={user.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-[#2A211B]">{user.name}</p>
                        <p className="text-[11px] text-[#7A6D63] font-mono">{user.email}</p>
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5E55]">
                        {user.phone || "-"}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                            user.role === "CUSTOMER"
                              ? "bg-[#F5EFEB] text-[#6B5E55] border border-[#EAE3D8]"
                              : "bg-[#C5A059]/15 text-[#8C6A28] border border-[#C5A059]/30"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5">
                        <p className="font-medium text-[#2A211B]">{user._count.invitations} Undangan</p>
                        <p className="text-[11px] text-[#7A6D63]">{user._count.orders} Transaksi</p>
                      </td>
                      <td className="py-3.5 px-4">
                        {user.isSuspended ? (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8C3A27]/10 text-[#8C3A27] border border-[#8C3A27]/20">
                            Disuspend
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#4C6957]/10 text-[#4C6957] border border-[#4C6957]/20">
                            Aktif
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-[#6B5E55] whitespace-nowrap text-[11px]">
                        {formatDateIndonesia(user.createdAt)}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {!isSuper && (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingId === user.id}
                            onClick={() => handleToggleSuspend(user)}
                            className={`text-xs gap-1.5 py-1 px-2.5 h-auto ${
                              user.isSuspended
                                ? "text-[#4C6957] border-[#4C6957]/30 hover:bg-[#4C6957]/10"
                                : "text-[#8C3A27] border-[#8C3A27]/30 hover:bg-[#8C3A27]/10"
                            }`}
                          >
                            {loadingId === user.id ? (
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            ) : user.isSuspended ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-[#4C6957]" />
                                <span>Aktifkan</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-[#8C3A27]" />
                                <span>Suspend</span>
                              </>
                            )}
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
