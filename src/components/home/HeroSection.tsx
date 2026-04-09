"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import NextBashoCountdown from "@/components/ui/NextBashoCountdown";

interface HeroSectionProps {
  isActive: boolean;
  bashoName?: string;
  countdownDate?: string;
  countdownBashoName?: string;
  countdownBashoNameJp?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, delay, ease: EASE },
  };
}

export default function HeroSection({
  isActive,
  bashoName,
  countdownDate,
  countdownBashoName,
  countdownBashoNameJp,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen bg-[#09090B] flex flex-col overflow-hidden">
      {/* Subtle top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] pointer-events-none select-none"
        style={{
          background:
            "radial-gradient(ellipse at center top, rgba(220,38,38,0.07) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 py-32 md:py-40">

          {/* Status label */}
          <motion.div {...fadeUp(0)} className="mb-8">
            {isActive && bashoName ? (
              <span className="inline-flex items-center gap-2 bg-[#DC2626]/10 border border-[#DC2626]/25 text-[#DC2626] text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="animate-pulse-dot w-1.5 h-1.5 rounded-full bg-[#DC2626] inline-block" />
                LIVE — {bashoName}
              </span>
            ) : (
              <span className="text-[#52525B] text-xs font-medium tracking-[0.2em] uppercase">
                Makuuchi Division · Live Tracker
              </span>
            )}
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.1)}
            className="font-display font-black text-[#FAFAFA] leading-[0.9] tracking-tight"
            style={{ fontSize: "clamp(3.5rem, 10vw, 9rem)" }}
          >
            Follow Every
            <br />
            <span className="text-[#DC2626]">Bout.</span>
          </motion.h1>

          {/* Body copy */}
          <motion.p
            {...fadeUp(0.2)}
            className="mt-8 text-[#A1A1AA] text-lg md:text-xl leading-relaxed max-w-[500px]"
          >
            The premier sumo basho tracker. Live standings, bout-by-bout
            results, and the kimarite behind every victory — updated daily.
          </motion.p>

          {/* CTAs */}
          <motion.div {...fadeUp(0.3)} className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/rikishi"
              className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer"
            >
              All Rikishi <ArrowRight size={15} />
            </Link>
            <Link
              href="/basho"
              className="inline-flex items-center gap-2 bg-[#18181B] hover:bg-[#27272A] border border-[#3F3F46] text-[#FAFAFA] px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-200 cursor-pointer"
            >
              Basho Archive
            </Link>
            <Link
              href="/kimarite"
              className="inline-flex items-center text-[#52525B] hover:text-[#A1A1AA] px-4 py-3 text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              Kimarite →
            </Link>
          </motion.div>

          {/* Countdown — shown when no live basho */}
          {!isActive && countdownDate && countdownBashoName && countdownBashoNameJp && (
            <motion.div
              {...fadeUp(0.45)}
              className="mt-16 pt-8 border-t border-[#27272A]"
            >
              <NextBashoCountdown
                targetDate={countdownDate}
                bashoName={countdownBashoName}
                bashoNameJp={countdownBashoNameJp}
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        {...fadeUp(0.6)}
        className="relative z-10 flex justify-center pb-10"
        aria-hidden
      >
        <div className="flex flex-col items-center gap-2 text-[#3F3F46]">
          <span className="text-[9px] tracking-[0.35em] uppercase font-medium">
            Scroll
          </span>
          <ChevronDown size={13} className="animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
