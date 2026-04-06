"use client";

import { useFavorites } from "@/hooks/useFavorites";

export default function NavFavoriteBadge() {
  const { count } = useFavorites();
  if (count === 0) return null;
  return (
    <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#C0292A] text-white text-[10px] font-bold leading-none">
      {count}
    </span>
  );
}
