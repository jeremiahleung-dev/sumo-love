"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";

interface Props {
  rikishiId: string;
  variant: "icon" | "pill";
}

export default function FavoriteButton({ rikishiId, variant }: Props) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(rikishiId);

  if (variant === "pill") {
    return (
      <button
        onClick={() => toggle(rikishiId)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
          active
            ? "bg-[#C0292A] text-white hover:bg-[#8B1A1A]"
            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        }`}
        aria-label={active ? "Unfollow rikishi" : "Follow rikishi"}
      >
        <Heart
          size={15}
          className={active ? "fill-current" : ""}
        />
        {active ? "Following" : "Follow"}
      </button>
    );
  }

  // icon variant — absolute-positioned overlay on card photo
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(rikishiId);
      }}
      className={`absolute top-2 right-2 z-10 flex items-center justify-center w-7 h-7 rounded-full transition-all duration-200 ${
        active
          ? "bg-[#C0292A] text-white opacity-100"
          : "bg-black/40 text-white/60 opacity-60 group-hover:opacity-100"
      }`}
      aria-label={active ? "Unfollow" : "Follow"}
    >
      <Heart size={13} className={active ? "fill-current" : ""} />
    </button>
  );
}
