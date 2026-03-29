const RANK_STYLES: Record<string, string> = {
  Yokozuna:   "bg-[#C0292A] text-white",
  Ozeki:      "bg-[#8B1A1A] text-white",
  Sekiwake:   "bg-[#D4A97A] text-[#1A1A1A]",
  Komusubi:   "bg-[#EDE0CC] text-[#1A1A1A] border border-[#D4A97A]",
  Maegashira: "bg-[#1A1A1A] text-[#FAF7F2]",
};

function getRankStyle(rank: string): string {
  const base = Object.keys(RANK_STYLES).find((r) => rank.startsWith(r));
  return base ? RANK_STYLES[base] : "bg-gray-400 text-white";
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
