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
