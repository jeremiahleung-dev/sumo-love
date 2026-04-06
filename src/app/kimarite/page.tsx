import { db } from "@/lib/db";
import { KIMARITE_CATEGORIES } from "@/lib/kimarite-categories";
import CategorySection from "@/components/kimarite/CategorySection";

export const dynamic = "force-dynamic";

export default async function KimaritePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const allKimarite = await db.kimarite.findMany({
    orderBy: { nameEn: "asc" },
    include: { _count: { select: { matches: true } } },
  });

  const items = allKimarite.map((k) => ({
    id: k.id,
    nameEn: k.nameEn,
    nameJp: k.nameJp,
    category: k.category,
    description: k.description,
    usageCount: k._count.matches,
  }));

  const filtered = category ? items.filter((k) => k.category === category) : items;

  const byCategory: Record<string, typeof items> = {};
  for (const k of items) {
    byCategory[k.category] ??= [];
    byCategory[k.category].push(k);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl mb-2">Kimarite</h1>
        <p className="text-[#D4A97A]">
          {allKimarite.length} official winning techniques, explained in English
        </p>
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#1A1A1A]/40 text-sm py-12 text-center">
          No techniques found. Run /api/sync or npm run db:seed.
        </p>
      ) : category ? (
        <CategorySection items={filtered} />
      ) : (
        <div className="space-y-12">
          {KIMARITE_CATEGORIES.filter((cat) => byCategory[cat]?.length > 0).map((cat) => (
            <section key={cat}>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C0292A] rounded inline-block" />
                {cat}
                <span className="text-sm font-normal text-[#1A1A1A]/40 ml-1">
                  ({byCategory[cat].length})
                </span>
              </h2>
              <CategorySection items={byCategory[cat]} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
