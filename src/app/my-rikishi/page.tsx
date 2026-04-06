import type { Metadata } from "next";
import FavoritesGrid from "./FavoritesGrid";

export const metadata: Metadata = {
  title: "My Rikishi — Sumo Love",
  description: "Your followed rikishi — track their standings and results in one place.",
};

export default function MyRikishiPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-4xl mb-1">My Rikishi</h1>
        <p className="text-[#D4A97A]">お気に入り力士</p>
      </div>
      <FavoritesGrid />
    </div>
  );
}
