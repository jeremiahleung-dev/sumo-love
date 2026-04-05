import Link from "next/link";
import RankBadge from "@/components/ui/RankBadge";
import RecordPill from "@/components/ui/RecordPill";

interface LeaderEntry {
  rikishiId: string;
  shikonaEn: string;
  currentRank: string | null;
  wins: number;
  losses: number;
  absences: number;
  yusho: boolean;
}

export default function LeaderBoard({ entries }: { entries: LeaderEntry[] }) {
  const sorted = [...entries].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.losses - b.losses;
  });

  return (
    <div className="overflow-hidden rounded-xl border border-white/5 bg-[#141414]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#0A0A0A] text-white/30 text-xs uppercase tracking-wider border-b border-white/5">
            <th className="px-4 py-3 text-left w-8">#</th>
            <th className="px-4 py-3 text-left">Rikishi</th>
            <th className="px-4 py-3 text-left hidden sm:table-cell">Rank</th>
            <th className="px-4 py-3 text-right">Record</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {sorted.slice(0, 15).map((entry, i) => (
            <tr
              key={entry.rikishiId}
              className={`transition-colors hover:bg-white/3 ${
                i === 0 ? "bg-[#C0292A]/5" : ""
              }`}
            >
              <td className="px-4 py-3 text-[#D4A97A] font-mono font-bold text-xs">
                {i + 1}
              </td>
              <td className="px-4 py-3">
                <Link
                  href={`/rikishi/${entry.rikishiId}`}
                  className="font-display font-semibold text-white hover:text-[#C0292A] transition-colors flex items-center gap-2"
                >
                  {entry.shikonaEn}
                  {entry.yusho && (
                    <span className="text-[10px] bg-[#C0292A] text-white px-1.5 py-0.5 rounded font-sans">
                      優勝
                    </span>
                  )}
                </Link>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell">
                {entry.currentRank && <RankBadge rank={entry.currentRank} />}
              </td>
              <td className="px-4 py-3 text-right">
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
