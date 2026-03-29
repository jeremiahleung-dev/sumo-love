import { db } from "@/lib/db";
import KimariteCard from "@/components/kimarite/KimariteCard";
import { KIMARITE_CATEGORIES } from "@/lib/kimarite-categories";

export const revalidate = 86400;

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

  const filtered = category
    ? allKimarite.filter((k) => k.category === category)
    : allKimarite;

  // Build category grouping and counts in one pass
  const byCategory: Record<string, typeof allKimarite> = {};
  const countByCategory: Record<string, number> = {};
  for (const k of allKimarite) {
    byCategory[k.category] ??= [];
    byCategory[k.category].push(k);
    countByCategory[k.category] = (countByCategory[k.category] ?? 0) + 1;
  }

  const grid = (items: typeof allKimarite) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map((k) => (
        <KimariteCard
          key={k.id}
          id={k.id}
          nameEn={k.nameEn}
          nameJp={k.nameJp}
          category={k.category}
          description={k.description}
          usageCount={k._count.matches}
        />
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display font-black text-4xl mb-2">Kimarite</h1>
        <p className="text-[#D4A97A]">
          {allKimarite.length} official winning techniques, explained in English
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        <a
          href="/kimarite"
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            !category
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "border-[#EDE0CC] text-[#1A1A1A]/60 hover:border-[#C0292A] hover:text-[#C0292A]"
          }`}
        >
          All ({allKimarite.length})
        </a>
        {KIMARITE_CATEGORIES.map((cat) => {
          const count = countByCategory[cat] ?? 0;
          if (count === 0) return null;
          return (
            <a
              key={cat}
              href={`/kimarite?category=${cat}`}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                category === cat
                  ? "bg-[#C0292A] text-white border-[#C0292A]"
                  : "border-[#EDE0CC] text-[#1A1A1A]/60 hover:border-[#C0292A] hover:text-[#C0292A]"
              }`}
            >
              {cat} ({count})
            </a>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-[#1A1A1A]/40 text-sm py-12 text-center">
          No techniques found. Run /api/sync or npm run db:seed.
        </p>
      ) : category ? (
        grid(filtered)
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
              {grid(byCategory[cat])}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
