import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kreyasi.id | Platform Undangan Pernikahan & Acara Digital Elegan",
    template: "%s | Kreyasi.id",
  },
  description:
    "Platform undangan pernikahan & acara digital dengan sentuhan desain hangat, anggun, dan estetik khas Indonesia.",
  icons: {
    icon: "/images/logo/kreyasi-profile.png",
    apple: "/images/logo/kreyasi-profile.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
