const RANK_STYLES: Record<string, string> = {
  Yokozuna:   "bg-[#C0292A] text-white",
  Ozeki:      "bg-[#8B1A1A] text-white",
  Sekiwake:   "bg-blue-400/0 text-blue-400 border border-blue-400/60",
  Komusubi:   "bg-emerald-400/0 text-emerald-400 border border-emerald-400/60",
  Maegashira: "bg-black text-white border border-white/10",
};

function getRankStyle(rank: string): string {
  const base = Object.keys(RANK_STYLES).find((r) => rank.startsWith(r));
  return base ? RANK_STYLES[base] : "bg-white/5 text-white/50";
}

// "Maegashira 4 West" → "M4W", "Sekiwake 1 East" → "Sekiwake", etc.
function formatRank(rank: string): string {
  const SANYAKU = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];
  const title = SANYAKU.find((r) => rank.startsWith(r));
  if (title) return title;

  // Maegashira: shorten to e.g. "M4W"
  const m = rank.match(/Maegashira\s+(\d+)\s+(East|West)/i);
  if (m) return `M${m[1]}${m[2][0].toUpperCase()}`;

  return rank;
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
      className={`inline-flex items-center font-mono font-semibold rounded-sm ${
        size === "sm" ? "text-[10px] px-1.5 py-0.5" : "text-xs px-2 py-1"
      } ${getRankStyle(rank)}`}
    >
      {formatRank(rank)}
    </span>
  );
}
