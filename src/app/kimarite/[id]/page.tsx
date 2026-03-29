import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import MatchRow from "@/components/basho/MatchRow";
import { ChevronLeft } from "lucide-react";
import dynamic from "next/dynamic";
import { CATEGORY_COLORS } from "@/lib/kimarite-categories";

const ANIMATION_COMPONENTS: Record<string, React.ComponentType> = {
  push:    dynamic(() => import("@/components/kimarite/animations/PushAnimation"),    { ssr: false }),
  throw:   dynamic(() => import("@/components/kimarite/animations/ThrowAnimation"),   { ssr: false }),
  trip:    dynamic(() => import("@/components/kimarite/animations/TripAnimation"),    { ssr: false }),
  lift:    dynamic(() => import("@/components/kimarite/animations/LiftAnimation"),    { ssr: false }),
  twist:   dynamic(() => import("@/components/kimarite/animations/TwistAnimation"),   { ssr: false }),
  pull:    dynamic(() => import("@/components/kimarite/animations/PushAnimation"),    { ssr: false }), // reuse push anim mirrored
  special: dynamic(() => import("@/components/kimarite/animations/SpecialAnimation"), { ssr: false }),
};

export const revalidate = 86400;

export default async function KimariteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const kimarite = await db.kimarite.findUnique({
    where: { id },
    include: {
      matches: {
        include: {
          eastRikishi: true,
          westRikishi: true,
          winner: true,
          basho: true,
        },
        orderBy: [{ basho: { sumoApiId: "desc" } }, { day: "desc" }],
        take: 10,
      },
      _count: { select: { matches: true } },
    },
  });

  if (!kimarite) notFound();

  const animKey = kimarite.animationId ?? "special";
  const Animation = ANIMATION_COMPONENTS[animKey] ?? ANIMATION_COMPONENTS["special"];
  const catStyle = CATEGORY_COLORS[kimarite.category] ?? "bg-gray-100 text-gray-700 border-gray-300";

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link
        href="/kimarite"
        className="inline-flex items-center gap-1 text-sm text-[#D4A97A] hover:text-[#1A1A1A] transition-colors mb-8"
      >
        <ChevronLeft size={14} /> All Kimarite
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
        <div className="bg-[#EDE0CC] rounded-xl p-8 flex items-center justify-center min-h-[220px]">
          <Animation />
        </div>
        <div className="flex flex-col justify-center">
          <span
            className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded border self-start mb-3 ${catStyle}`}
          >
            {kimarite.category}
          </span>
          <h1 className="font-display font-black text-4xl mb-1">
            {kimarite.nameEn}
          </h1>
          <p className="font-display text-[#D4A97A] text-2xl mb-4">
            {kimarite.nameJp}
          </p>
          <p className="text-[#1A1A1A]/70 leading-relaxed mb-6">
            {kimarite.description}
          </p>
          <p className="text-sm text-[#1A1A1A]/40 font-mono">
            {kimarite._count.matches} bouts recorded in database
          </p>
        </div>
      </div>

      {kimarite.matches.length > 0 && (
        <div>
          <h2 className="font-display font-bold text-xl mb-4">
            Recent Bouts Using {kimarite.nameEn}
          </h2>
          <div>
            {kimarite.matches.map((m) => (
              <div key={m.id} className="mb-1">
                <div className="text-xs text-[#D4A97A] mb-1 ml-1">
                  {m.basho.nameEn} {m.basho.year} · Day {m.day}
                </div>
                <MatchRow
                  eastId={m.eastRikishiId}
                  eastShikona={m.eastRikishi.shikonaEn}
                  westId={m.westRikishiId}
                  westShikona={m.westRikishi.shikonaEn}
                  winnerId={m.winnerId}
                  kimariteEn={kimarite.nameEn}
                  kimariteId={kimarite.id}
                  highlightUrl={m.highlightUrl}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
