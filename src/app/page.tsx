import Link from "next/link";
import { db } from "@/lib/db";
import HeroSection from "@/components/home/HeroSection";
import CountdownBanner from "@/components/ui/CountdownBanner";
import RikishiFilmstrip from "@/components/home/RikishiFilmstrip";
import LeaderBoard from "@/components/basho/LeaderBoard";
import YoutubeEmbed from "@/components/ui/YoutubeEmbed";
import { ChevronRight } from "lucide-react";
import { nextBashoId } from "@/lib/sumo-api/client";

const BASHO_NAMES: Record<number, { en: string; jp: string }> = {
  1:  { en: "Hatsu Basho",  jp: "初場所" },
  3:  { en: "Haru Basho",   jp: "春場所" },
  5:  { en: "Natsu Basho",  jp: "夏場所" },
  7:  { en: "Nagoya Basho", jp: "名古屋場所" },
  9:  { en: "Aki Basho",    jp: "秋場所" },
  11: { en: "Kyushu Basho", jp: "九州場所" },
};

function getNextBashoStartDate(bashoId: string): Date {
  const year = parseInt(bashoId.slice(0, 4));
  const month = parseInt(bashoId.slice(4, 6));
  const firstOfMonth = new Date(year, month - 1, 1);
  const dow = firstOfMonth.getDay();
  const firstSunday = dow === 0 ? 1 : 8 - dow;
  return new Date(year, month - 1, firstSunday + 7);
}

