import Link from "next/link";
import Image from "next/image";
import RankBadge from "@/components/ui/RankBadge";

interface FilmstripRikishi {
  id: string;
  shikonaEn: string;
  shikona: string;
  currentRank: string | null;
  heya: string;
  imageUrl: string | null;
}

export default function RikishiFilmstrip({
  rikishi,
}: {
  rikishi: FilmstripRikishi[];
}) {
  if (rikishi.length === 0) return null;

  return (
    <div className="relative filmstrip-fade">
      <div className="filmstrip flex gap-3 pb-2">
        {rikishi.map((r) => (
          <Link
            key={r.id}
            href={`/rikishi/${r.id}`}
            className="group flex-none w-52 relative overflow-hidden rounded-xl bg-[#18181B] cursor-pointer"
            style={{ aspectRatio: "2/3" }}
          >
            {r.imageUrl ? (
              <Image
                src={r.imageUrl}
                alt={r.shikonaEn}
                fill
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="208px"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-[#18181B]">
                <span className="text-5xl text-[#27272A] font-display font-black select-none">
                  —
                </span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            {/* Info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 transition-transform duration-300 group-hover:-translate-y-1">
              {r.currentRank && (
                <div className="mb-2">
                  <RankBadge rank={r.currentRank} />
                </div>
              )}
              <p className="font-display font-bold text-white text-base leading-tight">
                {r.shikonaEn}
              </p>
              <p className="text-[#A1A1AA] text-xs mt-0.5">{r.shikona}</p>
              <p className="text-white/30 text-[11px] mt-1">{r.heya} Stable</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
