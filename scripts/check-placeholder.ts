import "dotenv/config";
import { createHash } from "crypto";
import { db } from "../src/lib/db";

async function getHash(url: string): Promise<{ hash: string; size: number }> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  const buf = await res.arrayBuffer();
  return {
    hash: createHash("md5").update(Buffer.from(buf)).digest("hex"),
    size: buf.byteLength,
  };
}

async function main() {
  // Pull current imageUrls from DB and check a sample
  const rikishi = await db.rikishi.findMany({
    select: { shikonaEn: true, imageUrl: true },
    where: { imageUrl: { not: null } },
    take: 10,
  });

  const results: Record<string, string[]> = {};

  for (const r of rikishi) {
    const { hash, size } = await getHash(r.imageUrl!);
    console.log(`${r.shikonaEn}: hash=${hash} size=${size}B`);
    if (!results[hash]) results[hash] = [];
    results[hash].push(r.shikonaEn);
  }

  console.log("\n--- Duplicate hashes (same image = likely placeholder) ---");
  for (const [hash, names] of Object.entries(results)) {
    if (names.length > 1) console.log(`${hash}: ${names.join(", ")}`);
  }

  await db.$disconnect();
}

main().catch(console.error);
