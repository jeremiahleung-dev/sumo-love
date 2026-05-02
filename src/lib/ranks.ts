export const SANYAKU = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"] as const;
export type SanyakuRank = (typeof SANYAKU)[number];

export const RANK_ORDER = [...SANYAKU, "Maegashira"] as const;

export function isSanyaku(rank: string | null | undefined): boolean {
  return !!rank && SANYAKU.some((r) => rank.startsWith(r));
}

export function rankSortKey(rank: string | null | undefined): number {
  if (!rank) return 9999;
  const idx = RANK_ORDER.findIndex((r) => rank.startsWith(r));
  if (idx === -1) return 9999;
  const isWest = rank.includes("West") ? 1 : 0;
  const num = parseInt(rank.replace(/\D/g, "")) || 1;
  return idx * 1000 + num * 2 + isWest;
}

export function rankToDivision(rank: string): string {
  return isSanyaku(rank) ? "Sanyaku" : "Makuuchi";
}

const ABBR: Record<string, string> = {
  Yokozuna: "Y", Ozeki: "O", Sekiwake: "S", Komusubi: "K", Maegashira: "M",
};

/** "Maegashira 5 East" → "M5e", "Yokozuna 1 West" → "Y1w" */
export function rankAbbr(rank: string | null | undefined): string {
  if (!rank) return "—";
  for (const [full, abbr] of Object.entries(ABBR)) {
    if (rank.startsWith(full)) {
      const num = rank.match(/\d+/)?.[0] ?? "";
      const side = rank.includes("East") ? "e" : rank.includes("West") ? "w" : "";
      return `${abbr}${num}${side}`;
    }
  }
  return rank;
}
