import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function KimariteCard({
  id,
  nameEn,
  nameJp,
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
  const meaning = description.split(/\.\s/)[0].replace(/\.$/, "");

  return (
    <Link
      href={`/kimarite/${id}`}
      className="group bg-[#141414] border border-[#27272A] rounded-xl p-4 hover:border-[#DC2626]/40 hover:shadow-lg hover:shadow-[#DC2626]/5 transition-all duration-200 flex flex-col gap-3"
    >
      <div className="min-w-0">
        <p className="font-display font-black text-xl leading-tight text-[#FAFAFA]">{nameJp}</p>
        <p className="text-sm font-semibold text-[#A1A1AA] mt-0.5">{nameEn}</p>
      </div>

      <p className="text-xs text-[#52525B] leading-snug italic flex-1">{meaning}</p>

      <div className="flex items-center justify-between mt-auto">
        {usageCount !== undefined && (
          <p className="text-[10px] text-[#3F3F46] font-mono">{usageCount} bouts</p>
        )}
        <ChevronRight
          size={14}
          className="ml-auto text-[#3F3F46] group-hover:text-[#DC2626] transition-colors"
        />
      </div>
    </Link>
  );
}
