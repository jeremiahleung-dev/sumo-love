import type { Metadata } from "next";
import FavoritesGrid from "./FavoritesGrid";

export const metadata: Metadata = {
  title: "My Rikishi — dohyo",
  description: "Your followed rikishi — track their standings and results in one place.",
};

export default function MyRikishiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <p className="text-[#DC2626] text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
          Following
        </p>
        <h1 className="font-display font-black text-4xl text-[#FAFAFA]">My Rikishi</h1>
      </div>
      <FavoritesGrid />
    </div>
  );
}
