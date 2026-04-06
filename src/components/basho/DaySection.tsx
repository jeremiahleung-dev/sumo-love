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

const PREVIEW_COUNT = 3;

export default function DaySection({ day, matches }: { day: number; matches: Match[] }) {
  const [expanded, setExpanded] = useState(false);

  // Show last N by default — final bouts of the day are highest-ranked
  const visible = expanded ? matches : matches.slice(-PREVIEW_COUNT);
  const hidden = matches.length - PREVIEW_COUNT;

  return (
    <div>
      <h3 className="text-xs uppercase tracking-widest font-bold text-[#D4A97A] mb-3 flex items-center gap-2">
        <span className="h-px flex-1 bg-white/10" />
        Day {day}
        <span className="h-px flex-1 bg-white/10" />
      </h3>

      {!expanded && hidden > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="w-full text-xs text-white/30 hover:text-[#D4A97A] py-2 mb-1 transition-colors"
        >
          ↑ {hidden} earlier bout{hidden !== 1 ? "s" : ""} hidden
        </button>
      )}

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

      {expanded && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full text-xs text-white/30 hover:text-[#D4A97A] py-2 mt-1 transition-colors"
        >
          ↑ Show fewer bouts
        </button>
      )}
    </div>
  );
}
