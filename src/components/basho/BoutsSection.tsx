"use client";

import { useState } from "react";
import DaySection from "./DaySection";

interface Match {
  id: string;
  eastRikishiId: string;
  eastShikona: string;
  eastRecord: { wins: number; losses: number } | null;
  westRikishiId: string;
  westShikona: string;
  westRecord: { wins: number; losses: number } | null;
  winnerId: string | null;
  kimariteEn: string | null;
  kimariteId: string | null;
  highlightUrl: string | null;
}

interface DayData {
  day: number;
  matches: Match[];
}

export default function BoutsSection({
  days,
  featuredIds,
  defaultDay,
  isActive,
}: {
  days: DayData[];
  featuredIds: string[];
  defaultDay: number;
  isActive: boolean;
}) {
  const [selectedDay, setSelectedDay] = useState(defaultDay);
  const current = days.find((d) => d.day === selectedDay) ?? days[days.length - 1];

  return (
    <div>
      {/* Day picker */}
      <div className="flex items-center gap-1 flex-wrap mb-6 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => setSelectedDay(d.day)}
            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              d.day === selectedDay
                ? "bg-[#C0292A] text-white"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
            }`}
          >
            Day {d.day}
          </button>
        ))}
      </div>

      {/* Selected day bouts */}
      {current && (
        <DaySection
          day={current.day}
          matches={current.matches}
          featuredIds={featuredIds}
        />
      )}
    </div>
  );
}
