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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-white flex items-center gap-2.5">
          <Users className="w-6 h-6 text-amber-400" />
          <span>Manajemen Pengguna</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Kelola seluruh akun customer dan administrator, serta kontrol hak akses suspend.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Total Akun Terdaftar</p>
          <p className="text-2xl font-bold font-serif text-white">{totalUsers}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Pengelola (Admin / Super)</p>
          <p className="text-2xl font-bold font-serif text-amber-400">{adminCount}</p>
        </div>
        <div className="p-5 rounded-2xl bg-[#14171F] border border-slate-800 space-y-1">
          <p className="text-xs text-slate-400 font-medium">Akun Disuspend</p>
          <p className="text-2xl font-bold font-serif text-red-400">{suspendedCount}</p>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-2xl bg-[#14171F] border border-slate-800 overflow-hidden shadow-xl space-y-4 p-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nama, email, no telepon..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
          <span className="text-xs text-slate-400">
            Menampilkan {filteredUsers.length} dari {totalUsers} akun
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/20 text-slate-400 uppercase font-semibold text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Nama & Email</th>
                <th className="py-3.5 px-4">Kontak</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Aktivitas</th>
                <th className="py-3.5 px-4">Status Akun</th>
                <th className="py-3.5 px-4">Bergabung</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Tidak ada pengguna yang cocok dengan pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuper = user.role === "SUPERADMIN";

                  return (
                    <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-[11px] text-slate-400">{user.email}</p>
                      </td>
                      <td className="py-4 px-4 text-slate-400">
                        {user.phone || "-"}
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={user.role === "CUSTOMER" ? "outline" : "gold"}
                          className="text-[10px] py-0.5"
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-300 space-y-0.5">
                        <p>{user._count.invitations} Undangan</p>
                        <p className="text-[11px] text-slate-500">{user._count.orders} Transaksi</p>
                      </td>
                      <td className="py-4 px-4">
                        {user.isSuspended ? (
                          <Badge variant="danger" className="text-[10px] py-0.5">
                            Disuspend
                          </Badge>
                        ) : (
                          <Badge variant="success" className="text-[10px] py-0.5">
                            Aktif
                          </Badge>
                        )}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap">
                        {formatDateIndonesia(user.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        {!isSuper && (
                          <Button
                            variant={user.isSuspended ? "outline" : "danger"}
                            size="sm"
                            disabled={loadingId === user.id}
                            onClick={() => handleToggleSuspend(user)}
                            className="text-xs gap-1.5"
                          >
                            {loadingId === user.id ? (
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            ) : user.isSuspended ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Aktifkan</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5" />
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
