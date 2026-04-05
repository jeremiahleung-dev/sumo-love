import "dotenv/config";
import { scrapeRikishiPhoto } from "../src/lib/scraper/jsa";

async function main() {
  const result = await scrapeRikishiPhoto(3842);
  console.log("Photo URL for nskId 3842:", result);

  const result2 = await scrapeRikishiPhoto(44);
  console.log("Photo URL for nskId 44:", result2);
}

main().catch(console.error);
