import Link from "next/link";
import { db } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import RikishiFilmstrip from "@/components/home/RikishiFilmstrip";
import LeaderBoard from "@/components/basho/LeaderBoard";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";
import { ChevronRight } from "lucide-react";

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
        take: 8,
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

  const leaderEntries =
    latestBasho?.entries.map((e) => ({
      rikishiId: e.rikishiId,
      shikonaEn: e.rikishi.shikonaEn,
      currentRank: e.rikishi.currentRank,
      wins: e.wins,
      losses: e.losses,
      absences: e.absences,
      yusho: e.yusho,
    })) ?? [];

  const filmstripRikishi = featured.map((r) => ({
    id: r.id,
    shikonaEn: r.shikonaEn,
    shikona: r.shikona,
    currentRank: r.currentRank,
    heya: r.heya,
    imageUrl: r.imageUrl,
  }));

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection
        isActive={latestBasho?.isActive ?? false}
        bashoName={latestBasho?.nameEn}
      />

      {/* ── Basho ticker bar ─────────────────────────────────────── */}
      {latestBasho && (
        <div className="bg-[#C0292A] text-white">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-bold tracking-wide">{latestBasho.nameEn}</span>
              <span className="text-white/60 hidden sm:inline">·</span>
              <span className="text-white/80 hidden sm:inline">
                {latestBasho.location}
              </span>
              <span className="text-white/60 hidden sm:inline">·</span>
              <span className="text-white/80 hidden sm:inline">
                {leaderEntries.length} Rikishi
              </span>
            </div>
            <Link
              href={`/basho/${latestBasho.id}`}
              className="flex items-center gap-1 text-white/80 hover:text-white font-medium text-xs tracking-[0.15em] uppercase transition-colors"
            >
              View Full Results <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Standings ────────────────────────────────────────────── */}
      {latestBasho && (
        <section className="bg-[#0F0F0F] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-[#C0292A] text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
                  {latestBasho.isActive ? "Current Standings" : "Final Standings"}
                </p>
                <h2 className="font-display font-bold text-[#FAF7F2] text-3xl md:text-4xl leading-tight">
                  {latestBasho.nameEn}
                </h2>
                <p className="text-[#D4A97A] text-sm mt-1">{latestBasho.location}</p>
              </div>
              <Link
                href={`/basho/${latestBasho.id}`}
                className="flex-none text-xs text-[#C0292A] font-bold tracking-[0.15em] uppercase hover:text-[#E03030] flex items-center gap-1 transition-colors"
              >
                Full Results <ChevronRight size={13} />
              </Link>
            </div>

            {leaderEntries.length > 0 ? (
              <div className="border border-[#C0292A]/15">
                <LeaderBoard entries={leaderEntries} />
              </div>
            ) : (
              <div className="border border-dashed border-[#FAF7F2]/10 p-16 text-center">
                <p className="font-display text-xl text-[#FAF7F2]/30 mb-2">
                  No basho data yet
                </p>
                <p className="text-sm text-[#FAF7F2]/20">
                  POST to /api/sync to pull live standings
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Top Rank Filmstrip ───────────────────────────────────── */}
      {filmstripRikishi.length > 0 && (
        <section className="bg-[#FAF7F2] py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-[#C0292A] text-[11px] font-bold tracking-[0.3em] uppercase mb-2">
                  横綱 · 大関
                </p>
                <h2 className="font-display font-bold text-[#1A1A1A] text-3xl md:text-4xl">
                  Top Rank
                </h2>
              </div>
              <Link
                href="/rikishi"
                className="flex-none text-xs text-[#C0292A] font-bold tracking-[0.15em] uppercase hover:text-[#E03030] flex items-center gap-1 transition-colors"
              >
                All Rikishi <ChevronRight size={13} />
              </Link>
            </div>
            <RikishiFilmstrip rikishi={filmstripRikishi} />
          </div>
        </section>
      )}

      {/* ── Recent Highlights ────────────────────────────────────── */}
      {recentHighlights.length > 0 && (
        <section className="bg-[#1A1A1A]">
          <div className="border-b border-[#C0292A]/30">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4">
              <p className="text-[#FAF7F2] text-[11px] font-bold tracking-[0.35em] uppercase">
                Recent Highlights
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 md:py-16">
            {recentHighlights.length >= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Primary — spans 2 columns */}
                <div className="md:col-span-2 flex flex-col gap-3">
                  <YoutubeEmbed
                    url={recentHighlights[0].highlightUrl!}
                    title={`${recentHighlights[0].eastRikishi.shikonaEn} vs ${recentHighlights[0].westRikishi.shikonaEn}`}
                  />
                  <p className="font-mono text-[11px] text-[#FAF7F2]/40 uppercase tracking-widest">
                    <span className="text-[#FAF7F2]/70">
                      {recentHighlights[0].eastRikishi.shikonaEn}
                    </span>
                    {" vs "}
                    <span className="text-[#FAF7F2]/70">
                      {recentHighlights[0].westRikishi.shikonaEn}
                    </span>
                    {" · "}
                    {recentHighlights[0].basho.nameEn} Day{" "}
                    {recentHighlights[0].day}
                  </p>
                </div>

                {/* Secondary — stacked */}
                <div className="flex flex-col gap-4">
                  {recentHighlights.slice(1).map((m) => (
                    <div key={m.id} className="flex flex-col gap-2">
                      <YoutubeEmbed
                        url={m.highlightUrl!}
                        title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                      />
                      <p className="font-mono text-[11px] text-[#FAF7F2]/40 uppercase tracking-widest">
                        <span className="text-[#FAF7F2]/70">
                          {m.eastRikishi.shikonaEn}
                        </span>
                        {" vs "}
                        <span className="text-[#FAF7F2]/70">
                          {m.westRikishi.shikonaEn}
                        </span>
                        {" · "}
                        {m.basho.nameEn} Day {m.day}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {recentHighlights.map((m) => (
                  <div key={m.id} className="flex flex-col gap-2">
                    <YoutubeEmbed
                      url={m.highlightUrl!}
                      title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                    />
                    <p className="font-mono text-[11px] text-[#FAF7F2]/40 uppercase tracking-widest">
                      <span className="text-[#FAF7F2]/70">
                        {m.eastRikishi.shikonaEn}
                      </span>
                      {" vs "}
                      <span className="text-[#FAF7F2]/70">
                        {m.westRikishi.shikonaEn}
                      </span>
                      {" · "}
                      {m.basho.nameEn} Day {m.day}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── No data state ────────────────────────────────────────── */}
      {!latestBasho && (
        <section className="bg-[#0F0F0F] py-32 text-center">
          <p className="font-display text-2xl text-[#D4A97A] mb-2">
            No data loaded yet
          </p>
          <p className="text-[#FAF7F2]/30 text-sm mb-8">
            POST to /api/sync to pull live data from sumo-api.com
          </p>
          <Link
            href="/kimarite"
            className="bg-[#C0292A] text-white px-8 py-4 font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#D93030] transition-colors"
          >
            Browse Kimarite Techniques
          </Link>
        </section>
      )}
    </div>
  );
}
