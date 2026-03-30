import type {
  SumoApiBanzukeEntry,
  SumoApiTorikumiEntry,
  SumoApiRikishi,
  SumoApiRikishiStats,
} from "./types";

const BASE = "https://sumo-api.com";

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`sumo-api.com ${path} → ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/** Derive the current basho ID (YYYYMM) from today's date.
 *  Basho run in odd months: Jan, Mar, May, Jul, Sep, Nov.
 *  If we're in an even month, use the previous odd month.
 */
export function currentBashoId(): string {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1; // 1-indexed
  if (month % 2 === 0) month -= 1; // even month → previous odd
  return `${year}${String(month).padStart(2, "0")}`;
}

/** Returns the last N basho IDs in descending order, starting from the current one. */
export function recentBashoIds(count: number): string[] {
  const ODD_MONTHS = [11, 9, 7, 5, 3, 1];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (month % 2 === 0) month -= 1;

  const ids: string[] = [];
  while (ids.length < count) {
    ids.push(`${year}${String(month).padStart(2, "0")}`);
    const idx = ODD_MONTHS.indexOf(month);
    if (idx + 1 < ODD_MONTHS.length) {
      month = ODD_MONTHS[idx + 1];
    } else {
      month = 11;
      year -= 1;
    }
  }
  return ids;
}

export async function fetchBanzuke(bashoId: string): Promise<SumoApiBanzukeEntry[]> {
  return apiFetch<SumoApiBanzukeEntry[]>(`/api/basho/${bashoId}/banzuke/Makuuchi`);
}

export async function fetchTorikumi(bashoId: string, day: number): Promise<SumoApiTorikumiEntry[]> {
  return apiFetch<SumoApiTorikumiEntry[]>(`/api/basho/${bashoId}/torikumi/Makuuchi/${day}`);
}

export async function fetchRikishi(id: number): Promise<SumoApiRikishi> {
  return apiFetch<SumoApiRikishi>(`/api/rikishi/${id}`);
}

export async function fetchRikishiList(): Promise<SumoApiRikishi[]> {
  return apiFetch<SumoApiRikishi[]>("/api/rikishis");
}

export async function fetchRikishiStats(id: number): Promise<SumoApiRikishiStats> {
  return apiFetch<SumoApiRikishiStats>(`/api/rikishi/${id}/stats`);
}
