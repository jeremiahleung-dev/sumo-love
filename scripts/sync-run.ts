import "dotenv/config";
import { syncAll } from "../src/lib/sync";

console.log("Starting sync...");
syncAll()
  .then((result) => {
    console.log("Sync complete:", result);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Sync failed:", err);
    process.exit(1);
  });
