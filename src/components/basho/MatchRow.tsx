"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";

interface Props {
  eastId: string;
  eastShikona: string;
  eastRecord?: { wins: number; losses: number } | null;
  westId: string;
  westShikona: string;
  westRecord?: { wins: number; losses: number } | null;
  winnerId: string | null;
  kimariteEn: string | null;
  kimariteId: string | null;
  highlightUrl: string | null;
}

export default function MatchRow({
  eastId,
  eastShikona,
  eastRecord,
  westId,
  westShikona,
  westRecord,
  winnerId,
  kimariteEn,
  kimariteId,
  highlightUrl,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const eastWon = winnerId === eastId;
  const westWon = winnerId === westId;

  return (
    <div className="border border-white/10 rounded-lg overflow-hidden mb-2">
      <div className="flex items-center p-3 gap-2">

        {/* East */}
        <div className={`flex-1 text-right transition-opacity ${!winnerId || eastWon ? "opacity-100" : "opacity-35"}`}>
          <Link href={`/rikishi/${eastId}`} className="font-display font-semibold hover:text-[#C0292A] transition-colors">
            {eastWon && <span className="mr-1 text-[10px] text-[#52B788] align-middle">●</span>}
            {eastShikona}
          </Link>
          {eastRecord != null && (
            <p className="text-[11px] font-mono text-white/35 mt-0.5">
              {eastRecord.wins}W–{eastRecord.losses}L
            </p>
          )}
        </div>

        {/* VS divider */}
        <span className="text-[10px] text-[#D4A97A] font-bold uppercase tracking-widest flex-shrink-0 px-1">
          vs
        </span>

        {/* West */}
        <div className={`flex-1 transition-opacity ${!winnerId || westWon ? "opacity-100" : "opacity-35"}`}>
          <Link href={`/rikishi/${westId}`} className="font-display font-semibold hover:text-[#C0292A] transition-colors">
            {westShikona}
            {westWon && <span className="ml-1 text-[10px] text-[#52B788] align-middle">●</span>}
          </Link>
          {westRecord != null && (
            <p className="text-[11px] font-mono text-white/35 mt-0.5">
              {westRecord.wins}W–{westRecord.losses}L
            </p>
          )}
        </div>

        {/* Kimarite + highlight — right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {kimariteEn && (
            <Link
              href={kimariteId ? `/kimarite/${kimariteId}` : "#"}
              className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2 py-1 rounded hover:border-[#D4A97A] hover:text-[#D4A97A] transition-colors whitespace-nowrap"
            >
              {kimariteEn}
            </Link>
          )}
          {highlightUrl && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#C0292A] hover:text-[#8B1A1A] transition-colors"
              aria-label="Toggle highlight"
            >
              {expanded
                ? <ChevronDown size={16} className="rotate-180 transition-transform" />
                : <Play size={14} />
              }
              <span className="hidden sm:inline">Highlight</span>
            </button>
          )}
        </div>
      </div>

      {expanded && highlightUrl && (
        <div className="px-3 pb-3">
          <YoutubeEmbed url={highlightUrl} title={`${eastShikona} vs ${westShikona}`} />
        </div>
      )}
    </div>
  );
}
