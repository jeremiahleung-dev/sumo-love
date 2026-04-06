import Link from "next/link";
import Image from "next/image";
import RankBadge from "@/components/ui/RankBadge";
import RecordPill from "@/components/ui/RecordPill";

interface Props {
  id: string;
  shikonaEn: string;
  shikona: string;
  currentRank: string | null;
  heya: string;
  imageUrl: string | null;
  biography?: string | null;
  wins?: number;
  losses?: number;
  absences?: number;
}

export default function RikishiCard({
  id,
  shikonaEn,
  shikona,
  currentRank,
  heya,
  imageUrl,
  biography,
  wins,
  losses,
  absences,
}: Props) {
  return (
    <Link
      href={`/rikishi/${id}`}
      className="group bg-[#FAF7F2] border border-[#EDE0CC] rounded-lg overflow-hidden hover:border-[#C0292A] hover:shadow-lg transition-all duration-200 flex flex-col"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[#EDE0CC] overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={shikonaEn}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-[#D4A97A] font-display font-black select-none">
              力
            </span>
          </div>
        )}
        {currentRank && (
          <div className="absolute top-2 left-2">
            <RankBadge rank={currentRank} />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="font-display font-bold text-base leading-tight">{shikonaEn}</p>
        <p className="text-xs text-[#1A1A1A]/50 mb-1">{shikona}</p>
        <p className="text-xs text-[#D4A97A]">{heya} Stable</p>
        {wins !== undefined && losses !== undefined && (
          <div className="mt-2">
            <RecordPill wins={wins} losses={losses} absences={absences} />
          </div>
        )}
        {biography && (
          <p className="mt-3 text-[11px] text-[#1A1A1A]/55 leading-relaxed line-clamp-3 italic">
            {biography}
          </p>
        )}
      </div>
    </Link>
  );
}
