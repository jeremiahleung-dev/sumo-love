import type {
  SumoApiBasho,
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

export async function fetchBashoList(): Promise<SumoApiBasho[]> {
  return apiFetch<SumoApiBasho[]>("/api/basho");
}

export async function fetchBanzuke(
  bashoId: string
): Promise<SumoApiBanzukeEntry[]> {
  return apiFetch<SumoApiBanzukeEntry[]>(`/api/basho/${bashoId}/banzuke`);
}

export async function fetchTorikumi(
  bashoId: string,
  day: number
): Promise<SumoApiTorikumiEntry[]> {
  return apiFetch<SumoApiTorikumiEntry[]>(
    `/api/basho/${bashoId}/torikumi/${day}`
  );
}

export async function fetchRikishi(id: number): Promise<SumoApiRikishi> {
  return apiFetch<SumoApiRikishi>(`/api/rikishi/${id}`);
}

export async function fetchRikishiList(): Promise<SumoApiRikishi[]> {
  return apiFetch<SumoApiRikishi[]>("/api/rikishi?intai=false");
}

export async function fetchRikishiStats(
  id: number
): Promise<SumoApiRikishiStats> {
  return apiFetch<SumoApiRikishiStats>(`/api/rikishi/${id}/stats`);
}
