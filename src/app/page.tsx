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
    <div>
      <section className="relative bg-[#1A1A1A] text-[#FAF7F2] overflow-hidden texture-washi">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] -translate-y-1/4 translate-x-1/4 opacity-10">
          <div className="w-full h-full rounded-full border-[24px] border-[#D4A97A]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            {latestBasho?.isActive && (
              <span className="inline-flex items-center gap-1.5 bg-[#C0292A] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 animate-pulse">
                <Zap size={12} />
                LIVE — {latestBasho.nameEn}
              </span>
            )}
            <h1 className="font-display font-black text-5xl md:text-7xl leading-none mb-2 text-[#C0292A]">
              相撲
            </h1>
            <h2 className="font-display font-bold text-4xl md:text-5xl leading-tight mb-4">
              Sumo Love
            </h2>
            <p className="text-[#EDE0CC] text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
              Follow every rikishi through each basho. Live standings, bout
              results, and the techniques behind every win.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/rikishi"
                className="bg-[#C0292A] text-white px-6 py-3 rounded font-semibold hover:bg-[#8B1A1A] transition-colors flex items-center gap-2"
              >
                All Rikishi <ChevronRight size={16} />
              </Link>
              <Link
                href="/basho"
                className="border border-[#EDE0CC]/40 text-[#FAF7F2] px-6 py-3 rounded font-semibold hover:bg-white/10 transition-colors"
              >
                Basho Archive
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* ── Live Standings ───────────────────────────────────────── */}
        {latestBasho && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-bold text-2xl">
                  {latestBasho.isActive ? "Live Standings" : "Final Standings"}
                </h2>
                <p className="text-[#D4A97A] text-sm mt-0.5">
                  {latestBasho.nameEn} · {latestBasho.location}
                </p>
              </div>
              <Link
                href={`/basho/${latestBasho.id}`}
                className="text-sm text-[#C0292A] font-medium hover:underline flex items-center gap-1"
              >
                Full results <ChevronRight size={14} />
              </Link>
            </div>
            {leaderEntries.length > 0 ? (
              <LeaderBoard entries={leaderEntries} />
            ) : (
              <div className="rounded-lg border border-dashed border-[#EDE0CC] p-12 text-center text-[#1A1A1A]/40">
                <p className="font-display text-xl mb-2">No basho data yet</p>
                <p className="text-sm">POST to /api/sync to pull live standings</p>
              </div>
            )}
          </section>
        )}

        {/* ── Featured Rikishi ─────────────────────────────────────── */}
        {featured.length > 0 && (
          <section className="py-8 border-t border-[#EDE0CC]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-2xl">Top Rank</h2>
              <Link
                href="/rikishi"
                className="text-sm text-[#C0292A] font-medium hover:underline flex items-center gap-1"
              >
                All rikishi <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {featured.map((r) => (
                <Link
                  key={r.id}
                  href={`/rikishi/${r.id}`}
                  className="group bg-[#FAF7F2] border border-[#EDE0CC] rounded-lg overflow-hidden hover:border-[#C0292A] hover:shadow-lg transition-all"
                >
                  <div className="relative aspect-[3/4] bg-[#EDE0CC]">
                    {r.imageUrl ? (
                      <Image
                        src={r.imageUrl}
                        alt={r.shikonaEn}
                        fill
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        sizes="25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl text-[#D4A97A] font-display font-black select-none">
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
                    <p className="font-display font-bold text-sm">{r.shikonaEn}</p>
                    <p className="text-xs text-[#1A1A1A]/40">{r.shikona}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Recent Highlights ────────────────────────────────────── */}
        {recentHighlights.length > 0 && (
          <section className="py-8 border-t border-[#EDE0CC]">
            <h2 className="font-display font-bold text-2xl mb-6">
              Recent Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {recentHighlights.map((m) => (
                <div key={m.id} className="flex flex-col gap-2">
                  <YoutubeEmbed
                    url={m.highlightUrl!}
                    title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                  />
                  <p className="text-xs text-[#1A1A1A]/60 text-center">
                    <span className="font-semibold">{m.eastRikishi.shikonaEn}</span>
                    {" vs "}
                    <span className="font-semibold">{m.westRikishi.shikonaEn}</span>
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
          <section className="py-20 text-center">
            <p className="font-display text-2xl text-[#D4A97A] mb-2">
              No data loaded yet
            </p>
            <p className="text-[#1A1A1A]/50 text-sm mb-6">
              POST to /api/sync to pull live data from sumo-api.com
            </p>
            <Link
              href="/kimarite"
              className="bg-[#C0292A] text-white px-6 py-3 rounded font-semibold hover:bg-[#8B1A1A] transition-colors"
            >
              Browse Kimarite Techniques
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
