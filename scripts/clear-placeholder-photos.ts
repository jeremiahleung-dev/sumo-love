import "dotenv/config";
import { createHash } from "crypto";
import { db } from "../src/lib/db";

const PLACEHOLDER_HASH = "726a2354b01656601eb866b2c7191e14";

async function main() {
  const all = await db.rikishi.findMany({
    select: { id: true, shikonaEn: true, imageUrl: true },
    where: { imageUrl: { not: null } },
  });

  let cleared = 0;
  for (const r of all) {
    try {
      const res = await fetch(r.imageUrl!, { signal: AbortSignal.timeout(8000) });
      const buf = await res.arrayBuffer();
      const hash = createHash("md5").update(Buffer.from(buf)).digest("hex");
      if (hash === PLACEHOLDER_HASH) {
        await db.rikishi.update({ where: { id: r.id }, data: { imageUrl: null } });
        console.log(`Cleared placeholder for ${r.shikonaEn}`);
        cleared++;
      }
    } catch {
      console.log(`Skipped ${r.shikonaEn} (fetch error)`);
    }
  }

  console.log(`\nCleared ${cleared} placeholders.`);
  await db.$disconnect();
}

main().catch(console.error);
