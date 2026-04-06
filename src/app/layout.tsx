import type { Metadata } from "next";
import { Inter, Noto_Serif_JP } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin", "japanese"],
  weight: ["400", "700", "900"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Sumo Love — Live Basho Tracker",
  description:
    "Follow your favourite rikishi through every basho. Live standings, match results, and kimarite for Makuuchi and Sanyaku.",
  keywords: ["sumo", "basho", "rikishi", "makuuchi", "sanyaku", "kimarite"],
  openGraph: {
    title: "Sumo Love",
    description: "Live sumo basho tracker",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${notoSerifJP.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-[#FAF7F2] text-[#1A1A1A] antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
