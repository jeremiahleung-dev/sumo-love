"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import RikishiCard from "@/components/rikishi/RikishiCard";

interface RikishiData {
  id: string;
  shikonaEn: string;
  shikona: string;
  currentRank: string | null;
  heyaEn: string;
  imageUrl: string | null;
  bashoEntries: Array<{ wins: number; losses: number; absences: number }>;
}

export default function FavoritesGrid() {
  const { favoriteIds, toggle, count } = useFavorites();
  const [rikishi, setRikishi] = useState<RikishiData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favoriteIds.length === 0) {
      setRikishi([]);
      return;
    }
    setLoading(true);
    fetch(`/api/rikishi/favorites?ids=${favoriteIds.join(",")}`)
      .then((r) => r.json())
      .then((data: RikishiData[]) => {
        // Preserve the user's follow order and prune any stale IDs
        const byId = new Map(data.map((r) => [r.id, r]));
        setRikishi(favoriteIds.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])));
      })
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  // Refetch when tab regains focus
  useEffect(() => {
    function onFocus() {
      if (favoriteIds.length === 0) return;
      fetch(`/api/rikishi/favorites?ids=${favoriteIds.join(",")}`)
        .then((r) => r.json())
        .then((data: RikishiData[]) => {
          const byId = new Map(data.map((r) => [r.id, r]));
          setRikishi(favoriteIds.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])));
        });
    }
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [favoriteIds]);

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <span className="text-7xl text-[#D4A97A]/20 font-display font-black select-none mb-6">
          力
        </span>
        <p className="font-display text-2xl font-bold mb-2">No favourites yet</p>
        <p className="text-white/40 text-sm mb-8 max-w-xs">
          Tap the heart on any rikishi card or profile to follow them here.
        </p>
        <Link
          href="/rikishi"
          className="bg-[#C0292A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1A1A] transition-colors"
        >
          Browse Rikishi
        </Link>
      </div>
    );
  }

  if (loading && rikishi.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {favoriteIds.map((id) => (
          <div key={id} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {rikishi.map((r) => {
        const entry = r.bashoEntries[0];
        return (
          <div key={r.id} className="relative group">
            <RikishiCard
              id={r.id}
              shikonaEn={r.shikonaEn}
              shikona={r.shikona}
              currentRank={r.currentRank}
              heya={r.heyaEn}
              imageUrl={r.imageUrl}
              wins={entry?.wins}
              losses={entry?.losses}
              absences={entry?.absences}
            />
            <button
              onClick={() => toggle(r.id)}
              className="absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full bg-[#C0292A] text-white opacity-0 group-hover:opacity-100 sm:opacity-100 transition-opacity hover:bg-[#8B1A1A]"
              aria-label="Remove from favourites"
            >
              <X size={13} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
