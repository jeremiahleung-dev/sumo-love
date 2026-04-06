import Link from "next/link";
import { db } from "@/lib/db";
import { nextBashoId } from "@/lib/sumo-api/client";
import { MapPin, CalendarDays, Trophy, Clock } from "lucide-react";

export const revalidate = 3600;

const BASHO_META: Record<number, { jp: string; en: string; location: string; venue: string }> = {
  1:  { jp: "初場所",     en: "Hatsu Basho",   location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  3:  { jp: "春場所",     en: "Haru Basho",    location: "Osaka",   venue: "Edion Arena Osaka" },
  5:  { jp: "夏場所",     en: "Natsu Basho",   location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  7:  { jp: "名古屋場所", en: "Nagoya Basho",  location: "Nagoya",  venue: "Dolphins Arena" },
  9:  { jp: "秋場所",     en: "Aki Basho",     location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  11: { jp: "九州場所",   en: "Kyushu Basho",  location: "Fukuoka", venue: "Fukuoka Convention Center" },
};

type BashoWithMeta = {
  id: string;
  nameEn: string;
  nameJp: string;
  year: number;
  isActive: boolean;
  venue: string;
  location: string;
  startDate: Date;
  endDate: Date;
  entries: Array<{ rikishi: { shikonaEn: string } }>;
  _count: { matches: number };
};

function BashoCard({ basho, large = false }: { basho: BashoWithMeta; large?: boolean }) {
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
      <div
        className={`px-4 py-3 flex items-center justify-between ${
          basho.isActive ? "bg-[#C0292A] text-white" : "bg-[#1A1A1A] text-[#FAF7F2]"
        }`}
      >
        <div>
          <p className="font-display font-bold text-base leading-tight">{basho.nameEn}</p>
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

function UpcomingBashoCard({
  nameEn,
  nameJp,
  year,
  venue,
  location,
  startDate,
  endDate,
}: {
  nameEn: string;
  nameJp: string;
  year: number;
  venue: string;
  location: string;
  startDate: Date;
  endDate: Date;
}) {
  const startStr = startDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-[#FAF7F2] border border-dashed border-[#D4A97A] rounded-lg overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between bg-[#1A1A1A]/5 border-b border-dashed border-[#D4A97A]">
        <div>
          <p className="font-display font-bold text-base leading-tight text-[#1A1A1A]">{nameEn}</p>
          <p className="text-xs text-[#D4A97A]">{nameJp} · {year}</p>
        </div>
        <span className="flex items-center gap-1 text-[10px] font-bold text-[#D4A97A] bg-[#D4A97A]/10 px-2 py-0.5 rounded-full">
          <Clock size={10} />
          {daysUntil > 0 ? `In ${daysUntil} days` : "Starting soon"}
        </span>
      </div>
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
          <MapPin size={14} className="text-[#D4A97A] flex-shrink-0" />
          {venue}, {location}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#1A1A1A]/60">
          <CalendarDays size={14} className="text-[#D4A97A] flex-shrink-0" />
          {startStr} – {endStr}
        </div>
        <p className="text-xs text-[#1A1A1A]/30 italic">Banzuke not yet announced</p>
      </div>
    </div>
  );
}

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

  // Compute upcoming basho — show only if not already in the DB
  const upcomingId = nextBashoId();
  const upcomingInDb = allBasho.find((b) => b.sumoApiId === upcomingId);
  const upcomingYear = parseInt(upcomingId.slice(0, 4));
  const upcomingMonth = parseInt(upcomingId.slice(4, 6));
  const upcomingMeta = BASHO_META[upcomingMonth];
  const upcomingStart = new Date(upcomingYear, upcomingMonth - 1, 8);
  const upcomingEnd = new Date(upcomingYear, upcomingMonth - 1, 22);

  const byYear: Record<number, typeof past> = {};
  for (const b of past) {
    if (!byYear[b.year]) byYear[b.year] = [];
    byYear[b.year].push(b);
  }
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-4xl mb-2">Basho</h1>
        <p className="text-[#D4A97A]">
          Six tournaments per year — every result, every bout
        </p>
      </div>

      <div className="space-y-12">
        {/* Upcoming */}
        {upcomingMeta && !upcomingInDb && (
          <section>
            <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
              <span className="w-2 h-6 bg-[#D4A97A] rounded inline-block" />
              Upcoming
            </h2>
            <div className="max-w-sm">
              <UpcomingBashoCard
                nameEn={upcomingMeta.en}
                nameJp={upcomingMeta.jp}
                year={upcomingYear}
                venue={upcomingMeta.venue}
                location={upcomingMeta.location}
                startDate={upcomingStart}
                endDate={upcomingEnd}
              />
            </div>
          </section>
        )}

        {allBasho.length === 0 ? (
          <div className="text-center py-24 text-[#1A1A1A]/40">
            <p className="font-display text-2xl mb-2">No basho data</p>
            <p className="text-sm">POST to /api/sync to load tournament data</p>
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
