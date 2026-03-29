export const SANYAKU = ["Yokozuna", "Ozeki", "Sekiwake", "Komusubi"] as const;
export type SanyakuRank = (typeof SANYAKU)[number];

export const RANK_ORDER = [...SANYAKU, "Maegashira"] as const;

export function isSanyaku(rank: string | null | undefined): boolean {
  return !!rank && SANYAKU.some((r) => rank.startsWith(r));
}

export function rankSortKey(rank: string | null | undefined): number {
  if (!rank) return 99;
  const idx = RANK_ORDER.findIndex((r) => rank.startsWith(r));
  if (idx === -1) return 99;
  if (rank.startsWith("Maegashira")) {
    const num = parseInt(rank.replace(/\D/g, "")) || 99;
    return 4 + num / 100;
  }
  return idx;
}

export function rankToDivision(rank: string): string {
  return isSanyaku(rank) ? "Sanyaku" : "Makuuchi";
}
