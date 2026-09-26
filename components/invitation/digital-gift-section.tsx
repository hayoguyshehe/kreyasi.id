"use client";

import React, { useState } from "react";
import { Gift, CreditCard, Copy, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GiftAccountItem {
  id: string;
  type: string;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  qrisImageUrl: string | null;
}

export function DigitalGiftSection({
  accounts,
  description,
  physicalGiftAddress,
}: {
  accounts: GiftAccountItem[];
  description?: string;
  physicalGiftAddress?: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  if ((!accounts || accounts.length === 0) && !physicalGiftAddress) return null;

  const handleCopy = (accountNumber: string, id: string) => {
    navigator.clipboard.writeText(accountNumber);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <section className="space-y-6 max-w-xl mx-auto">
      <div className="text-center space-y-2">
        <p className="text-xs uppercase tracking-[0.25em] text-[#8C6A28] font-semibold">
          Tanda Kasih
        </p>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A211B]">
          Amplop Kado Digital
        </h2>
        <p className="text-xs text-stone-500 leading-relaxed max-w-sm mx-auto">
          {description ||
            "Doa restu Anda merupakan karunia terindah bagi kami. Namun jika Anda bermaksud memberikan tanda kasih, dapat melalui rekening berikut:"}
        </p>
      </div>

      <div className="space-y-4">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="p-6 rounded-3xl bg-white border border-[#C5A059]/20 shadow-xl shadow-[#C5A059]/5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6A28] font-serif uppercase tracking-wider">
                {acc.bankName || acc.type}
              </span>
              <CreditCard className="w-5 h-5 text-stone-400" />
            </div>

            {acc.accountNumber && (
              <div className="space-y-1">
                <span className="text-xl sm:text-2xl font-mono font-bold text-[#2A211B] tracking-wider block">
                  {acc.accountNumber}
                </span>
                <span className="text-xs text-stone-500 block">
                  a.n. {acc.accountName || "Penerima"}
                </span>
              </div>
            )}

            {acc.qrisImageUrl && (
              <div className="text-center py-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={acc.qrisImageUrl}
                  alt="QRIS"
                  className="w-48 h-48 mx-auto rounded-xl border border-[#C5A059]/20 object-contain bg-white p-2"
                />
                <span className="text-[10px] text-stone-500 block mt-1">
                  Scan QRIS untuk pembayaran digital
                </span>
              </div>
            )}

            {acc.accountNumber && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(acc.accountNumber!, acc.id)}
                className="w-full gap-2 text-xs text-stone-600 border-stone-200 hover:border-[#C5A059] hover:text-[#8C6A28] hover:bg-[#F5EFEB]/50"
              >
                {copiedId === acc.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Nomor Rekening Berhasil Disalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                    <span>Salin Nomor Rekening</span>
                  </>
                )}
              </Button>
            )}
          </div>
        ))}

        {physicalGiftAddress && (
          <div className="p-6 rounded-3xl bg-white border border-[#C5A059]/30 shadow-xl shadow-[#C5A059]/5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#8C6A28] font-serif uppercase tracking-wider flex items-center gap-1.5">
                <Gift className="w-4 h-4 text-[#8C6A28]" />
                Kirim Kado Fisik
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-stone-600 leading-relaxed font-sans whitespace-pre-line">
                {physicalGiftAddress}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyAddress(physicalGiftAddress)}
              className="w-full gap-2 text-xs text-stone-600 border-stone-200 hover:border-[#C5A059] hover:text-[#8C6A28] hover:bg-[#F5EFEB]/50"
            >
              {copiedAddress ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Alamat Pengiriman Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Salin Alamat Pengiriman</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
