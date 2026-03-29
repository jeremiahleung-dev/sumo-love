import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { KIMARITE_DATA } from "../src/lib/kimarite-seed-data";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not set");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding kimarite data...");

  const seen = new Set<string>();
  const unique = KIMARITE_DATA.filter((k) => {
    if (seen.has(k.nameJp)) return false;
    seen.add(k.nameJp);
    return true;
  });

  for (const k of unique) {
    await prisma.kimarite.upsert({
      where: { nameJp: k.nameJp },
      update: {
        nameEn: k.nameEn,
        category: k.category,
        description: k.description,
        animationId: k.animationId,
      },
      create: {
        nameJp: k.nameJp,
        nameEn: k.nameEn,
        category: k.category,
        description: k.description,
        animationId: k.animationId,
      },
    });
  }

  console.log(`Seeded ${unique.length} kimarite techniques.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
