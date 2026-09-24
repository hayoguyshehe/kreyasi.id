"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, EyeOff, Eye, CheckCircle2, MessageSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateIndonesia } from "@/lib/utils";

interface MessageItem {
  id: string;
  name: string;
  message: string;
  isApproved: boolean;
  createdAt: string;
}

export function GuestbookManager({
  invitationId,
  initialMessages,
}: {
  invitationId: string;
  initialMessages: MessageItem[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);

  const handleDelete = async (msgId: string) => {
    if (!confirm("Hapus ucapan doa ini secara permanen?")) return;

    try {
      const res = await fetch(
        `/api/my/invitations/${invitationId}/guestbook/${msgId}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setMessages(messages.filter((m) => m.id !== msgId));
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleApprove = async (msgId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(
        `/api/my/invitations/${invitationId}/guestbook/${msgId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isApproved: !currentStatus }),
        }
      );
      if (res.ok) {
        setMessages(
          messages.map((m) =>
            m.id === msgId ? { ...m, isApproved: !currentStatus } : m
          )
        );
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-xs text-[#6B5E55] bg-white p-3.5 rounded-xl border border-[#EAE3D8] shadow-xs">
        <span>
          Total Ucapan Masuk: <strong className="text-[#2A211B]">{messages.length}</strong>
        </span>
        <span className="text-[#7A6D63]">
          Ucapan yang disembunyikan tidak akan tampil di undangan publik tamu
        </span>
      </div>

      {messages.length === 0 ? (
        <Card variant="subtle" className="p-10 text-center space-y-3 border-[#EAE3D8]">
          <div className="w-12 h-12 rounded-full bg-[#EFE8DD] text-[#4C6957] mx-auto flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-[#2A211B]">Belum Ada Ucapan</h3>
            <p className="text-xs text-[#6B5E55] max-w-sm mx-auto">
              Ucapan dan doa dari para tamu undangan akan tampil di halaman ini secara otomatis.
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {messages.map((msg) => (
            <Card
              key={msg.id}
              variant="default"
              className={`p-5 flex flex-col justify-between space-y-4 border ${
                msg.isApproved ? "border-[#EAE3D8]" : "border-red-300 bg-red-50/30"
              } shadow-xs`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#2A211B]">{msg.name}</span>
                    <Badge variant={msg.isApproved ? "success" : "danger"}>
                      {msg.isApproved ? "Tampil" : "Disembunyikan"}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-[#7A6D63] whitespace-nowrap">
                    {formatDateIndonesia(msg.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-[#5A4D44] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-lg border border-[#EAE3D8]">
                  &quot;{msg.message}&quot;
                </p>
              </div>

              <div className="pt-2 border-t border-[#EAE3D8] flex items-center justify-between text-xs">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleApprove(msg.id, msg.isApproved)}
                  className="text-xs gap-1.5 hover:border-[#4C6957] hover:text-[#4C6957]"
                >
                  {msg.isApproved ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Sembunyikan</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-[#4C6957]" />
                      <span>Tampilkan</span>
                    </>
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => handleDelete(msg.id)}
                  className="p-1.5 text-[#7A6D63] hover:text-red-600 transition-colors"
                  title="Hapus Ucapan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
