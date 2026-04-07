import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import RankBadge from "@/components/ui/RankBadge";
import RecordPill from "@/components/ui/RecordPill";
import { ChevronLeft, Scale, Ruler, Calendar, MapPin } from "lucide-react";
import FavoriteButton from "@/components/rikishi/FavoriteButton";

export const revalidate = 0;

export default async function RikishiProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const rikishi = await db.rikishi.findUnique({
    where: { id },
    include: {
      bashoEntries: {
        orderBy: { basho: { sumoApiId: "desc" } },
        take: 12,
        include: { basho: true },
      },
    },
  });

  if (!rikishi) notFound();

  const totalWins = rikishi.bashoEntries.reduce((s, e) => s + e.wins, 0);
  const totalLosses = rikishi.bashoEntries.reduce((s, e) => s + e.losses, 0);
  const totalAbsences = rikishi.bashoEntries.reduce((s, e) => s + e.absences, 0);
  const totalBouts = totalWins + totalLosses;
  const winPct = totalBouts > 0 ? Math.round((totalWins / totalBouts) * 100) : 0;
  const yushoCount = rikishi.bashoEntries.filter((e) => e.yusho).length;

  const birthdate = rikishi.birthdate
    ? new Date(rikishi.birthdate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div>
      <div className="bg-[#1A1A1A] text-[#FAF7F2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <Link
            href="/rikishi"
            className="inline-flex items-center gap-1 text-sm text-[#D4A97A] hover:text-white transition-colors mb-6"
          >
            <ChevronLeft size={14} /> All Rikishi
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="relative w-36 h-48 md:w-48 md:h-64 rounded-lg overflow-hidden bg-[#EDE0CC] flex-shrink-0">
              {rikishi.imageUrl ? (
                <Image
                  src={rikishi.imageUrl}
                  alt={rikishi.shikonaEn}
                  fill
                  className="object-cover object-top"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl text-[#D4A97A] font-display font-black">
                    力
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                {rikishi.currentRank && (
                  <RankBadge rank={rikishi.currentRank} size="md" />
                )}
                <FavoriteButton rikishiId={rikishi.id} variant="pill" />
              </div>
              <h1 className="font-display font-black text-4xl md:text-5xl mb-1">
                {rikishi.shikonaEn}
              </h1>
              <p className="font-display text-[#D4A97A] text-xl mb-1">
                {rikishi.shikona}
              </p>
              {rikishi.nameOrigin && (
                <p className="text-sm text-white/50 italic mb-4">{rikishi.nameOrigin}</p>
              )}
              <p className="text-[#EDE0CC] text-sm mb-6">{rikishi.heyaEn} Stable</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4A97A] mb-1">
                    Career Record
                  </p>
                  <RecordPill
                    wins={totalWins}
                    losses={totalLosses}
                    absences={totalAbsences}
                  />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4A97A] mb-1">
                    Win Rate
                  </p>
                  <p className="font-mono font-bold text-lg">{winPct}%</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4A97A] mb-1">
                    Yusho
                  </p>
                  <p className="font-mono font-bold text-lg">
                    {yushoCount > 0 ? (
                      <span className="text-[#C0292A]">
                        {yushoCount} <span className="text-xs">優勝</span>
                      </span>
                    ) : (
                      "—"
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-[#D4A97A] mb-1">
                    Basho
                  </p>
                  <p className="font-mono font-bold text-lg">
                    {rikishi.bashoEntries.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h2 className="font-display font-bold text-xl mb-4">
              Basho History
            </h2>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/5 text-white/50 text-xs uppercase tracking-wider">
                    <th className="px-4 py-3 text-left">Basho</th>
                    <th className="px-4 py-3 text-left">Rank</th>
                    <th className="px-4 py-3 text-right">Record</th>
                    <th className="px-4 py-3 text-center hidden sm:table-cell">
                      Prize
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rikishi.bashoEntries.map((entry) => (
                    <tr
                      key={entry.id}
                      className={`hover:bg-white/5 transition-colors ${
                        entry.yusho ? "bg-[#C0292A]/5" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/basho/${entry.bashoId}`}
                          className="hover:text-[#C0292A] transition-colors"
                        >
                          <span className="font-semibold">
                            {entry.basho.nameEn}
                          </span>
                          <span className="text-white/40 ml-1 text-xs">
                            {entry.basho.year}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <RankBadge rank={entry.rank} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <RecordPill
                          wins={entry.wins}
                          losses={entry.losses}
                          absences={entry.absences}
                        />
                        {entry.yusho && (
                          <span className="ml-2 text-[10px] bg-[#C0292A] text-white px-1.5 py-0.5 rounded font-sans">
                            優勝
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-xs text-[#D4A97A] hidden sm:table-cell">
                        {entry.specialPrize ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-display font-bold text-xl mb-4">Profile</h2>
            <div className="bg-[#FAF7F2] border border-[#EDE0CC] rounded-lg p-5 space-y-4 text-[#1A1A1A]">
              {rikishi.nationality && (
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-[#D4A97A] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4A97A]">
                      Hometown
                    </p>
                    <p className="font-medium">{rikishi.nationality}</p>
                  </div>
                </div>
              )}
              {rikishi.heightCm && (
                <div className="flex items-center gap-3">
                  <Ruler size={16} className="text-[#D4A97A] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4A97A]">
                      Height
                    </p>
                    <p className="font-medium">{rikishi.heightCm} cm</p>
                  </div>
                </div>
              )}
              {rikishi.weightKg && (
                <div className="flex items-center gap-3">
                  <Scale size={16} className="text-[#D4A97A] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4A97A]">
                      Weight
                    </p>
                    <p className="font-medium">{rikishi.weightKg} kg</p>
                  </div>
                </div>
              )}
              {birthdate && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-[#D4A97A] flex-shrink-0" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#D4A97A]">
                      Born
                    </p>
                    <p className="font-medium">{birthdate}</p>
                  </div>
                </div>
              )}
            </div>

            {rikishi.biography && (
              <div className="mt-6">
                <h3 className="font-display font-semibold mb-3">Story</h3>
                <p className="text-sm text-white/70 leading-relaxed italic">
                  {rikishi.biography}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
