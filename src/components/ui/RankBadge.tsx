const RANK_STYLES: Record<string, string> = {
  Yokozuna:   "bg-[#C0292A] text-white",
  Ozeki:      "bg-[#8B1A1A] text-white",
  Sekiwake:   "bg-blue-500 text-white",
  Komusubi:   "bg-emerald-500 text-white",
  Maegashira: "bg-black text-white border border-white/10",
};

function getRankStyle(rank: string): string {
  const base = Object.keys(RANK_STYLES).find((r) => rank.startsWith(r));
  return base ? RANK_STYLES[base] : "bg-white/5 text-white/50";
}

// "Sekiwake 1 East" → "Sekiwake", "Maegashira 4 West" → "M4W"
function formatRank(rank: string): string {
  const SANYAKU = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];
  const title = SANYAKU.find((r) => rank.startsWith(r));
  if (title) return title;

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
