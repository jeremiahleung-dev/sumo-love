import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  const rikishi = await db.rikishi.findMany({
    select: { shikonaEn: true, imageUrl: true },
    orderBy: { shikonaEn: "asc" },
  });

  const withPhoto = rikishi.filter((r) => r.imageUrl);
  const without = rikishi.filter((r) => !r.imageUrl);

  console.log(`Total: ${rikishi.length}`);
  console.log(`With photo: ${withPhoto.length}`);
  console.log(`Without photo: ${without.length}`);
  console.log("\nSample URLs:");
  withPhoto.slice(0, 5).forEach((r) => console.log(`  ${r.shikonaEn}: ${r.imageUrl}`));
  console.log("\nMissing photos (first 20):");
  without.slice(0, 20).forEach((r) => console.log(`  ${r.shikonaEn}`));

  await db.$disconnect();
}

main().catch(console.error);
