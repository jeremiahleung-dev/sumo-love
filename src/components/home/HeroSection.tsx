"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface HeroSectionProps {
  isActive: boolean;
  bashoName?: string;
}

// Cubic bezier typed as required by Framer Motion
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.75, delay, ease: EASE },
  };
}

const ringAnim = {
  initial: { opacity: 0, scale: 0.75 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 1.4, delay: 0.35, ease: EASE },
};

export default function HeroSection({ isActive, bashoName }: HeroSectionProps) {
  const year = new Date().getFullYear();

  return (
    <section className="relative min-h-screen bg-[#0D0D0D] text-[#FAF7F2] overflow-hidden flex flex-col">
      {/* Grain overlay */}
      <div
        className="texture-grain absolute inset-0 pointer-events-none z-0"
        aria-hidden
      />

      {/* Giant kanji watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden
      >
        <span
          className="font-display font-black text-white/[0.028] leading-none"
          style={{ fontSize: "clamp(18rem, 55vw, 62rem)" }}
        >
          相撲
        </span>
      </div>

      {/* Dohyo rings — bleed off right edge */}
      <motion.div
        {...ringAnim}
        className="absolute pointer-events-none select-none z-0"
        style={{
          right: "-120px",
          top: "50%",
          translateY: "-50%",
          width: 620,
          height: 620,
        }}
        aria-hidden
      >
        <div className="absolute inset-0 rounded-full border border-[#D4A97A]/15" />
        <div
          className="absolute rounded-full border border-[#C0292A]/20"
          style={{ inset: 68 }}
        />
        <div
          className="absolute rounded-full border-2 border-[#D4A97A]/30"
          style={{ inset: 140 }}
        />
        <div
          className="absolute rounded-full bg-[#C0292A]/[0.06]"
          style={{ inset: 210 }}
        />
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 w-full py-28 md:py-36">
          <div className="max-w-[58%] max-md:max-w-full">
            {/* Overline + live badge */}
            <motion.div
              {...fadeUp(0)}
              className="flex flex-wrap items-center gap-3 mb-6"
            >
              <span className="text-[#C0292A] text-[11px] font-bold tracking-[0.35em] uppercase">
                MAKUUCHI · SANYAKU · {year}
              </span>
              {isActive && bashoName && (
                <span className="inline-flex items-center gap-1.5 bg-[#C0292A] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                  <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-white inline-block" />
                  LIVE — {bashoName}
                </span>
              )}
            </motion.div>

            {/* 力士 headline */}
            <motion.h1
              {...fadeUp(0.15)}
              className="font-display font-black text-[#FAF7F2] leading-none"
              style={{ fontSize: "clamp(5rem, 14vw, 11rem)" }}
            >
              力士
            </motion.h1>

            {/* Tagline */}
            <motion.p
              {...fadeUp(0.3)}
              className="font-display font-bold text-[#D4A97A] leading-tight mt-3"
              style={{ fontSize: "clamp(1.4rem, 3.5vw, 2.75rem)" }}
            >
              The Dohyo Never Lies.
            </motion.p>

            {/* Body + history note */}
            <motion.div {...fadeUp(0.45)} className="mt-8">
              <p className="text-[#EDE0CC]/65 text-lg leading-relaxed max-w-[420px]">
                Follow every rikishi through each basho. Live standings,
                bout-by-bout results, and the ancient techniques behind every
                victory.
              </p>
              <p className="text-[#D4A97A]/55 text-sm italic mt-4 tracking-wide">
                ~1,500 years of living history
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              {...fadeUp(0.6)}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/rikishi"
                className="bg-[#C0292A] text-white px-8 py-4 font-bold text-xs tracking-[0.18em] uppercase hover:bg-[#D93030] transition-colors duration-200"
              >
                All Rikishi
              </Link>
              <Link
                href="/basho"
                className="border border-[#EDE0CC]/30 text-[#EDE0CC] px-8 py-4 font-medium text-xs tracking-[0.12em] uppercase hover:border-[#D4A97A] hover:text-[#D4A97A] transition-colors duration-200"
              >
                Basho Archive
              </Link>
              <Link
                href="/kimarite"
                className="border border-[#EDE0CC]/12 text-[#EDE0CC]/50 px-8 py-4 font-medium text-xs tracking-[0.12em] uppercase hover:border-[#EDE0CC]/30 hover:text-[#EDE0CC]/80 transition-colors duration-200"
              >
                Kimarite
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeUp(0.85)}
        className="relative z-10 flex justify-center pb-10"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-[#D4A97A]/40">
          <span className="text-[9px] tracking-[0.3em] uppercase font-medium">
            Scroll
          </span>
          <ChevronDown size={14} className="animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
