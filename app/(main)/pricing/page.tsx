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
        <Badge variant="sage">Pilihan Paket Transparan</Badge>
        <h1 className="text-3xl sm:text-5xl font-bold font-serif text-[#2A211B] tracking-tight">
          Investasi Terjangkau untuk Momen Sekali Seumur Hidup
        </h1>
        <p className="text-sm sm:text-base text-[#6B5E55] max-w-2xl mx-auto">
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
                  ? "paper-card-gold bg-white ring-2 ring-[#C5A059] shadow-xl md:scale-105 z-10"
                  : isExclusive
                  ? "paper-card bg-white border-[#C5A059]/40 shadow-md"
                  : "paper-card bg-white"
              } p-6`}
            >
              {isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 rounded-full bg-linear-to-r from-[#C5A059] to-[#9A7527] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap">
                    Paling Populer
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-[#2A211B] font-serif">{pkg.name}</h3>
                  <p className="text-xs text-[#7A6E65] mt-0.5">Aktif {pkg.activeDurationDays} Hari</p>
                </div>

                <div className="pt-2 pb-1 border-b border-[#EAE3D8]">
                  <span className="text-2xl sm:text-3xl font-bold text-[#2A211B] tracking-tight font-serif">
                    {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                  </span>
                  {pkg.priceIdr > 0 && <span className="text-xs text-[#7A6E65] block mt-0.5">bayar satu kali</span>}
                </div>

                {/* Features list */}
                <ul className="space-y-2.5 text-xs text-[#5E534B] pt-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    <span>Maksimal {pkg.maxGalleryPhotos} Foto Galeri</span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.maxGalleryVideos > 0 ? (
                      <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] shrink-0 mt-0.5" />
                    )}
                    <span className={pkg.maxGalleryVideos === 0 ? "text-[#9E9388]" : ""}>
                      {pkg.maxGalleryVideos > 0 ? `${pkg.maxGalleryVideos} Video Galeri` : "Tanpa Video Galeri"}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    <span>{pkg.maxGuests ? `Hingga ${pkg.maxGuests} Tamu` : "Tamu Tak Terbatas"}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.digitalGiftAllowed ? (
                      <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] shrink-0 mt-0.5" />
                    )}
                    <span className={!pkg.digitalGiftAllowed ? "text-[#9E9388]" : ""}>
                      Amplop Kado Digital (QRIS)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {pkg.customDomainAllowed ? (
                      <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] shrink-0 mt-0.5" />
                    )}
                    <span className={!pkg.customDomainAllowed ? "text-[#9E9388]" : ""}>
                      Custom Domain (.com/.id)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    {!pkg.watermark ? (
                      <Check className="w-4 h-4 text-[#4C6957] shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] shrink-0 mt-0.5" />
                    )}
                    <span className={pkg.watermark ? "text-[#9E9388]" : ""}>
                      {!pkg.watermark ? "Tanpa Watermark Kreyasi" : "Ada Watermark Kreyasi"}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 mt-4 border-t border-[#EAE3D8]">
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
        <h2 className="text-2xl font-bold font-serif text-[#2A211B] text-center">
          Tabel Komparasi Fitur Lengkap
        </h2>

        <div className="overflow-x-auto rounded-2xl paper-card bg-white border border-[#EAE3D8]">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#F5EFEB] border-b border-[#EAE3D8] text-[#2A211B]">
              <tr>
                <th className="p-4 font-semibold">Fitur & Batasan</th>
                {packages.map((pkg) => (
                  <th key={pkg.id} className="p-4 font-semibold text-center">
                    {pkg.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE3D8] text-[#5E534B]">
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Harga Sekali Bayar</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center font-bold text-[#4C6957]">
                    {pkg.priceIdr === 0 ? "Gratis" : formatRupiah(pkg.priceIdr)}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Masa Aktif Undangan</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.activeDurationDays} Hari
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Kapasitas Galeri Foto</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGalleryPhotos} Foto
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Kapasitas Galeri Video</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGalleryVideos > 0 ? `${pkg.maxGalleryVideos} Video` : "-"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Maksimal Daftar Tamu</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.maxGuests ? `${pkg.maxGuests} Tamu` : "Unlimited"}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Amplop Kado Digital (QRIS)</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.digitalGiftAllowed ? (
                      <Check className="w-4 h-4 text-[#4C6957] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Bebas Watermark Brand</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {!pkg.watermark ? (
                      <Check className="w-4 h-4 text-[#4C6957] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 font-semibold text-[#2A211B]">Custom Domain Pribadi</td>
                {packages.map((pkg) => (
                  <td key={pkg.id} className="p-4 text-center">
                    {pkg.customDomainAllowed ? (
                      <Check className="w-4 h-4 text-[#4C6957] mx-auto" />
                    ) : (
                      <X className="w-4 h-4 text-[#C2B7AC] mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA Box */}
      <div className="p-8 sm:p-12 rounded-3xl paper-card-gold text-center max-w-3xl mx-auto space-y-4 bg-white">
        <h3 className="text-2xl font-bold font-serif text-[#2A211B]">
          Masih Bingung Memilih Paket yang Tepat?
        </h3>
        <p className="text-xs sm:text-sm text-[#6B5E55] max-w-lg mx-auto leading-relaxed">
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
