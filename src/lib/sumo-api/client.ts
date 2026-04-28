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
 *  If we're in an even month and day >= 20, the next basho's banzuke has
 *  already been published (~13 days before the basho), so look ahead.
 *  Otherwise fall back to the previous odd month.
 */
export function currentBashoId(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  const day = now.getDate();

  if (month % 2 === 1) {
    return `${year}${String(month).padStart(2, "0")}`;
  }
  // Even month: banzuke for the next basho drops in the last ~week of the month
  if (day >= 20) {
    const nextMonth = month + 1;
    if (nextMonth <= 12) return `${year}${String(nextMonth).padStart(2, "0")}`;
    return `${year + 1}01`; // December → January next year
  }
  return `${year}${String(month - 1).padStart(2, "0")}`;
}

/** Returns the next basho ID after the current one (YYYYMM). */
export function nextBashoId(): string {
  const ODD_MONTHS = [1, 3, 5, 7, 9, 11];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  if (month % 2 === 0) month += 1; // even → next odd
  else month += 2; // already odd → skip to the one after
  if (month > 12) { month = 1; year += 1; }
  // snap to nearest odd month (handles edge cases)
  if (!ODD_MONTHS.includes(month)) month += 1;
  return `${year}${String(month).padStart(2, "0")}`;
}

/** Returns the last N basho IDs in descending order, starting from the current one. */
export function recentBashoIds(count: number): string[] {
  const ODD_MONTHS = [11, 9, 7, 5, 3, 1];
  const startId = currentBashoId();
  let year = parseInt(startId.slice(0, 4));
  let month = parseInt(startId.slice(4, 6));

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

/** Checks if sumo-api.com has data for a given basho. Returns true if the banzuke has entries. */
export async function bashoHasData(bashoId: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/api/basho/${bashoId}/banzuke/Makuuchi`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return false;
    const data = await res.json() as { east?: unknown[]; west?: unknown[] };
    return Array.isArray(data.east) && data.east.length > 0;
  } catch {
    return false;
  }
}

export async function fetchBanzuke(bashoId: string): Promise<SumoApiBanzukeEntry[]> {
  const res = await apiFetch<{ east: SumoApiBanzukeEntry[]; west: SumoApiBanzukeEntry[] }>(
    `/api/basho/${bashoId}/banzuke/Makuuchi`
  );
  return [...(res.east ?? []), ...(res.west ?? [])];
}

export async function fetchTorikumi(bashoId: string, day: number): Promise<SumoApiTorikumiEntry[]> {
  const res = await apiFetch<{ torikumi: SumoApiTorikumiEntry[] }>(
    `/api/basho/${bashoId}/torikumi/Makuuchi/${day}`
  );
  return res.torikumi ?? [];
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
