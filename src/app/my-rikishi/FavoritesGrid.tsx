"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import RankBadge from "@/components/ui/RankBadge";

// ── Types ──────────────────────────────────────────────────────────────────

interface RikishiRow {
  id: string;
  shikonaEn: string;
  shikona: string;
  currentRank: string | null;
  heyaEn: string;
  imageUrl: string | null;
  entry: { wins: number; losses: number; absences: number; yusho: boolean; rank: string } | null;
  streak: number;
  recentMatches: Array<{ day: number; won: boolean; opponentEn: string; kimariteEn: string | null }>;
}

interface DashboardData {
  basho: { id: string; nameEn: string; nameJp: string; location: string; isActive: boolean } | null;
  bashoLeaderWins: number | null;
  rikishi: RikishiRow[];
}

// ── Small helpers ──────────────────────────────────────────────────────────

function FormDots({ matches }: { matches: RikishiRow["recentMatches"] }) {
  if (matches.length === 0) return <span className="text-[#3F3F46] text-xs">—</span>;
  return (
    <div className="flex items-center gap-1">
      {matches.map((m, i) => (
        <span
          key={i}
          title={`Day ${m.day}: ${m.won ? "W" : "L"} vs ${m.opponentEn}`}
          className={`w-2 h-2 rounded-full ${m.won ? "bg-[#22C55E]" : "bg-[#DC2626]"}`}
        />
      ))}
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  const wins = streak > 0;
  const n = Math.abs(streak);
  if (n < 2) return null;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
        wins ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-[#DC2626]/15 text-[#DC2626]"
      }`}
    >
      {wins ? <TrendingUp size={9} /> : <TrendingDown size={9} />}
      {n}{wins ? "W" : "L"}
    </span>
  );
}

function GamesBack({ wins, leaderWins }: { wins: number; leaderWins: number }) {
  const back = leaderWins - wins;
  if (back === 0) return <span className="text-[10px] font-bold text-[#F59E0B]">Leader</span>;
  if (back <= 2) return <span className="text-[10px] text-[#52525B]">{back} back</span>;
  return null;
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-[#18181B] border border-[#27272A] flex items-center justify-center mb-6">
        <Heart size={24} className="text-[#3F3F46]" />
      </div>
      <p className="font-display text-2xl font-bold text-[#FAFAFA] mb-2">No favourites yet</p>
      <p className="text-[#52525B] text-sm mb-8 max-w-xs leading-relaxed">
        Tap the heart on any rikishi card or profile to follow them here.
      </p>
      <Link
        href="/rikishi"
        className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200"
      >
        Browse Rikishi
      </Link>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function Skeleton({ count }: { count: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-[#18181B] animate-pulse" />
      ))}
    </div>
  );
}

// ── Main dashboard ─────────────────────────────────────────────────────────

export default function FavoritesGrid() {
  const { favoriteIds, toggle, count } = useFavorites();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(() => {
    if (favoriteIds.length === 0) { setData(null); return; }
    setLoading(true);
    fetch(`/api/rikishi/favorites?ids=${favoriteIds.join(",")}`)
      .then((r) => r.json())
      .then((d: DashboardData) => {
        const byId = new Map(d.rikishi.map((r) => [r.id, r]));
        setData({ ...d, rikishi: favoriteIds.flatMap((id) => byId.has(id) ? [byId.get(id)!] : []) });
      })
      .finally(() => setLoading(false));
  }, [favoriteIds]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    window.addEventListener("focus", fetchData);
    return () => window.removeEventListener("focus", fetchData);
  }, [fetchData]);

  if (count === 0) return <EmptyState />;
  if (loading && !data) return <Skeleton count={favoriteIds.length} />;
  if (!data) return null;

  const { basho, bashoLeaderWins, rikishi } = data;

  const sorted = [...rikishi].sort((a, b) => {
    const aw = a.entry?.wins ?? -1, bw = b.entry?.wins ?? -1;
    if (bw !== aw) return bw - aw;
    return (a.entry?.losses ?? 99) - (b.entry?.losses ?? 99);
  });

  const contenders = bashoLeaderWins !== null
    ? sorted.filter((r) => r.entry && bashoLeaderWins - r.entry.wins <= 2)
    : [];

  const latestDay = Math.max(0, ...rikishi.flatMap((r) => r.recentMatches.map((m) => m.day)));
  const todayResults = latestDay > 0
    ? rikishi.flatMap((r) =>
        r.recentMatches
          .filter((m) => m.day === latestDay)
          .map((m) => ({ rikishi: r, match: m }))
      )
    : [];

  return (
    <div className="space-y-10">

      {/* Basho context bar */}
      {basho && (
        <div className="flex items-center gap-3 pb-4 border-b border-[#27272A]">
          {basho.isActive && (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-[#DC2626]/10 border border-[#DC2626]/25 text-[#DC2626] px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse-dot inline-block" />
              LIVE
            </span>
          )}
          <p className="text-[#71717A] text-sm">
            {basho.nameEn}
            <span className="text-[#3F3F46] mx-2">·</span>
            {basho.location}
          </p>
          <Link
            href={`/basho/${basho.id}`}
            className="ml-auto text-xs text-[#52525B] hover:text-[#DC2626] transition-colors font-medium"
          >
            Full results →
          </Link>
        </div>
      )}

      {/* ── Your picks leaderboard ─────────────────────────────────────── */}
      <section>
        <h2 className="text-[#52525B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-4">
          Your Picks · {sorted.length} rikishi
        </h2>
        <div className="rounded-xl border border-[#27272A] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#18181B] text-[#3F3F46] text-[10px] uppercase tracking-widest border-b border-[#27272A]">
                <th className="px-4 py-3 text-left w-8">#</th>
                <th className="px-4 py-3 text-left">Rikishi</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Rank</th>
                <th className="px-4 py-3 text-center">Record</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Form</th>
                <th className="px-4 py-3 text-right w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27272A]">
              {sorted.map((r, i) => (
                <tr key={r.id} className="hover:bg-[#18181B] transition-colors group/row">
                  <td className="px-4 py-3.5 text-[#3F3F46] font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5">
                    <Link href={`/rikishi/${r.id}`} className="flex items-center gap-3 hover:text-[#DC2626] transition-colors">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-[#18181B] border border-[#27272A] flex-shrink-0">
                        {r.imageUrl ? (
                          <Image src={r.imageUrl} alt={r.shikonaEn} fill className="object-cover object-top" sizes="36px" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-[#3F3F46] font-display font-black text-xs">力</span>
                        )}
                      </div>
                      <div>
                        <p className="font-display font-bold leading-tight text-[#FAFAFA]">{r.shikonaEn}</p>
                        <p className="text-[#52525B] text-xs">{r.shikona}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3.5 hidden sm:table-cell">
                    {r.currentRank && <RankBadge rank={r.currentRank} />}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    {r.entry ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-sm font-bold text-[#FAFAFA]">
                          {r.entry.wins}–{r.entry.losses}
                          {r.entry.absences > 0 && (
                            <span className="text-[#52525B]">–{r.entry.absences}</span>
                          )}
                        </span>
                        <StreakBadge streak={r.streak} />
                      </div>
                    ) : (
                      <span className="text-[#3F3F46]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex justify-center">
                      <FormDots matches={r.recentMatches} />
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => toggle(r.id)}
                      className="p-1.5 rounded-md text-[#DC2626] hover:bg-[#DC2626]/10 transition-all duration-200 opacity-60 group-hover/row:opacity-100"
                      aria-label="Unfollow"
                    >
                      <Heart size={13} className="fill-current" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Contention + Recent results ────────────────────────────────── */}
      {basho && (contenders.length > 0 || todayResults.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Yusho contention */}
          {contenders.length > 0 && bashoLeaderWins !== null && (
            <section>
              <h2 className="text-[#52525B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                Yusho Contention
              </h2>
              <div className="rounded-xl border border-[#27272A] divide-y divide-[#27272A] overflow-hidden">
                {contenders.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#18181B] transition-colors">
                    <div className="flex items-center gap-2">
                      {r.entry?.wins === bashoLeaderWins && (
                        <Trophy size={13} className="text-[#F59E0B]" />
                      )}
                      <Link href={`/rikishi/${r.id}`} className="font-display font-bold text-sm text-[#FAFAFA] hover:text-[#DC2626] transition-colors">
                        {r.shikonaEn}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#FAFAFA]">{r.entry!.wins}W</span>
                      <GamesBack wins={r.entry!.wins} leaderWins={bashoLeaderWins} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Day results */}
          {todayResults.length > 0 && (
            <section>
              <h2 className="text-[#52525B] text-[11px] font-semibold tracking-[0.2em] uppercase mb-3">
                Day {latestDay} Results
              </h2>
              <div className="rounded-xl border border-[#27272A] divide-y divide-[#27272A] overflow-hidden">
                {todayResults.slice(0, 3).map(({ rikishi: r, match: m }, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 gap-3 hover:bg-[#18181B] transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${m.won ? "bg-[#22C55E]" : "bg-[#DC2626]"}`} />
                      <div className="min-w-0">
                        <Link href={`/rikishi/${r.id}`} className="font-display font-bold text-sm text-[#FAFAFA] hover:text-[#DC2626] transition-colors block truncate">
                          {r.shikonaEn}
                        </Link>
                        <p className="text-xs text-[#52525B] truncate">vs {m.opponentEn}</p>
                      </div>
                    </div>
                    {m.kimariteEn && (
                      <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded bg-[#18181B] text-[#71717A] border border-[#3F3F46]">
                        {m.kimariteEn}
                      </span>
                    )}
                  </div>
                ))}
                {todayResults.length > 3 && (
                  <Link
                    href={`/basho/${basho!.id}`}
                    className="flex items-center justify-center px-4 py-2.5 text-xs text-[#52525B] hover:text-[#DC2626] hover:bg-[#18181B] transition-colors"
                  >
                    See all Day {latestDay} results →
                  </Link>
                )}
              </div>
              {todayResults.length <= 3 && (
                <Link
                  href={`/basho/${basho!.id}`}
                  className="mt-2 block text-xs text-[#3F3F46] hover:text-[#DC2626] transition-colors"
                >
                  Full basho results →
                </Link>
              )}
            </section>
          )}
        </div>
      )}

      {/* ── No basho data note ──────────────────────────────────────────── */}
      {!basho && (
        <p className="text-[#3F3F46] text-sm text-center py-4">
          No basho data yet —{" "}
          <Link href="/rikishi" className="text-[#71717A] hover:text-[#FAFAFA] transition-colors">
            browse rikishi
          </Link>{" "}
          to follow someone.
        </p>
      )}
    </div>
  );
}
