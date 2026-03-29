import { db } from "./db";
import {
  fetchBashoList,
  fetchBanzuke,
  fetchTorikumi,
  fetchRikishi,
} from "./sumo-api/client";
import { scrapeRikishiPhoto } from "./scraper/jsa";
import { findMatchHighlight } from "./scraper/youtube";
import { rankToDivision } from "./ranks";

const BASHO_NAMES: Record<number, { jp: string; en: string; location: string; venue: string }> = {
  1:  { jp: "初場所",     en: "Hatsu Basho",   location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  3:  { jp: "春場所",     en: "Haru Basho",    location: "Osaka",   venue: "Edion Arena Osaka" },
  5:  { jp: "夏場所",     en: "Natsu Basho",   location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  7:  { jp: "名古屋場所", en: "Nagoya Basho",  location: "Nagoya",  venue: "Dolphins Arena" },
  9:  { jp: "秋場所",     en: "Aki Basho",     location: "Tokyo",   venue: "Ryogoku Kokugikan" },
  11: { jp: "九州場所",   en: "Kyushu Basho",  location: "Fukuoka", venue: "Fukuoka Convention Center" },
};

function bashoIdToDate(bashoId: string): { year: number; month: number; start: Date; end: Date } {
  const year = parseInt(bashoId.slice(0, 4));
  const month = parseInt(bashoId.slice(4, 6));
  // Approximate: basho start mid-month, run 15 days
  const start = new Date(year, month - 1, 8);
  const end = new Date(year, month - 1, 22);
  return { year, month, start, end };
}

export async function syncAll(): Promise<{ bashoSynced: number; rikishiSynced: number; matchesSynced: number }> {
  let rikishiSynced = 0;
  let matchesSynced = 0;

  // Fetch once — derive latestId from the same list rather than a second API call
  const bashoList = await fetchBashoList();
  bashoList.sort((a, b) => b.bashoId.localeCompare(a.bashoId));
  const latestId = bashoList[0]?.bashoId;
  if (!latestId) return { bashoSynced: 0, rikishiSynced: 0, matchesSynced: 0 };

  const toSync = bashoList
    .map((b) => b.bashoId)
    .filter((id) => id <= latestId)
    .slice(0, 3);

  // Pre-load all kimarite into a name→id map to avoid per-bout DB lookups
  const allKimarite = await db.kimarite.findMany({ select: { id: true, nameEn: true } });
  const kimariteByName = new Map(allKimarite.map((k) => [k.nameEn, k.id]));

  for (const bashoId of toSync) {
    const { year, month, start, end } = bashoIdToDate(bashoId);
    const names = BASHO_NAMES[month] ?? { jp: "場所", en: "Basho", location: "Japan", venue: "Kokugikan" };
    const isActive = bashoId === latestId;

    const basho = await db.basho.upsert({
      where: { sumoApiId: bashoId },
      update: { isActive },
      create: {
        sumoApiId: bashoId,
        year,
        month,
        nameJp: names.jp,
        nameEn: names.en,
        location: names.location,
        venue: names.venue,
        startDate: start,
        endDate: end,
        isActive,
      },
    });

    let banzuke;
    try {
      banzuke = await fetchBanzuke(bashoId);
    } catch {
      continue;
    }

    // Fetch all rikishi profiles in parallel rather than serially
    const profileResults = await Promise.allSettled(
      banzuke.map((entry) => fetchRikishi(entry.rikishiID))
    );

    for (let i = 0; i < banzuke.length; i++) {
      const entry = banzuke[i];
      const profileResult = profileResults[i];
      if (profileResult.status === "rejected") continue;
      const rikishiData = profileResult.value;

      const division = rankToDivision(entry.rank);
      let imageUrl: string | null = null;
      if (rikishiData.nskId) {
        imageUrl = await scrapeRikishiPhoto(rikishiData.nskId);
      }

      const rikishi = await db.rikishi.upsert({
        where: { sumoApiId: String(entry.rikishiID) },
        update: {
          currentRank: entry.rank,
          division,
          shikonaEn: entry.shikonaEn,
          shikona: entry.shikonaJp ?? entry.shikonaEn,
          ...(imageUrl && { imageUrl }),
        },
        create: {
          sumoApiId: String(entry.rikishiID),
          shikona: entry.shikonaJp ?? entry.shikonaEn,
          shikonaEn: entry.shikonaEn,
          heya: rikishiData.heya ?? "Unknown",
          heyaEn: rikishiData.heya ?? "Unknown",
          nationality: rikishiData.shusshin ?? "Japan",
          birthdate: rikishiData.birthDate ? new Date(rikishiData.birthDate) : null,
          heightCm: rikishiData.height ? Math.round(rikishiData.height) : null,
          weightKg: rikishiData.weight ? Math.round(rikishiData.weight) : null,
          imageUrl,
          currentRank: entry.rank,
          division,
          debut: rikishiData.debut ? new Date(rikishiData.debut) : null,
        },
      });
      rikishiSynced++;

      await db.bashoEntry.upsert({
        where: { rikishiId_bashoId: { rikishiId: rikishi.id, bashoId: basho.id } },
        update: { wins: entry.wins, losses: entry.losses, absences: entry.absences },
        create: {
          rikishiId: rikishi.id,
          bashoId: basho.id,
          rank: entry.rank,
          wins: entry.wins,
          losses: entry.losses,
          absences: entry.absences,
          specialPrize: entry.special_prizes?.[0] ?? null,
        },
      });
    }

    // Build a sumoApiId→db.id map for this basho's rikishi to avoid per-bout lookups
    const rikishiRows = await db.rikishi.findMany({
      where: { bashoEntries: { some: { bashoId: basho.id } } },
      select: { id: true, sumoApiId: true },
    });
    const rikishiById = new Map(rikishiRows.map((r) => [r.sumoApiId, r.id]));

    for (let day = 1; day <= 15; day++) {
      let torikumi;
      try {
        torikumi = await fetchTorikumi(bashoId, day);
      } catch {
        break;
      }

      for (const bout of torikumi) {
        const eastDbId = rikishiById.get(String(bout.eastId));
        const westDbId = rikishiById.get(String(bout.westId));
        if (!eastDbId || !westDbId) continue;

        const winnerDbId = bout.winnerId ? rikishiById.get(String(bout.winnerId)) ?? null : null;
        const kimariteId = bout.kimarite ? (kimariteByName.get(bout.kimarite) ?? null) : null;

        let highlightUrl: string | null = null;
        try {
          const hl = await findMatchHighlight(bout.eastShikona, bout.westShikona, bashoId);
          highlightUrl = hl?.url ?? null;
        } catch {
          // YouTube lookup is optional
        }

        try {
          await db.match.upsert({
            where: {
              bashoId_day_eastRikishiId_westRikishiId: {
                bashoId: basho.id,
                day,
                eastRikishiId: eastDbId,
                westRikishiId: westDbId,
              },
            },
            update: { winnerId: winnerDbId, kimariteId, highlightUrl },
            create: {
              bashoId: basho.id,
              day,
              eastRikishiId: eastDbId,
              westRikishiId: westDbId,
              winnerId: winnerDbId,
              kimariteId,
              highlightUrl,
            },
          });
          matchesSynced++;
        } catch {
          // Skip duplicates
        }
      }
    }
  }

  return { bashoSynced: toSync.length, rikishiSynced, matchesSynced };
}
