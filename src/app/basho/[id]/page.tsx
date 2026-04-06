import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import LeaderBoard from "@/components/basho/LeaderBoard";
import DaySection from "@/components/basho/DaySection";
import { ChevronLeft, MapPin, CalendarDays, Trophy } from "lucide-react";

export const revalidate = 1800;

export default async function BashoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const basho = await db.basho.findFirst({
    where: { OR: [{ id }, { sumoApiId: id }] },
    include: {
      entries: {
        include: { rikishi: true },
        orderBy: { wins: "desc" },
      },
      matches: {
        include: {
          eastRikishi: true,
          westRikishi: true,
          winner: true,
          kimarite: true,
        },
        orderBy: [{ day: "asc" }],
      },
    },
  });

  if (!basho) notFound();

  const leaderEntries = basho.entries.map((e) => ({
    rikishiId: e.rikishiId,
    shikonaEn: e.rikishi.shikonaEn,
    currentRank: e.rikishi.currentRank,
    wins: e.wins,
    losses: e.losses,
    absences: e.absences,
    yusho: e.yusho,
  }));

  const winner = basho.entries.find((e) => e.yusho)?.rikishi;
  const days = Array.from(new Set(basho.matches.map((m) => m.day))).sort((a, b) => a - b);
  const matchesByDay: Record<number, typeof basho.matches> = {};
  for (const m of basho.matches) {
    if (!matchesByDay[m.day]) matchesByDay[m.day] = [];
    matchesByDay[m.day].push(m);
  }

  const startStr = new Date(basho.startDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const endStr = new Date(basho.endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div>
      <div className="bg-[#1A1A1A] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Link
            href="/basho"
            className="inline-flex items-center gap-1 text-sm text-[#D4A97A] hover:text-white transition-colors mb-4"
          >
            <ChevronLeft size={14} /> All Basho
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              {basho.isActive && (
                <span className="inline-flex items-center gap-1 text-[10px] bg-[#C0292A] text-white px-2 py-0.5 rounded-full font-bold mb-2 animate-pulse">
                  LIVE
                </span>
              )}
              <h1 className="font-display font-black text-4xl mb-1">
                {basho.nameEn}
              </h1>
              <p className="font-display text-[#D4A97A] text-xl">{basho.nameJp}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-[#EDE0CC]">
              <span className="flex items-center gap-2">
                <MapPin size={14} className="text-[#D4A97A]" />
                {basho.venue}, {basho.location}
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays size={14} className="text-[#D4A97A]" />
                {startStr} – {endStr}
              </span>
              {winner && (
                <span className="flex items-center gap-2">
                  <Trophy size={14} className="text-[#C0292A]" />
                  <span className="font-semibold">{winner.shikonaEn}</span>
                  <span className="text-[10px] text-[#C0292A]">優勝 (Yusho)</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div>
            <h2 className="font-display font-bold text-xl mb-4">Standings</h2>
            {leaderEntries.length > 0 ? (
              <LeaderBoard entries={leaderEntries} />
            ) : (
              <p className="text-white/40 text-sm">No standings yet.</p>
            )}
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-xl mb-4">
              Bouts {basho.isActive && <span className="text-[#C0292A]">· Live</span>}
            </h2>

            {days.length === 0 ? (
              <p className="text-white/40 text-sm">
                No bout results available yet.
              </p>
            ) : (
              <div className="space-y-8">
                {days.map((day) => (
                  <DaySection
                    key={day}
                    day={day}
                    matches={matchesByDay[day].map((m) => ({
                      id: m.id,
                      eastRikishiId: m.eastRikishiId,
                      eastShikona: m.eastRikishi.shikonaEn,
                      westRikishiId: m.westRikishiId,
                      westShikona: m.westRikishi.shikonaEn,
                      winnerId: m.winnerId,
                      kimariteEn: m.kimarite?.nameEn ?? null,
                      kimariteId: m.kimariteId,
                      highlightUrl: m.highlightUrl,
                    }))}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