export const revalidate = 3600;

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

  const isBashoLive = !!latestBasho?.isActive;

  const upcomingId = nextBashoId();
  const upcomingMonth = parseInt(upcomingId.slice(4, 6));
  const upcomingNames = BASHO_NAMES[upcomingMonth] ?? { en: "Next Basho", jp: "場所" };
  const upcomingStart = getNextBashoStartDate(upcomingId);

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
    heya: r.heyaEn,
    imageUrl: r.imageUrl,
  }));

  return (
    <div className="bg-[#09090B]">
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <HeroSection isActive={isBashoLive} bashoName={latestBasho?.nameEn} />

      {/* ── Countdown banner — shown when no live basho ──────────── */}
      {!isBashoLive && (
        <CountdownBanner
          targetDate={upcomingStart.toISOString()}
          bashoName={upcomingNames.en}
          bashoNameJp={upcomingNames.jp}
        />
      )}

      {/* ── Basho ticker bar ─────────────────────────────────────── */}
      {latestBasho && (
        <div className="bg-[#DC2626]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 py-3 flex flex-wrap items-center justify-between gap-2 text-sm">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-white">{latestBasho.nameEn}</span>
              <span className="text-white/50 hidden sm:inline">·</span>
              <span className="text-white/75 hidden sm:inline">{latestBasho.location}</span>
              <span className="text-white/50 hidden sm:inline">·</span>
              <span className="text-white/75 hidden sm:inline">
                {leaderEntries.length} Rikishi
              </span>
            </div>
            <Link
              href={`/basho/${latestBasho.id}`}
              className="flex items-center gap-1 text-white/75 hover:text-white font-medium text-xs tracking-[0.12em] uppercase transition-colors duration-200 cursor-pointer"
            >
              View Full Results <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}

      {/* ── Standings ────────────────────────────────────────────── */}
      {latestBasho && (
        <section className="py-16 md:py-20 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-[#DC2626] text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
                  {latestBasho.isActive ? "Current Standings" : "Final Standings"}
                </p>
                <h2 className="font-display font-bold text-[#FAFAFA] text-3xl md:text-4xl leading-tight">
                  {latestBasho.nameEn}
                </h2>
                <p className="text-[#52525B] text-sm mt-1">{latestBasho.location}</p>
              </div>
              <Link
                href={`/basho/${latestBasho.id}`}
                className="flex-none text-xs text-[#DC2626] font-semibold tracking-[0.12em] uppercase hover:text-[#B91C1C] flex items-center gap-1 transition-colors duration-200 cursor-pointer"
              >
                Full Results <ChevronRight size={13} />
              </Link>
            </div>

            {leaderEntries.length > 0 ? (
              <div className="border border-[#27272A] rounded-xl overflow-hidden">
                <LeaderBoard entries={leaderEntries} />
              </div>
            ) : (
              <div className="border border-dashed border-[#27272A] rounded-xl p-16 text-center">
                <p className="font-display text-xl text-[#3F3F46] mb-2">No basho data yet</p>
                <p className="text-sm text-[#27272A]">POST to /api/sync to pull live standings</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Top Rank Filmstrip ───────────────────────────────────── */}
      {filmstripRikishi.length > 0 && (
        <section className="bg-[#0F0F11] py-16 md:py-20 border-b border-[#27272A]">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <div className="flex items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-[#DC2626] text-[11px] font-semibold tracking-[0.25em] uppercase mb-2">
                  Yokozuna · Ozeki
                </p>
                <h2 className="font-display font-bold text-[#FAFAFA] text-3xl md:text-4xl">
                  Top Rank
                </h2>
              </div>
              <Link
                href="/rikishi"
                className="flex-none text-xs text-[#DC2626] font-semibold tracking-[0.12em] uppercase hover:text-[#B91C1C] flex items-center gap-1 transition-colors duration-200 cursor-pointer"
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
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            <p className="text-[#FAFAFA] text-[11px] font-semibold tracking-[0.25em] uppercase mb-8 pb-4 border-b border-[#27272A]">
              Recent Highlights
            </p>

            {recentHighlights.length >= 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="md:col-span-2 flex flex-col gap-3">
                  <div className="rounded-xl overflow-hidden">
                    <YoutubeEmbed
                      url={recentHighlights[0].highlightUrl!}
                      title={`${recentHighlights[0].eastRikishi.shikonaEn} vs ${recentHighlights[0].westRikishi.shikonaEn}`}
                    />
                  </div>
                  <p className="font-mono text-[11px] text-[#52525B] uppercase tracking-widest">
                    <span className="text-[#A1A1AA]">
                      {recentHighlights[0].eastRikishi.shikonaEn}
                    </span>
                    {" vs "}
                    <span className="text-[#A1A1AA]">
                      {recentHighlights[0].westRikishi.shikonaEn}
                    </span>
                    {" · "}
                    {recentHighlights[0].basho.nameEn} Day {recentHighlights[0].day}
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {recentHighlights.slice(1).map((m) => (
                    <div key={m.id} className="flex flex-col gap-2">
                      <div className="rounded-xl overflow-hidden">
                        <YoutubeEmbed
                          url={m.highlightUrl!}
                          title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                        />
                      </div>
                      <p className="font-mono text-[11px] text-[#52525B] uppercase tracking-widest">
                        <span className="text-[#A1A1AA]">{m.eastRikishi.shikonaEn}</span>
                        {" vs "}
                        <span className="text-[#A1A1AA]">{m.westRikishi.shikonaEn}</span>
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
                    <div className="rounded-xl overflow-hidden">
                      <YoutubeEmbed
                        url={m.highlightUrl!}
                        title={`${m.eastRikishi.shikonaEn} vs ${m.westRikishi.shikonaEn}`}
                      />
                    </div>
                    <p className="font-mono text-[11px] text-[#52525B] uppercase tracking-widest">
                      <span className="text-[#A1A1AA]">{m.eastRikishi.shikonaEn}</span>
                      {" vs "}
                      <span className="text-[#A1A1AA]">{m.westRikishi.shikonaEn}</span>
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
        <section className="py-32 text-center">
          <p className="font-display text-2xl text-[#3F3F46] mb-2">No data loaded yet</p>
          <p className="text-[#27272A] text-sm mb-8">POST to /api/sync to pull live data</p>
          <Link
            href="/kimarite"
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8 py-4 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer"
          >
            Browse Kimarite Techniques
          </Link>
        </section>
      )}
    </div>
  );
}
