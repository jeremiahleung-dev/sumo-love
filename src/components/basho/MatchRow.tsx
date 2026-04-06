"use client";

import { useState } from "react";
import Link from "next/link";
import { Play, ChevronDown } from "lucide-react";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";

interface Props {
  eastId: string;
  eastShikona: string;
  westId: string;
  westShikona: string;
  winnerId: string | null;
  kimariteEn: string | null;
  kimariteId: string | null;
  highlightUrl: string | null;
}

export default function MatchRow({
  eastId,
  eastShikona,
  westId,
  westShikona,
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
      <div className="flex items-center p-3 gap-3">
        <Link
          href={`/rikishi/${eastId}`}
          className={`flex-1 font-display font-semibold text-right hover:text-[#C0292A] transition-colors ${
            eastWon ? "text-white" : "text-white/35"
          }`}
        >
          {eastShikona}
          {eastWon && (
            <span className="ml-1 text-[10px] text-[#52B788] font-mono align-middle">
              ●
            </span>
          )}
        </Link>

        <div className="flex flex-col items-center min-w-[80px]">
          <span className="text-[10px] text-[#D4A97A] font-bold uppercase tracking-widest">
            vs
          </span>
          {kimariteEn && (
            <Link
              href={kimariteId ? `/kimarite/${kimariteId}` : "#"}
              className="text-[10px] bg-white/10 text-white/60 px-2 py-0.5 rounded mt-0.5 hover:bg-[#D4A97A] hover:text-white transition-colors text-center"
            >
              {kimariteEn}
            </Link>
          )}
        </div>

        <Link
          href={`/rikishi/${westId}`}
          className={`flex-1 font-display font-semibold hover:text-[#C0292A] transition-colors ${
            westWon ? "text-white" : "text-white/35"
          }`}
        >
          {westWon && (
            <span className="mr-1 text-[10px] text-[#52B788] font-mono align-middle">
              ●
            </span>
          )}
          {westShikona}
        </Link>

        {highlightUrl && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="ml-2 flex items-center gap-1 text-xs text-[#C0292A] hover:text-[#8B1A1A] transition-colors font-medium"
            aria-label="Toggle highlight"
          >
            {expanded ? (
              <ChevronDown size={16} className="rotate-180 transition-transform" />
            ) : (
              <Play size={14} />
            )}
            <span className="hidden sm:inline">Highlight</span>
          </button>
        )}
      </div>

      {expanded && highlightUrl && (
        <div className="px-3 pb-3">
          <YoutubeEmbed url={highlightUrl} title={`${eastShikona} vs ${westShikona}`} />
        </div>
      )}
    </div>
  );
}
