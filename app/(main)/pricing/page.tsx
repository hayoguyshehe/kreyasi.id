import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Sparkles, HelpCircle, ArrowRight } from "lucide-react";

export const revalidate = 3600; // Cache 1 jam

export default async function PricingPage() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="gold">Pilihan Paket Transparan</Badge>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-white tracking-tight">
          Investasi Terjangkau untuk Momen Sekali Seumur Hidup
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Pilih paket yang paling sesuai dengan kebutuhan Anda. Seluruh paket sudah termasuk buku tamu, RSVP real-time, dan petunjuk lokasi Google Maps.
        </p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
        {packages.map((pkg) => {
          const isPopular = pkg.slug === "standar";
          const isExclusive = pkg.slug === "eksklusif";

          return (
            <div
              key={pkg.id}
              className={`rounded-2xl flex flex-col justify-between transition-all duration-200 relative ${
                isPopular
                  ? "bg-linear-to-b from-[#1E2430] to-[#14171F] border-2 border-amber-500 shadow-2xl shadow-amber-500/10 scale-105 z-10"
                  : isExclusive
                  ? "bg-[#14171F] border border-amber-500/40 shadow-xl"
                  : "bg-[#14171F] border border-slate-800"
              } p-6`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-linear-to-r from-amber-400 to-amber-600 text-slate-950 text-[11px] font-bold uppercase tracking-wider shadow-md">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white font-serif">{pkg.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Aktif {pkg.activeDurationDays} Hari</p>
                </div>

                <div className="pt-2 pb-1 border-b border-slate-800/80">
                  <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-serif">
                    {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                  </span>
                  {pkg.priceIdr > 0 && <span className="text-xs text-slate-400 block mt-0.5">bayar satu kali</span>}
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 text-xs text-slate-300 pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>Maksimal {pkg.maxGalleryPhotos} Foto Galeri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.maxGalleryVideos > 0 ? (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={pkg.maxGalleryVideos === 0 ? "text-slate-500" : ""}>
                      {pkg.maxGalleryVideos > 0 ? `${pkg.maxGalleryVideos} Video Galeri` : "Tanpa Video Galeri"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{pkg.maxGuests ? `Hingga ${pkg.maxGuests} Tamu` : "Tamu Tak Terbatas"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.digitalGiftAllowed ? (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={!pkg.digitalGiftAllowed ? "text-slate-500" : ""}>
                      Amplop Kado Digital (QRIS)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.customDomainAllowed ? (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={!pkg.customDomainAllowed ? "text-slate-500" : ""}>
                      Custom Domain (.com/.id)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {!pkg.watermark ? (
                      <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    )}
                    <span className={pkg.watermark ? "text-slate-500" : ""}>
                      {!pkg.watermark ? "Tanpa Watermark Kreyasi" : "Ada Watermark Kreyasi"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-slate-800/80">
                <Link href={`/register?package=${pkg.slug}`}>
                  <Button
                    variant={isPopular ? "gold" : "outline"}
                    className="w-full text-xs justify-center"
                  >
                    Pilih {pkg.name}
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Table */}
      <div className="pt-8 space-y-6">
        <h2 className="text-2xl font-bold font-serif text-white text-center">
          Tabel Komparasi Fitur Lengkap
        </h2>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#14171F]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1C212C] border-b border-slate-800 text-slate-200">
              <tr>
                <th className="p-4 font-semibold">Fitur & Batasan</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 font-semibold text-center">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-4 font-medium text-white">Harga Sekali Bayar</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center font-semibold text-amber-400">
                    {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Masa Aktif Undangan</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.activeDurationDays} Hari
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Kapasitas Galeri Foto</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGalleryPhotos} Foto
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Kapasitas Galeri Video</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGalleryVideos > 0 ? `${pkg.maxGalleryVideos} Video` : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Maksimal Daftar Tamu</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGuests ? `${pkg.maxGuests} Tamu` : "Unlimited"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Amplop Kado Digital (QRIS)</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.digitalGiftAllowed ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Bebas Watermark Brand</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {!pkg.watermark ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-medium text-white">Custom Domain Pribadi</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.customDomainAllowed ? (
                      <Check className="w-4 h-4 text-emerald-400 mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-slate-600 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 rounded-2xl glass-panel-gold text-center max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold font-serif text-white">
          Masih Bingung Memilih Paket yang Tepat?
        </h3>
        <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed">
          Anda bisa mulai dengan paket Gratis untuk mencoba editor dan melihat preview undangan Anda terlebih dahulu. Upgrade ke paket berbayar dapat dilakukan kapan saja!
        </p>
        <div className="pt-2">
          <Link href="/register">
            <Button variant="gold" size="md">
              Coba Sekarang Secara Gratis
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
