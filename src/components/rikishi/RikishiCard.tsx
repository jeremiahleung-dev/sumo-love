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
  nameOrigin?: string | null;
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
  nameOrigin,
  biography,
  wins,
  losses,
  absences,
}: Props) {
  return (
    <Link
      href={`/rikishi/${id}`}
      className="group bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-[#C0292A]/40 hover:shadow-xl hover:shadow-[#C0292A]/5 transition-all duration-300 flex flex-col"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={shikonaEn}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl text-[#D4A97A]/20 font-display font-black select-none">
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
        <p className="font-display font-bold text-base leading-tight text-white">{shikonaEn}</p>
        <p className="text-xs text-white/30">{shikona}</p>
        {nameOrigin && (
          <p className="text-[10px] text-[#C0292A]/60 italic mb-1">{nameOrigin}</p>
        )}
        <p className="text-xs text-[#D4A97A]/60">{heya} Stable</p>
        {wins !== undefined && losses !== undefined && (
          <div className="mt-2">
            <RecordPill wins={wins} losses={losses} absences={absences} />
          </div>
        )}
        {biography && (
          <p className="mt-3 text-[11px] text-white/35 leading-relaxed line-clamp-3 italic">
            {biography}
          </p>
        )}
      </div>
    </Link>
  );
}
