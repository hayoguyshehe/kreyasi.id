import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Konfigurasi image domains untuk Cloudflare R2
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      // Google OAuth profile images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },

  // Packages yang perlu dijalankan di server (bukan bundled ke client)
  serverExternalPackages: ["bcryptjs", "@prisma/client"],
};

export default nextConfig;
