import { db } from "@/lib/db";
import KimariteCard from "@/components/kimarite/KimariteCard";

export const revalidate = 86400;

const CATEGORIES = ["Push", "Throw", "Trip", "Lift", "Pull", "Twist", "Special"];

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

  const byCategory: Record<string, typeof filtered> = {};
  for (const k of filtered) {
    if (!byCategory[k.category]) byCategory[k.category] = [];
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

      {/* Category filter */}
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
        {CATEGORIES.map((cat) => {
          const count = allKimarite.filter((k) => k.category === cat).length;
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
        // Single-category flat grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((k) => (
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
      ) : (
        // Grouped by category
        <div className="space-y-12">
          {CATEGORIES.filter((cat) => byCategory[cat]?.length > 0).map((cat) => (
            <section key={cat}>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C0292A] rounded inline-block" />
                {cat}
                <span className="text-sm font-normal text-[#1A1A1A]/40 ml-1">
                  ({byCategory[cat].length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {byCategory[cat].map((k) => (
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
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
