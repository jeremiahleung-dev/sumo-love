import "dotenv/config";
import { db } from "../src/lib/db";

async function main() {
  // 1. Check if Wikipedia URLs are actually reachable
  console.log("=== Testing stored Wikipedia URLs ===");
  const withPhoto = await db.rikishi.findMany({
    where: { imageUrl: { not: null } },
    select: { shikonaEn: true, imageUrl: true },
    take: 3,
  });

  for (const r of withPhoto) {
    try {
      const res = await fetch(r.imageUrl!, { method: "HEAD" });
      console.log(`${r.shikonaEn}: ${res.status} ${res.ok ? "OK" : "FAIL"}`);
    } catch (e) {
      console.log(`${r.shikonaEn}: ERROR ${e}`);
    }
  }

  // 2. Test JSA URL patterns against a known rikishi (Terunofuji nskId=44)
  console.log("\n=== Testing JSA URL patterns (nskId=44 Terunofuji) ===");
  const patterns = [
    "https://www.sumo.or.jp/image/rikishi/scaled/200/44.jpg",
    "https://www.sumo.or.jp/image/rikishi/200/44.jpg",
    "https://www.sumo.or.jp/image/rikishi/44.jpg",
    "https://www.sumo.or.jp/img/rikishi/44.jpg",
  ];
  for (const url of patterns) {
    try {
      const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
      console.log(`${res.status} ${res.ok ? "✓" : "✗"} ${url}`);
    } catch {
      console.log(`TIMEOUT/ERR ${url}`);
    }
  }

  // 3. Try scraping the actual JSA profile page to find the real image URL
  console.log("\n=== Scraping JSA profile page for Terunofuji (nskId=44) ===");
  try {
    const res = await fetch("https://www.sumo.or.jp/EnRikishiMain/0/0/profile/44", {
      headers: { "User-Agent": "sumo-love/1.0" },
      signal: AbortSignal.timeout(10000),
    });
    console.log(`Page status: ${res.status}`);
    if (res.ok) {
      const html = await res.text();
      // Find all img src attributes
      const imgMatches = html.match(/<img[^>]+src="([^"]+)"/g) ?? [];
      console.log("Image tags found:");
      imgMatches.slice(0, 10).forEach((m) => console.log(" ", m));
    }
  } catch (e) {
    console.log("JSA scrape error:", e);
  }

  await db.$disconnect();
}

main().catch(console.error);
