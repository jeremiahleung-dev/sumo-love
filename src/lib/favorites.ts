export interface FavoriteEntry {
  id: string;
  addedAt: number;
}

const STORAGE_KEY = "sumo-love:favorites";

function read(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as FavoriteEntry[];
  } catch {
    return [];
  }
}

function write(entries: FavoriteEntry[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function getFavorites(): FavoriteEntry[] {
  return read().sort((a, b) => b.addedAt - a.addedAt);
}

export function getFavoriteIds(): string[] {
  return getFavorites().map((e) => e.id);
}

export function isFavorite(id: string): boolean {
  return read().some((e) => e.id === id);
}

export function addFavorite(id: string): void {
  const entries = read();
  if (entries.some((e) => e.id === id)) return;
  write([...entries, { id, addedAt: Date.now() }]);
}

export function removeFavorite(id: string): void {
  write(read().filter((e) => e.id !== id));
}

export function toggleFavorite(id: string): boolean {
  if (isFavorite(id)) {
    removeFavorite(id);
    return false;
  } else {
    addFavorite(id);
    return true;
  }
}
