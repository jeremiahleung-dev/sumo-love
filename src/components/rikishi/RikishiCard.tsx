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
  wins,
  losses,
  absences,
}: Props) {
  return (
    <Link
      href={`/rikishi/${id}`}
      className="group bg-[#141414] border border-white/5 rounded-xl overflow-hidden hover:border-[#C0292A]/40 hover:shadow-xl hover:shadow-[#C0292A]/5 transition-all duration-300"
    >
      {/* Photo */}
      <div className="relative aspect-[3/4] bg-[#1A1A1A] overflow-hidden">
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
      <div className="p-3">
        <p className="font-display font-bold text-base leading-tight text-white">{shikonaEn}</p>
        <p className="text-xs text-white/30 mb-1">{shikona}</p>
        <p className="text-xs text-[#D4A97A]/60">{heya} Stable</p>
        {wins !== undefined && losses !== undefined && (
          <div className="mt-2">
            <RecordPill wins={wins} losses={losses} absences={absences} />
          </div>
        )}
      </div>
    </Link>
  );
}
