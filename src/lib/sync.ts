import { db } from "./db";
import {
  fetchLatestBashoId,
  fetchBashoList,
  fetchBanzuke,
  fetchTorikumi,
  fetchRikishi,
} from "./sumo-api/client";
import { scrapeRikishiPhoto } from "./scraper/jsa";
import { findMatchHighlight } from "./scraper/youtube";

const BASHO_NAMES: Record<number, { jp: string; en: string; location: string; venue: string }> = {
  1:  { jp: "初場所",   en: "Hatsu Basho",   location: "Tokyo",    venue: "Ryogoku Kokugikan" },
  3:  { jp: "春場所",   en: "Haru Basho",    location: "Osaka",    venue: "Edion Arena Osaka" },
  5:  { jp: "夏場所",   en: "Natsu Basho",   location: "Tokyo",    venue: "Ryogoku Kokugikan" },
  7:  { jp: "名古屋場所", en: "Nagoya Basho", location: "Nagoya",   venue: "Dolphins Arena" },
  9:  { jp: "秋場所",   en: "Aki Basho",     location: "Tokyo",    venue: "Ryogoku Kokugikan" },
  11: { jp: "九州場所", en: "Kyushu Basho",  location: "Fukuoka",  venue: "Fukuoka Convention Center" },
};

function bashoIdToDate(bashoId: string): { year: number; month: number; start: Date; end: Date } {
  const year = parseInt(bashoId.slice(0, 4));
  const month = parseInt(bashoId.slice(4, 6));
  // Basho start on the second Sunday of the tournament month, run 15 days
  const start = new Date(year, month - 1, 8); // approximate
  const end = new Date(year, month - 1, 22);
  return { year, month, start, end };
}

function rankToDivision(rank: string): string {
  const sanyaku = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"];
  return sanyaku.some((r) => rank.startsWith(r)) ? "Sanyaku" : "Makuuchi";
}

export async function syncAll(): Promise<{ bashoSynced: number; rikishiSynced: number; matchesSynced: number }> {
  let rikishiSynced = 0;
  let matchesSynced = 0;

  const bashoList = await fetchBashoList();
  const latestId = await fetchLatestBashoId();

  // Sync the latest 3 basho (current + 2 past)
  const toSync = bashoList
    .map((b) => b.bashoId)
    .filter((id) => id <= latestId)
    .sort((a, b) => b.localeCompare(a))
    .slice(0, 3);

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

    // Sync banzuke (rankings + records)
    let banzuke;
    try {
      banzuke = await fetchBanzuke(bashoId);
    } catch {
      continue;
    }

    for (const entry of banzuke) {
      // Upsert rikishi
      let rikishiData;
      try {
        rikishiData = await fetchRikishi(entry.rikishiID);
      } catch {
        continue;
      }

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

      // Upsert basho entry
      await db.bashoEntry.upsert({
        where: { rikishiId_bashoId: { rikishiId: rikishi.id, bashoId: basho.id } },
        update: {
          wins: entry.wins,
          losses: entry.losses,
          absences: entry.absences,
        },
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

    // Sync match results for each day
    const totalDays = 15;
    for (let day = 1; day <= totalDays; day++) {
      let torikumi;
      try {
        torikumi = await fetchTorikumi(bashoId, day);
      } catch {
        break; // Day not yet available
      }

      for (const bout of torikumi) {
        const east = await db.rikishi.findUnique({ where: { sumoApiId: String(bout.eastId) } });
        const west = await db.rikishi.findUnique({ where: { sumoApiId: String(bout.westId) } });
        if (!east || !west) continue;

        const winner = bout.winnerId
          ? await db.rikishi.findUnique({ where: { sumoApiId: String(bout.winnerId) } })
          : null;

        let kimarite: { id: string } | null = null;
        if (bout.kimarite) {
          kimarite = await db.kimarite.findFirst({ where: { nameEn: bout.kimarite } });
        }

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
                eastRikishiId: east.id,
                westRikishiId: west.id,
              },
            },
            update: {
              winnerId: winner?.id ?? null,
              kimariteId: kimarite?.id ?? null,
              highlightUrl,
            },
            create: {
              bashoId: basho.id,
              day,
              eastRikishiId: east.id,
              westRikishiId: west.id,
              winnerId: winner?.id ?? null,
              kimariteId: kimarite?.id ?? null,
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
