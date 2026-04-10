import "dotenv/config";
import { createHash } from "crypto";
import { db } from "../src/lib/db";
import { fetchWikipediaPhoto } from "../src/lib/scraper/jsa";

const PLACEHOLDER_HASH = "726a2354b01656601eb866b2c7191e14";

async function hashUrl(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const buf = await res.arrayBuffer();
  return createHash("md5").update(Buffer.from(buf)).digest("hex");
}

async function main() {
  // Map of shikonaEn -> fresh JSA URL found by the scraper
  const updates: Record<string, string> = {
    Shonannoumi: "https://www.sumo.or.jp/img/sumo_data/rikishi/270x474/20000049.jpg",
    Sadanoumi:   "https://www.sumo.or.jp/img/sumo_data/rikishi/270x474/20000035.jpg",
  };

  for (const [name, jsaUrl] of Object.entries(updates)) {
    const r = await db.rikishi.findFirst({ where: { shikonaEn: name } });
    if (!r) { console.log(`${name}: not found`); continue; }

    // Check if the fresh JSA URL is also a placeholder
    const hash = await hashUrl(jsaUrl);
    const isPlaceholder = hash === PLACEHOLDER_HASH;
    console.log(`${name} JSA hash: ${hash} → ${isPlaceholder ? "PLACEHOLDER" : "real photo"}`);

    let finalUrl: string | null = isPlaceholder ? null : jsaUrl;

    // If JSA has no real photo, try Wikipedia
    if (!finalUrl) {
      finalUrl = await fetchWikipediaPhoto(name);
      console.log(`${name} Wikipedia: ${finalUrl ?? "not found"}`);
    }

    await db.rikishi.update({ where: { id: r.id }, data: { imageUrl: finalUrl } });
    console.log(`${name} → updated to: ${finalUrl ?? "NULL"}\n`);
  }

  await db.$disconnect();
}

main().catch(console.error);
