"use client";

import RikishiCard from "./RikishiCard";
import FavoriteButton from "./FavoriteButton";

interface RikishiItem {
  id: string;
  shikonaEn: string;
  shikona: string;
  currentRank: string | null;
  heyaEn: string;
  imageUrl: string | null;
  biography?: string | null;
  nameOrigin?: string | null;
  wins?: number;
  losses?: number;
  absences?: number;
}

export default function RikishiGrid({ rikishi }: { rikishi: RikishiItem[] }) {
  if (rikishi.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {rikishi.map((r) => (
        <div key={r.id} className="relative group">
          <RikishiCard
            id={r.id}
            shikonaEn={r.shikonaEn}
            shikona={r.shikona}
            currentRank={r.currentRank}
            heya={r.heyaEn}
            imageUrl={r.imageUrl}
            biography={r.biography}
            nameOrigin={r.nameOrigin}
            wins={r.wins}
            losses={r.losses}
            absences={r.absences}
          />
          <FavoriteButton rikishiId={r.id} variant="icon" />
        </div>
      ))}
    </div>
  );
}
