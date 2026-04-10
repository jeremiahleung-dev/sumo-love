import "dotenv/config";
import { createHash } from "crypto";
import { db } from "../src/lib/db";
import { scrapeRikishiPhoto, fetchWikipediaPhoto } from "../src/lib/scraper/jsa";

const PLACEHOLDER_HASH = "726a2354b01656601eb866b2c7191e14";

async function hashUrl(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const buf = await res.arrayBuffer();
  return createHash("md5").update(Buffer.from(buf)).digest("hex");
}

async function main() {
  const targets = ["Shonannoumi", "Sadanoumi"];

  for (const name of targets) {
    const r = await db.rikishi.findFirst({
      where: { shikonaEn: name },
      select: { id: true, shikonaEn: true, imageUrl: true, sumoApiId: true },
    });

    if (!r) { console.log(`${name}: NOT FOUND IN DB`); continue; }

    console.log(`\n=== ${name} ===`);
    console.log(`sumoApiId: ${r.sumoApiId}`);
    console.log(`imageUrl in DB: ${r.imageUrl ?? "NULL"}`);

    if (r.imageUrl) {
      const hash = await hashUrl(r.imageUrl);
      console.log(`Image hash: ${hash}`);
      console.log(`Is placeholder: ${hash === PLACEHOLDER_HASH}`);
    }

    // Try scraping fresh — what does the scraper return?
    const nskId = parseInt(r.sumoApiId);
    console.log(`\nTrying JSA scrape for nskId=${nskId}...`);
    const jsaPhoto = await scrapeRikishiPhoto(nskId);
    console.log(`JSA result: ${jsaPhoto ?? "NULL (placeholder or not found)"}`);

    console.log(`\nTrying Wikipedia for "${name}"...`);
    const wikiPhoto = await fetchWikipediaPhoto(name);
    console.log(`Wikipedia result: ${wikiPhoto ?? "NULL"}`);
  }

  await db.$disconnect();
}

main().catch(console.error);
