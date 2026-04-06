"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { KIMARITE_CATEGORIES } from "@/lib/kimarite-categories";

export default function KimariteSubNav() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  return (
    <div className="border-t border-white/5 bg-[#0A0A0A]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 scrollbar-none">
          <Link
            href="/kimarite"
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              !active
                ? "bg-[#C0292A] text-white"
                : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            All
          </Link>
          {KIMARITE_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/kimarite?category=${cat}`}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                active === cat
                  ? "bg-[#C0292A] text-white"
                  : "text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
