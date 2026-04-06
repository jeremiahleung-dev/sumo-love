"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getFavoriteIds,
  isFavorite as isFavoriteFn,
  toggleFavorite as toggleFavoriteFn,
} from "@/lib/favorites";

export function useFavorites() {
  // Start empty to avoid hydration mismatch — populated in useEffect
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());

    // Keep in sync across tabs
    function onStorage(e: StorageEvent) {
      if (e.key === "sumo-love:favorites") {
        setFavoriteIds(getFavoriteIds());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const isFavorite = useCallback((id: string) => isFavoriteFn(id), []);

  const toggle = useCallback((id: string) => {
    toggleFavoriteFn(id);
    setFavoriteIds(getFavoriteIds());
  }, []);

  return { favoriteIds, isFavorite, toggle, count: favoriteIds.length };
}
