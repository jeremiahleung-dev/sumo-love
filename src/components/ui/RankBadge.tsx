const RANK_STYLES: Record<string, string> = {
  Yokozuna:   "bg-[#DC2626] text-white",
  Ozeki:      "bg-[#991B1B] text-white",
  Sekiwake:   "bg-[#27272A] text-[#FCA5A5] border border-[#DC2626]/30",
  Komusubi:   "bg-[#27272A] text-[#A1A1AA] border border-[#3F3F46]",
  Maegashira: "bg-[#18181B] text-[#71717A] border border-[#27272A]",
};

// Yokozuna/Ozeki/Sekiwake/Komusubi: strip number, keep direction
// "Yokozuna 1 East" → "Yokozuna East"   "Komusubi 1 West" → "Komusubi West"
// Maegashira keeps the number: "Maegashira 7 East" stays
const NUMBERLESS = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];

function formatRank(rank: string): string {
  for (const r of NUMBERLESS) {
    if (rank.startsWith(r)) {
      const direction = rank.includes("East") ? " East" : rank.includes("West") ? " West" : "";
      return r + direction;
    }
  }
  return rank;
}

function getRankStyle(rank: string): string {
  const base = Object.keys(RANK_STYLES).find((r) => rank.startsWith(r));
  return base ? RANK_STYLES[base] : "bg-[#18181B] text-[#71717A]";
}

export default function RankBadge({
  rank,
  size = "sm",
}: {
  rank: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center font-mono font-semibold rounded ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
      } ${getRankStyle(rank)}`}
    >
      {formatRank(rank)}
    </span>
  );
}
