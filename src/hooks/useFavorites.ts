"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import {
  getFavoriteIds,
  toggleFavorite as localToggle,
} from "@/lib/favorites";

export function useFavorites() {
  const { data: session, status } = useSession();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  useEffect(() => {
    if (status === "loading") return;

    if (session?.user?.id) {
      fetch("/api/user/favorites")
        .then((r) => r.json())
        .then(({ ids }: { ids: string[] }) => {
          // Migrate localStorage favorites to DB on first sign-in
          const local = getFavoriteIds();
          const toMigrate = local.filter((id) => !ids.includes(id));
          for (const id of toMigrate) {
            fetch("/api/user/favorites", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rikishiId: id }),
            });
          }
          setFavoriteIds([...new Set([...ids, ...toMigrate])]);
        })
        .catch(() => setFavoriteIds(getFavoriteIds()));
    } else {
      setFavoriteIds(getFavoriteIds());
      function onStorage(e: StorageEvent) {
        if (e.key === "dohyo:favorites") setFavoriteIds(getFavoriteIds());
      }
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
  }, [session?.user?.id, status]);

  const isFavorite = useCallback((id: string) => favoriteIds.includes(id), [favoriteIds]);

  const toggle = useCallback(
    async (id: string) => {
      const isCurrentlyFav = favoriteIds.includes(id);
      if (session?.user?.id) {
        setFavoriteIds((prev) =>
          isCurrentlyFav ? prev.filter((x) => x !== id) : [...prev, id]
        );
        await fetch("/api/user/favorites", {
          method: isCurrentlyFav ? "DELETE" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rikishiId: id }),
        });
      } else {
        localToggle(id);
        setFavoriteIds(getFavoriteIds());
      }
    },
    [favoriteIds, session?.user?.id]
  );

  return { favoriteIds, isFavorite, toggle, count: favoriteIds.length };
}
