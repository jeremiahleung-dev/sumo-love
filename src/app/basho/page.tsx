import Link from "next/link";
import { db } from "@/lib/db";
import RecordPill from "@/components/ui/RecordPill";
import { MapPin, CalendarDays, Trophy } from "lucide-react";

export const revalidate = 3600;

export default async function BashoPage() {
  const allBasho = await db.basho.findMany({
    orderBy: { sumoApiId: "desc" },
    include: {
      entries: {
        where: { yusho: true },
        include: { rikishi: true },
        take: 1,
      },
      _count: { select: { matches: true } },
    },
  });

  const active = allBasho.find((b) => b.isActive);
  const past = allBasho.filter((b) => !b.isActive);

  const byYear: Record<number, typeof past> = {};
  for (const b of past) {
    if (!byYear[b.year]) byYear[b.year] = [];
    byYear[b.year].push(b);
  }
  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a);

  function BashoCard({
    basho,
    large = false,
  }: {
    basho: (typeof allBasho)[number];
    large?: boolean;
  }) {
    const winner = basho.entries[0]?.rikishi;
    const startStr = new Date(basho.startDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    const endStr = new Date(basho.endDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <Link
        href={`/basho/${basho.id}`}
        className={`group block bg-[#FAF7F2] border rounded-lg overflow-hidden hover:shadow-lg transition-all ${
          basho.isActive
            ? "border-[#C0292A] shadow-md"
            : "border-[#EDE0CC] hover:border-[#C0292A]"
        }`}
      >
        {/* Header stripe */}
        <div
          className={`px-4 py-3 flex items-center justify-between ${
            basho.isActive ? "bg-[#C0292A] text-white" : "bg-[#1A1A1A] text-[#FAF7F2]"
          }`}
        >
          <div>
            <p className="font-display font-bold text-base leading-tight">
              {basho.nameEn}
            </p>
            <p className={`text-xs ${basho.isActive ? "text-white/70" : "text-[#D4A97A]"}`}>
              {basho.nameJp} · {basho.year}
            </p>
          </div>
          {basho.isActive && (
            <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full animate-pulse">
              LIVE
            </span>
          )}
        </div>

        <div className={`p-4 ${large ? "space-y-3" : "space-y-2"}`}>
          <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
            <MapPin size={14} className="text-[#D4A97A] flex-shrink-0" />
            {basho.venue}, {basho.location}
          </div>
          <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
            <CalendarDays size={14} className="text-[#D4A97A] flex-shrink-0" />
            {startStr} – {endStr}
          </div>
          {winner && (
            <div className="flex items-center gap-2 text-sm">
              <Trophy size={14} className="text-[#C0292A] flex-shrink-0" />
              <span className="font-display font-semibold">{winner.shikonaEn}</span>
              <span className="text-[10px] text-[#C0292A]">優勝</span>
            </div>
          )}
          <div className="text-xs text-[#1A1A1A]/40">
            {basho._count.matches} bouts recorded
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-4xl mb-2">Basho</h1>
        <p className="text-[#D4A97A]">
          Six tournaments per year — every result, every bout
        </p>
      </div>

      {allBasho.length === 0 ? (
        <div className="text-center py-24 text-[#1A1A1A]/40">
          <p className="font-display text-2xl mb-2">No basho data</p>
          <p className="text-sm">POST to /api/sync to load tournament data</p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Current */}
          {active && (
            <section>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C0292A] rounded inline-block" />
                Current Basho
              </h2>
              <div className="max-w-sm">
                <BashoCard basho={active} large />
              </div>
            </section>
          )}

          {/* By year */}
          {years.map((year) => (
            <section key={year}>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#1A1A1A] rounded inline-block" />
                {year}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {byYear[year].map((b) => (
                  <BashoCard key={b.id} basho={b} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
