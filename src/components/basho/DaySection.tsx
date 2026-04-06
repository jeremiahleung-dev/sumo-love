"use client";

import { useState } from "react";
import MatchRow from "./MatchRow";

interface Match {
  id: string;
  eastRikishiId: string;
  eastShikona: string;
  westRikishiId: string;
  westShikona: string;
  winnerId: string | null;
  kimariteEn: string | null;
  kimariteId: string | null;
  highlightUrl: string | null;
}

export default function DaySection({
  day,
  matches,
  featuredIds,
}: {
  day: number;
  matches: Match[];
  featuredIds: string[];
}) {
  const [expanded, setExpanded] = useState(false);

  const featured = new Set(featuredIds);
  // Bouts involving at least one top-4 rikishi (by tournament record)
  const preview = matches.filter(
    (m) => featured.has(m.eastRikishiId) || featured.has(m.westRikishiId)
  );
  const visible = expanded ? matches : preview;
  const hiddenCount = matches.length - preview.length;

  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4A97A] mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-white/10" />
        Day {day}
        <span className="h-px flex-1 bg-white/10" />
      </h3>

      {visible.map((m) => (
        <MatchRow
          key={m.id}
          eastId={m.eastRikishiId}
          eastShikona={m.eastShikona}
          westId={m.westRikishiId}
          westShikona={m.westShikona}
          winnerId={m.winnerId}
          kimariteEn={m.kimariteEn}
          kimariteId={m.kimariteId}
          highlightUrl={m.highlightUrl}
        />
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-xs text-white/30 hover:text-[#D4A97A] py-2 mt-1 transition-colors"
        >
          + {hiddenCount} more bout{hiddenCount !== 1 ? "s" : ""} this day
        </button>
      )}

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full text-xs text-white/30 hover:text-[#D4A97A] py-2 mt-1 transition-colors"
        >
          Show fewer bouts
        </button>
      )}
    </div>
  );
}
