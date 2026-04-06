"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Trophy, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
  if (matches.length === 0) return <span className="text-white/20 text-xs">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {matches.map((m, i) => (
        <span
          key={i}
          title={`Day ${m.day}: ${m.won ? "W" : "L"} vs ${m.opponentEn}`}
          className={`w-2.5 h-2.5 rounded-full ${m.won ? "bg-[#2D6A4F]" : "bg-[#C0292A]"}`}
        />
      ))}
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  if (streak === 0) return null;
  const wins = streak > 0;
  const n = Math.abs(streak);
  if (n < 2) return null; // only show for ≥2 streak
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
        wins ? "bg-[#2D6A4F]/20 text-[#2D6A4F]" : "bg-[#C0292A]/15 text-[#C0292A]"
      }`}
    >
      {wins ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
      {n}W{wins ? "" : " L"}
    </span>
  );
}

function GamesBack({ wins, leaderWins }: { wins: number; leaderWins: number }) {
  const back = leaderWins - wins;
  if (back === 0) return <span className="text-[10px] font-bold text-[#D4A97A]">Leader</span>;
  if (back <= 2) return <span className="text-[10px] text-white/40">{back} back</span>;
  return null;
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      <Heart size={48} className="text-white/10 mb-6" />
      <p className="font-display text-2xl font-bold mb-2">No favourites yet</p>
      <p className="text-white/40 text-sm mb-8 max-w-xs">
        Tap the heart on any rikishi card or profile to follow them here.
      </p>
      <Link
        href="/rikishi"
        className="bg-[#C0292A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8B1A1A] transition-colors"
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
        <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
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
        // Preserve follow order; prune stale IDs
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

  // Sort by wins desc, losses asc for the leaderboard
  const sorted = [...rikishi].sort((a, b) => {
    const aw = a.entry?.wins ?? -1, bw = b.entry?.wins ?? -1;
    if (bw !== aw) return bw - aw;
    return (a.entry?.losses ?? 99) - (b.entry?.losses ?? 99);
  });

  // Rikishi in contention (within 2 wins of leader)
  const contenders = bashoLeaderWins !== null
    ? sorted.filter((r) => r.entry && bashoLeaderWins - r.entry.wins <= 2)
    : [];

  // Most recent day with completed bouts
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
      {/* Basho header */}
      {basho && (
        <div className="flex items-center gap-3">
          {basho.isActive && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#C0292A] text-white px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          )}
          <p className="text-[#D4A97A] text-sm font-medium">
            {basho.nameEn} · {basho.location}
          </p>
        </div>
      )}

      {/* ── Your picks leaderboard ─────────────────────────────────────── */}
      <section>
        <h2 className="font-display font-bold text-lg mb-3 text-white/70 uppercase tracking-widest text-xs">
          Your Picks
        </h2>
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/5 text-white/30 text-[10px] uppercase tracking-widest">
                <th className="px-4 py-2.5 text-left w-6">#</th>
                <th className="px-4 py-2.5 text-left">Rikishi</th>
                <th className="px-4 py-2.5 text-left hidden sm:table-cell">Rank</th>
                <th className="px-4 py-2.5 text-center">Record</th>
                <th className="px-4 py-2.5 text-center hidden sm:table-cell">Form</th>
                <th className="px-4 py-2.5 text-right w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sorted.map((r, i) => (
                <tr key={r.id} className="hover:bg-white/5 transition-colors group/row">
                  <td className="px-4 py-3 text-white/30 font-mono text-xs">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link href={`/rikishi/${r.id}`} className="flex items-center gap-3 hover:text-[#C0292A] transition-colors">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden bg-white/5 flex-shrink-0">
                        {r.imageUrl ? (
                          <Image src={r.imageUrl} alt={r.shikonaEn} fill className="object-cover object-top" sizes="36px" />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center text-white/20 font-display font-black text-xs">力</span>
                        )}
                      </div>
                      <div>
                        <p className="font-display font-bold leading-tight text-white">{r.shikonaEn}</p>
                        <p className="text-white/30 text-xs">{r.shikona}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    {r.currentRank && <RankBadge rank={r.currentRank} />}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.entry ? (
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-mono text-sm font-bold text-white">
                          {r.entry.wins}–{r.entry.losses}
                          {r.entry.absences > 0 && <span className="text-white/30">–{r.entry.absences}</span>}
                        </span>
                        <StreakBadge streak={r.streak} />
                      </div>
                    ) : (
                      <span className="text-white/20">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex justify-center">
                      <FormDots matches={r.recentMatches} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => toggle(r.id)}
                      className="opacity-0 group-hover/row:opacity-100 sm:opacity-100 transition-opacity p-1 rounded text-white/20 hover:text-[#C0292A]"
                      aria-label="Unfollow"
                    >
                      <Heart size={13} className="fill-current text-[#C0292A]" />
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
              <h2 className="font-display font-bold text-xs uppercase tracking-widest text-white/30 mb-3">
                Yusho Contention
              </h2>
              <div className="rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                {contenders.map((r) => (
                  <div key={r.id} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      {r.entry?.wins === bashoLeaderWins && (
                        <Trophy size={13} className="text-[#D4A97A]" />
                      )}
                      <Link href={`/rikishi/${r.id}`} className="font-display font-bold text-sm hover:text-[#C0292A] transition-colors">
                        {r.shikonaEn}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-white">{r.entry!.wins}W</span>
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
              <h2 className="font-display font-bold text-xs uppercase tracking-widest text-white/30 mb-3">
                Day {latestDay} Results
              </h2>
              <div className="rounded-xl border border-white/5 divide-y divide-white/5 overflow-hidden">
                {todayResults.slice(0, 3).map(({ rikishi: r, match: m }, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.won ? "bg-[#2D6A4F]" : "bg-[#C0292A]"}`} />
                      <div className="min-w-0">
                        <Link href={`/rikishi/${r.id}`} className="font-display font-bold text-sm hover:text-[#C0292A] transition-colors block truncate">
                          {r.shikonaEn}
                        </Link>
                        <p className="text-xs text-white/30 truncate">vs {m.opponentEn}</p>
                      </div>
                    </div>
                    {m.kimariteEn && (
                      <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-white/40 border border-white/10">
                        {m.kimariteEn}
                      </span>
                    )}
                  </div>
                ))}
                {todayResults.length > 3 && (
                  <Link
                    href={`/basho/${basho!.id}`}
                    className="flex items-center justify-center px-4 py-2.5 text-xs text-[#D4A97A] hover:text-white hover:bg-white/5 transition-colors"
                  >
                    See all Day {latestDay} results →
                  </Link>
                )}
              </div>
              {todayResults.length <= 3 && (
                <Link href={`/basho/${basho!.id}`} className="mt-2 block text-xs text-white/20 hover:text-[#D4A97A] transition-colors">
                  Full basho results →
                </Link>
              )}
            </section>
          )}
        </div>
      )}

      {/* ── No basho data note ──────────────────────────────────────────── */}
      {!basho && (
        <p className="text-white/30 text-sm text-center py-4">
          No basho data yet — <Link href="/rikishi" className="text-[#D4A97A] hover:underline">browse rikishi</Link> to follow someone.
        </p>
      )}
    </div>
  );
}
