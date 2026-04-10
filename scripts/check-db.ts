import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const bashos = await db.basho.findMany({ orderBy: { sumoApiId: "desc" }, take: 5 });
  console.log("=== BASHOS IN DB ===");
  bashos.forEach(b => console.log(`  ${b.sumoApiId} - ${b.nameEn}`));

  const count = await db.rikishi.count();
  console.log(`\nTotal rikishi: ${count}`);

  const all = await db.rikishi.findMany({
    where: { division: "Makuuchi" },
    select: { shikonaEn: true, currentRank: true },
  });
  const rankOrder = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi", "Maegashira"];
  all.sort((a, b) => {
    const ra = rankOrder.findIndex(r => a.currentRank.startsWith(r));
    const rb = rankOrder.findIndex(r => b.currentRank.startsWith(r));
    if (ra !== rb) return ra - rb;
    return a.currentRank.localeCompare(b.currentRank);
  });
  console.log("\n=== MAKUUCHI ROSTER ===");
  all.forEach(r => console.log(`  ${r.currentRank.padEnd(25)} ${r.shikonaEn}`));

  await db.$disconnect();
}

main().catch(console.error);
