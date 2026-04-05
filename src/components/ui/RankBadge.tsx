const RANK_STYLES: Record<string, string> = {
  Yokozuna:   "bg-[#C0292A] text-white",
  Ozeki:      "bg-[#8B1A1A] text-white",
  Sekiwake:   "bg-[#D4A97A]/20 text-[#D4A97A] border border-[#D4A97A]/30",
  Komusubi:   "bg-white/5 text-white/60 border border-white/10",
  Maegashira: "bg-white/5 text-white/50 border border-white/5",
};

function getRankStyle(rank: string): string {
  const base = Object.keys(RANK_STYLES).find((r) => rank.startsWith(r));
  return base ? RANK_STYLES[base] : "bg-white/5 text-white/50";
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
      {rank}
    </span>
  );
}
