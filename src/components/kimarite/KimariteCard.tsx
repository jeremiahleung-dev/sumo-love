import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CATEGORY_COLORS } from "@/lib/kimarite-categories";

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
  // First sentence is a short English meaning (e.g. "Frontal force-out")
  const meaning = description.split(/\.\s/)[0].replace(/\.$/, "");

  return (
    <Link
      href={`/kimarite/${id}`}
      className="group bg-[#FAF7F2] border border-[#EDE0CC] rounded-lg p-4 hover:border-[#C0292A] hover:shadow-md transition-all duration-200 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display font-black text-xl leading-tight">{nameJp}</p>
          <p className="text-sm font-semibold text-[#1A1A1A]/70 mt-0.5">{nameEn}</p>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border flex-shrink-0 ${catStyle}`}>
          {category}
        </span>
      </div>

      <p className="text-xs text-[#D4A97A] leading-snug italic">{meaning}</p>

      <div className="flex items-center justify-between mt-auto">
        {usageCount !== undefined && (
          <p className="text-[10px] text-[#1A1A1A]/30 font-mono">{usageCount} bouts</p>
        )}
        <ChevronRight
          size={14}
          className="ml-auto text-[#EDE0CC] group-hover:text-[#C0292A] transition-colors"
        />
      </div>
    </Link>
  );
}
