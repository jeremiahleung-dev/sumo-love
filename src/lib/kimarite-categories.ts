export const KIMARITE_CATEGORIES = [
  "Push",
  "Throw",
  "Trip",
  "Lift",
  "Pull",
  "Twist",
  "Special",
] as const;

export type KimariteCategory = (typeof KIMARITE_CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Push:    "bg-[#C0292A]/10 text-[#C0292A] border-[#C0292A]/30",
  Throw:   "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/30",
  Trip:    "bg-[#D4A97A]/30 text-[#8B4513] border-[#D4A97A]",
  Lift:    "bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/30",
  Pull:    "bg-[#8B1A1A]/10 text-[#8B1A1A] border-[#8B1A1A]/30",
  Twist:   "bg-[#EDE0CC] text-[#1A1A1A] border-[#D4A97A]",
  Special: "bg-[#D4A97A]/20 text-[#8B4513] border-[#D4A97A]",
};
