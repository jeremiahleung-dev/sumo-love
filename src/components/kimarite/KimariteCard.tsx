import Link from "next/link";
import dynamic from "next/dynamic";

const ANIMATION_MAP: Record<string, React.ComponentType> = {};

const CATEGORY_COLORS: Record<string, string> = {
  Push:    "bg-[#C0292A]/10 text-[#C0292A] border-[#C0292A]/30",
  Throw:   "bg-[#1A1A1A]/10 text-[#1A1A1A] border-[#1A1A1A]/30",
  Trip:    "bg-[#D4A97A]/30 text-[#8B4513] border-[#D4A97A]",
  Lift:    "bg-[#2D6A4F]/10 text-[#2D6A4F] border-[#2D6A4F]/30",
  Pull:    "bg-[#8B1A1A]/10 text-[#8B1A1A] border-[#8B1A1A]/30",
  Twist:   "bg-[#EDE0CC] text-[#1A1A1A] border-[#D4A97A]",
  Special: "bg-gradient-to-r from-[#C0292A]/10 to-[#D4A97A]/10 text-[#8B4513] border-[#D4A97A]",
};

export default function KimariteCard({
  id,
  nameEn,
  nameJp,
  category,
  description,
  usageCount,
}: {
  id: string;
  nameEn: string;
  nameJp: string;
  category: string;
  description: string;
  usageCount?: number;
}) {
  const catStyle = CATEGORY_COLORS[category] ?? "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <Link
      href={`/kimarite/${id}`}
      className="group bg-[#FAF7F2] border border-[#EDE0CC] rounded-lg p-4 hover:border-[#C0292A] hover:shadow-md transition-all duration-200 flex flex-col gap-2"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display font-bold text-base leading-tight">{nameEn}</p>
          <p className="text-sm text-[#D4A97A] font-display">{nameJp}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${catStyle} whitespace-nowrap`}>
          {category}
        </span>
      </div>
      <p className="text-xs text-[#1A1A1A]/60 leading-relaxed line-clamp-2">{description}</p>
      {usageCount !== undefined && (
        <p className="text-[10px] text-[#D4A97A] font-mono mt-auto">
          {usageCount} bouts recorded
        </p>
      )}
    </Link>
  );
}
