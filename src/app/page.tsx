import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import LeaderBoard from "@/components/basho/LeaderBoard";
import RankBadge from "@/components/ui/RankBadge";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";
import { ChevronRight, Zap } from "lucide-react";

export const revalidate = 1800;

const BASHO_WITH_ENTRIES = {
  include: {
    entries: {
      include: { rikishi: true },
      orderBy: { wins: "desc" } as const,
      take: 15,
    },
  },
} as const;

async function getHomeData() {
  const [activeBasho, latestBashoFallback, featured, recentHighlights] =
    await Promise.all([
      db.basho.findFirst({ where: { isActive: true }, ...BASHO_WITH_ENTRIES }),
      db.basho.findFirst({ orderBy: { sumoApiId: "desc" }, ...BASHO_WITH_ENTRIES }),
      db.rikishi.findMany({
        where: {
          OR: [
            { currentRank: { startsWith: "Yokozuna" } },
            { currentRank: { startsWith: "Ozeki" } },
          ],
        },
        take: 4,
        include: {
          bashoEntries: {
            orderBy: { basho: { sumoApiId: "desc" } },
            take: 1,
          },
        },
      }),
      db.match.findMany({
        where: { highlightUrl: { not: null } },
        orderBy: [{ basho: { sumoApiId: "desc" } }, { day: "desc" }],
        take: 3,
        include: { eastRikishi: true, westRikishi: true, basho: true },
      }),
    ]);

  const latestBasho = activeBasho ?? latestBashoFallback;
  return { latestBasho, featured, recentHighlights };
}

export default async function HomePage() {
  const { latestBasho, featured, recentHighlights } = await getHomeData();

  const leaderEntries = latestBasho?.entries.map((e) => ({
    rikishiId: e.rikishiId,
    shikonaEn: e.rikishi.shikonaEn,
    currentRank: e.rikishi.currentRank,
    wins: e.wins,
    losses: e.losses,
    absences: e.absences,
    yusho: e.yusho,
  })) ?? [];

  return (
    <div className="bg-[#0A0A0A]">

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Full-coverage gradient mesh — the Lovable technique */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 20% 40%, #C0292A55 0%, transparent 60%),
              radial-gradient(ellipse 60% 50% at 80% 20%, #8B1A1A44 0%, transparent 60%),
              radial-gradient(ellipse 70% 60% at 60% 80%, #D4A97A33 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 10% 80%, #C0292A22 0%, transparent 50%),
              #0A0A0A
            `
          }}
        />

        {/* Noise grain overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none mix-blend-overlay"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
        />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {latestBasho?.isActive && (
            <div className="inline-flex items-center gap-2 bg-[#C0292A]/10 border border-[#C0292A]/30 text-[#C0292A] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <Zap size={11} className="animate-pulse" />
              LIVE — {latestBasho.nameEn}
            </div>
          )}

          <h1 className="font-display font-black text-8xl md:text-[11rem] leading-none text-[#C0292A] mb-2 select-none">
            相撲
          </h1>
          <h2 className="font-display font-bold text-4xl md:text-6xl text-white leading-tight mb-5">
            Sumo Love
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-xl mx-auto leading-relaxed mb-10">
            Follow every rikishi through each basho. Live standings, bout
            results, and the techniques behind every win.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/rikishi"
              className="bg-[#C0292A] hover:bg-[#A01F20] text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#C0292A]/25"
            >
              All Rikishi <ChevronRight size={16} />
            </Link>
            <Link
              href="/basho"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-7 py-3 rounded-lg font-semibold transition-all duration-200 backdrop-blur-sm"
            >
              Basho Archive
            </Link>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Live Standings ───────────────────────────────────────── */}
        {latestBasho && (
          <section className="py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display font-bold text-2xl text-white">
                  {latestBasho.isActive ? "Live Standings" : "Final Standings"}
                </h2>
                <p className="text-[#D4A97A] text-sm mt-1">
                  {latestBasho.nameEn} · {latestBasho.location}
                </p>
              </div>
              <Link
                href={`/basho/${latestBasho.id}`}
                className="text-sm text-white/40 hover:text-[#C0292A] font-medium transition-colors flex items-center gap-1"
              >
                Full results <ChevronRight size={14} />
              </Link>
            </div>
            {leaderEntries.length > 0 ? (
              <LeaderBoard entries={leaderEntries} />
            ) : (
              <div className="rounded-xl border border-dashed border-white/10 p-16 text-center">
                <p className="font-display text-xl text-white/30 mb-2">No basho data yet</p>
                <p className="text-sm text-white/20">POST to /api/sync to pull live standings</p>
              </div>
            )}
          </section>
        )}

        {/* ── Featured Rikishi ─────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="py-10 border-t border-white/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display font-bold text-2xl text-white">Top Rank</h2>
              <Link
                href="/rikishi"
                className="text-sm text-white/40 hover:text-[#C0292A] font-medium transition-colors flex items-center gap-1"
              >
                All rikishi <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featured.map((r) => (
                <Link
                  key={r.id}
                  href={`/rikishi/${r.id}`}
                  className="group bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-[#C0292A]/50 hover:shadow-xl hover:shadow-[#C0292A]/5 transition-all duration-300"
                >
                  <div className="relative aspect-[3/4] bg-[#1A1A1A]">
                    {r.imageUrl ? (
                      <Image
                        src={r.imageUrl}
                        alt={r.shikonaEn}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl text-[#D4A97A]/40 font-display font-black select-none">
                          力
                        </span>
                      </div>
                    )}
                    {r.currentRank && (
                      <div className="absolute top-2 left-2">
                        <RankBadge rank={r.currentRank} />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-display font-bold text-sm text-white">{r.shikonaEn}</p>
                    <p className="text-xs text-white/30">{r.shikona}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Recent Highlights ────────────────────────────────────── */}
        {recentHighlights.length > 0 && (
          <section className="py-10 border-t border-white/5">
            <h2 className="font-display font-bold text-2xl text-white mb-8">
              Recent Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentHighlights.map((m) => (
                <div key={m.id} className="flex flex-col gap-3">
                  <div className="rounded-xl overflow-hidden">
                    <YoutubeEmbed
                      url={m.highlightUrl!}
                      title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                    />
                  </div>
                  <p className="text-xs text-white/40 text-center">
                    <span className="font-semibold text-white/60">{m.eastRikishi.shikonaEn}</span>
                    {" vs "}
                    <span className="font-semibold text-white/60">{m.westRikishi.shikonaEn}</span>
                    {" · "}
                    {m.basho.nameEn} Day {m.day}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── No data state ────────────────────────────────────────── */}
        {!latestBasho && (
          <section className="py-24 text-center">
            <p className="font-display text-2xl text-white/20 mb-2">No data loaded yet</p>
            <p className="text-white/20 text-sm mb-8">POST to /api/sync to pull live data</p>
            <Link
              href="/kimarite"
              className="bg-[#C0292A] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#A01F20] transition-colors"
            >
              Browse Kimarite Techniques
            </Link>
          </section>
        )}
      </div>

      <div className="h-20" />
    </div>
  );
}
