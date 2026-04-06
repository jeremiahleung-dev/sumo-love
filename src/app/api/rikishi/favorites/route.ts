import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function calcStreak(
  matches: Array<{ winnerId: string | null; eastRikishiId: string; westRikishiId: string }>,
  rikishiId: string
): number {
  if (matches.length === 0) return 0;
  const first = matches[0];
  if (first.winnerId === null) return 0;
  const winning = first.winnerId === rikishiId;
  let count = 0;
  for (const m of matches) {
    if (m.winnerId === null) break;
    if ((m.winnerId === rikishiId) !== winning) break;
    count++;
  }
  return winning ? count : -count;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get("ids") ?? "";
  const ids = raw.split(",").map((s) => s.trim()).filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ basho: null, bashoLeaderWins: null, rikishi: [] });
  }

  // Active basho (or most recent if none active)
  const basho =
    (await db.basho.findFirst({ where: { isActive: true } })) ??
    (await db.basho.findFirst({ orderBy: { sumoApiId: "desc" } }));

  // Basho leader win count (across all rikishi, not just favorites)
  let bashoLeaderWins: number | null = null;
  if (basho) {
    const top = await db.bashoEntry.findFirst({
      where: { bashoId: basho.id },
      orderBy: [{ wins: "desc" }, { losses: "asc" }],
    });
    bashoLeaderWins = top?.wins ?? null;
  }

  // Rikishi base data
  const rikishiRows = await db.rikishi.findMany({
    where: { id: { in: ids } },
    select: {
      id: true,
      shikonaEn: true,
      shikona: true,
      currentRank: true,
      heyaEn: true,
      imageUrl: true,
    },
  });

  // Basho entries for these rikishi in the current basho
  const entries = basho
    ? await db.bashoEntry.findMany({
        where: { bashoId: basho.id, rikishiId: { in: ids } },
        select: { rikishiId: true, wins: true, losses: true, absences: true, yusho: true, rank: true },
      })
    : [];
  const entryById = new Map(entries.map((e) => [e.rikishiId, e]));

  // Recent matches in the current basho for these rikishi (up to 5 per rikishi)
  const allMatches = basho
    ? await db.match.findMany({
        where: {
          bashoId: basho.id,
          winnerId: { not: null },
          OR: [{ eastRikishiId: { in: ids } }, { westRikishiId: { in: ids } }],
        },
        orderBy: { day: "desc" },
        select: {
          day: true,
          eastRikishiId: true,
          westRikishiId: true,
          winnerId: true,
          eastRikishi: { select: { shikonaEn: true } },
          westRikishi: { select: { shikonaEn: true } },
          kimarite: { select: { nameEn: true } },
        },
      })
    : [];

  // Group matches per rikishi
  const matchesByRikishi = new Map<string, typeof allMatches>();
  for (const m of allMatches) {
    for (const rid of [m.eastRikishiId, m.westRikishiId]) {
      if (!ids.includes(rid)) continue;
      if (!matchesByRikishi.has(rid)) matchesByRikishi.set(rid, []);
      matchesByRikishi.get(rid)!.push(m);
    }
  }

  const rikishi = rikishiRows.map((r) => {
    const matches = matchesByRikishi.get(r.id) ?? [];
    // Take last 5 for form display (already desc, reverse for oldest→newest)
    const form = matches
      .slice(0, 5)
      .reverse()
      .map((m) => ({
        day: m.day,
        won: m.winnerId === r.id,
        opponentEn:
          m.eastRikishiId === r.id
            ? m.westRikishi.shikonaEn
            : m.eastRikishi.shikonaEn,
        kimariteEn: m.kimarite?.nameEn ?? null,
      }));

    return {
      ...r,
      entry: entryById.get(r.id) ?? null,
      streak: calcStreak(matches, r.id),
      recentMatches: form,
    };
  });

  return NextResponse.json(
    { basho, bashoLeaderWins, rikishi },
    { headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=300" } }
  );
}
