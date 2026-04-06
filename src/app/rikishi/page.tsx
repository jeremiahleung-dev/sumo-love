import { db } from "@/lib/db";
import RikishiGrid from "@/components/rikishi/RikishiGrid";
import { isSanyaku, rankSortKey } from "@/lib/ranks";

export const revalidate = 3600;

export default async function RikishiPage() {
  const latestBasho = await db.basho.findFirst({ orderBy: { sumoApiId: "desc" } });

  const allRikishi = await db.rikishi.findMany({
    where: latestBasho
      ? { bashoEntries: { some: { bashoId: latestBasho.id } } }
      : undefined,
    orderBy: { currentRank: "asc" },
    include: {
      bashoEntries: {
        orderBy: { basho: { sumoApiId: "desc" } },
        take: 1,
        include: { basho: true },
      },
    },
  });

  const sorted = [...allRikishi].sort(
    (a, b) => rankSortKey(a.currentRank) - rankSortKey(b.currentRank)
  );

  const toItem = (r: (typeof sorted)[number]) => {
    const entry = r.bashoEntries[0];
    return {
      id: r.id,
      shikonaEn: r.shikonaEn,
      shikona: r.shikona,
      currentRank: r.currentRank,
      heyaEn: r.heyaEn,
      imageUrl: r.imageUrl,
      wins: entry?.wins,
      losses: entry?.losses,
      absences: entry?.absences,
    };
  };

  const sanyaku = sorted.filter((r) => isSanyaku(r.currentRank)).map(toItem);
  const maegashira = sorted.filter((r) => r.currentRank?.startsWith("Maegashira")).map(toItem);
  const other = sorted
    .filter((r) => !isSanyaku(r.currentRank) && !r.currentRank?.startsWith("Maegashira"))
    .map(toItem);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-10">
        <h1 className="font-display font-black text-4xl mb-2">Rikishi</h1>
        <p className="text-[#D4A97A]">
          Makuuchi division — {allRikishi.length} wrestlers
        </p>
      </div>

      {allRikishi.length === 0 ? (
        <div className="text-center py-24 text-[#1A1A1A]/40">
          <p className="font-display text-2xl mb-2">No rikishi loaded</p>
          <p className="text-sm">POST to /api/sync to load the current banzuke</p>
        </div>
      ) : (
        <div className="space-y-12">
          {sanyaku.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#C0292A] rounded inline-block" />
                Sanyaku
              </h2>
              <RikishiGrid rikishi={sanyaku} />
            </section>
          )}
          {maegashira.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#1A1A1A] rounded inline-block" />
                Maegashira
              </h2>
              <RikishiGrid rikishi={maegashira} />
            </section>
          )}
          {other.length > 0 && (
            <section>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#D4A97A] rounded inline-block" />
                Other
              </h2>
              <RikishiGrid rikishi={other} />
            </section>
          )}
        </div>
      )}
    </div>
  );
}
