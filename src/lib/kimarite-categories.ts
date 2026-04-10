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
  Push:    "bg-[#DC2626]/10 text-[#FCA5A5] border-[#DC2626]/30",
  Throw:   "bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]",
  Trip:    "bg-[#F59E0B]/10 text-[#FCD34D] border-[#F59E0B]/30",
  Lift:    "bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30",
  Pull:    "bg-[#7F1D1D]/20 text-[#FCA5A5] border-[#7F1D1D]/30",
  Twist:   "bg-[#71717A]/10 text-[#A1A1AA] border-[#52525B]",
  Special: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
};
