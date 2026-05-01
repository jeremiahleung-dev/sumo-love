import Link from "next/link";
import RankBadge from "@/components/ui/RankBadge";
import RecordPill from "@/components/ui/RecordPill";
import { rankSortKey } from "@/lib/ranks";

interface LeaderEntry {
  rikishiId: string;
  shikonaEn: string;
  currentRank: string | null;
  wins: number;
  losses: number;
  absences: number;
  yusho: boolean;
}

export default function LeaderBoard({ entries, limit }: { entries: LeaderEntry[]; limit?: number }) {
  const sorted = [...entries].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (a.losses !== b.losses) return a.losses - b.losses;
    return rankSortKey(a.currentRank) - rankSortKey(b.currentRank);
  });

  return (
    <div className="overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#18181B] text-[#52525B] text-[11px] uppercase tracking-[0.1em]">
            <th className="px-5 py-3 text-left w-10 font-medium">#</th>
            <th className="px-5 py-3 text-left font-medium">Rikishi</th>
            <th className="px-5 py-3 text-left hidden sm:table-cell font-medium">Rank</th>
            <th className="px-5 py-3 text-right font-medium">Record</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#27272A]">
          {(limit != null ? sorted.slice(0, limit) : sorted).map((entry, i) => (
            <tr
              key={entry.rikishiId}
              className={`transition-colors duration-150 hover:bg-[#18181B] cursor-pointer ${
                i === 0 ? "bg-[#DC2626]/[0.04]" : ""
              }`}
            >
              <td className="px-5 py-3.5 text-[#3F3F46] font-mono text-xs font-medium">
                {i + 1}
              </td>
              <td className="px-5 py-3.5">
                <Link
                  href={`/rikishi/${entry.rikishiId}`}
                  className="font-semibold text-[#FAFAFA] hover:text-[#DC2626] transition-colors duration-150 flex items-center gap-2 cursor-pointer"
                >
                  {entry.shikonaEn}
                  {entry.yusho && (
                    <span className="text-[10px] bg-[#DC2626] text-white px-1.5 py-0.5 rounded font-medium">
                      優勝
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-5 py-3.5 hidden sm:table-cell">
                {entry.currentRank && <RankBadge rank={entry.currentRank} />}
              </td>
              <td className="px-5 py-3.5 text-right">
                <RecordPill
                  wins={entry.wins}
                  losses={entry.losses}
                  absences={entry.absences}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
